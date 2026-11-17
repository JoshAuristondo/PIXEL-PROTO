import { BRANCHES, ROLE_LABELS, SHIP_STAGES } from './mockData';
import { cartLines, cartTotals, currentUser, isDigital, usableKeys, getProduct } from './selectors';
import { decryptKey, encryptKey, hash53, hashHex, isValidKeyEnc, tempPassword } from './utils';

/* Reductor puro: cada handler recibe una copia superficial del estado y
   reasigna (nunca muta) los arreglos. Los ids/timestamps llegan en la acción. */

const nid = (s, prefix) => `${prefix}${++s.seq}`;

const actorOf = (s) => {
    const u = currentUser(s);
    return u ? { id: u.id, name: u.name } : { id: 'sys', name: 'Sistema' };
};

const ipFor = (id) => `190.45.${(hash53(id) % 200) + 10}.${(hash53(id + 'ip') % 200) + 10}`;

const audit = (s, ts, module, action, detail, actor) => {
    const a = actor || actorOf(s);
    const prev = s.audit.length ? s.audit[s.audit.length - 1].hash : '0'.repeat(14);
    const entry = {
        id: nid(s, 'a'), ts, userId: a.id, actor: a.name, module, action, detail,
        ip: ipFor(a.id), prevHash: prev, hash: hashHex(prev + module + action + detail + ts),
    };
    s.audit = [...s.audit, entry];
};

const mail = (s, ts, to, kind, subject, body) => {
    s.emails = [{ id: nid(s, 'm'), ts, to, kind, subject, body }, ...s.emails];
};

const branchName = (id) => BRANCHES.find((b) => b.id === id)?.name ?? id;
const courierName = (s, id) => s.couriers.find((c) => c.id === id)?.name ?? id;
const setStock = (s, productId, bucket, fn) => {
    s.products = s.products.map((p) => (p.id === productId ? { ...p, stock: { ...p.stock, [bucket]: Math.max(0, fn(p.stock[bucket])) } } : p));
};

// Asigna claves válidas (no duplicadas) a un pedido: devuelve [keys, ids]
const assignKeys = (keys, productId, qty, orderId, email, ts) => {
    const avail = usableKeys({ keys }, productId).slice(0, qty);
    const ids = new Set(avail.map((k) => k.id));
    return [keys.map((k) => (ids.has(k.id) ? { ...k, status: 'asignada', orderId, assignedTo: email, assignedAt: ts } : k)), avail.map((k) => k.id)];
};

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

const handlers = {
    RESET: (s, a) => a.state,

    /* ---------- sesión / usuarios ---------- */
    LOGIN(s, a) {
        const u = s.users.find((x) => x.id === a.userId);
        s.session = { userId: u.id, branchId: a.branchId || null, ts: a.ts };
        s.loginStats = { ...s.loginStats, ok: s.loginStats.ok + 1 };
        if (u.role !== 'comprador')
            audit(s, a.ts, 'Autenticación', 'Inicio de sesión', `${u.name} (${ROLE_LABELS[u.role]})${a.branchId ? ` en ${branchName(a.branchId)}` : ''}`, { id: u.id, name: u.name });
        return s;
    },
    LOGIN_FAIL(s, a) {
        s.loginStats = { ...s.loginStats, failed: s.loginStats.failed + 1, injection: s.loginStats.injection + (a.injection ? 1 : 0) };
        return s;
    },
    LOGOUT(s) {
        s.session = null;
        return s;
    },
    REGISTER(s, a) {
        const id = nid(s, 'u');
        const user = { ...a.user, id, role: 'comprador', points: 100, active: true, createdAt: a.ts };
        s.users = [...s.users, user];
        s.session = { userId: id, branchId: null, ts: a.ts };
        if (user.newsletter) s.subscribers = [...s.subscribers, { email: user.email, branchId: 's1', subscribed: true }];
        mail(s, a.ts, user.email, 'Bienvenida', '¡Bienvenido a Pixel Gamers!', `Hola ${user.name}, tu cuenta fue creada. Te regalamos 100 puntos gamer.`);
        return s;
    },
    UPDATE_PROFILE(s, a) {
        s.users = s.users.map((u) => (u.id === a.userId ? { ...u, ...a.patch } : u));
        return s;
    },
    CHANGE_PASSWORD(s, a) {
        s.users = s.users.map((u) => (u.id === a.userId ? { ...u, password: a.password, mustChange: false } : u));
        audit(s, a.ts, 'Autenticación', 'Cambio de contraseña', `Contraseña actualizada por el usuario ${a.userId}`, { id: a.userId, name: s.users.find((u) => u.id === a.userId)?.name });
        return s;
    },
    SUBSCRIBE(s, a) {
        const exists = s.subscribers.some((x) => x.email === a.email);
        s.subscribers = exists
            ? s.subscribers.map((x) => (x.email === a.email ? { ...x, subscribed: a.value } : x))
            : [...s.subscribers, { email: a.email, branchId: a.branchId || 's1', subscribed: a.value }];
        s.users = s.users.map((u) => (u.email === a.email ? { ...u, newsletter: a.value } : u));
        return s;
    },

    CONTACT_SEND(s, a) {
        const c = a.contact;
        const ref = a.ticket;
        mail(s, a.ts, 'soporte@pixelgamers.cl', 'Contacto', `[${ref}] ${c.reason} — ${c.name}`, `De: ${c.name} <${c.email}>${c.orderId ? `\nOrden: ${c.orderId}` : ''}\n\n${c.message}`);
        mail(s, a.ts, c.email, 'Contacto', `Recibimos tu mensaje (${ref})`, `Hola ${c.name}, recibimos tu mensaje sobre "${c.reason}". Un ejecutivo te responderá en un máximo de 1 día hábil. Tu número de ticket es ${ref}.`);
        return s;
    },

    /* ---------- carrito ---------- */
    CART_ADD(s, a) {
        const p = getProduct(s, a.productId);
        if (!p) return s;
        const max = isDigital(p) ? usableKeys(s, p.id).length : p.stock.web;
        if (max <= 0) return s;
        const existing = s.cart.items.find((i) => i.productId === a.productId);
        const qty = clamp((existing?.qty || 0) + a.qty, 1, Math.min(max, 5));
        const items = existing ? s.cart.items.map((i) => (i.productId === a.productId ? { ...i, qty } : i)) : [...s.cart.items, { productId: a.productId, qty }];
        s.cart = { ...s.cart, items, reservedAt: s.cart.reservedAt ?? a.ts };
        return s;
    },
    CART_QTY(s, a) {
        const p = getProduct(s, a.productId);
        const max = p ? (isDigital(p) ? usableKeys(s, p.id).length : p.stock.web) : 1;
        s.cart = { ...s.cart, items: s.cart.items.map((i) => (i.productId === a.productId ? { ...i, qty: clamp(a.qty, 1, Math.min(Math.max(max, 1), 5)) } : i)) };
        return s;
    },
    CART_REMOVE(s, a) {
        const items = s.cart.items.filter((i) => i.productId !== a.productId);
        s.cart = { ...s.cart, items, reservedAt: items.length ? s.cart.reservedAt : null };
        return s;
    },
    CART_CLEAR(s) {
        s.cart = { ...s.cart, items: [], reservedAt: null };
        return s;
    },
    CART_DELIVERY(s, a) {
        s.cart = { ...s.cart, delivery: { ...s.cart.delivery, ...a.patch } };
        return s;
    },
    CART_RENEW(s, a) {
        s.cart = { ...s.cart, reservedAt: a.ts };
        return s;
    },

    /* ---------- checkout ---------- */
    PLACE_ORDER(s, a) {
        const lines = cartLines(s);
        if (!lines.length) return s;
        const totals = cartTotals(s, a.delivery);
        let keys = s.keys;
        const keyIds = [];
        const items = [];
        lines.forEach((l) => {
            items.push({ productId: l.product.id, qty: l.qty, price: l.product.price, format: l.product.format });
            if (isDigital(l.product)) {
                const [k2, ids] = assignKeys(keys, l.product.id, l.qty, a.orderId, a.customer.email, a.ts);
                keys = k2;
                keyIds.push(...ids);
            } else {
                setStock(s, l.product.id, a.delivery.mode === 'retiro' ? a.delivery.branchId : 'web', (v) => v - l.qty);
            }
        });
        s.keys = keys;

        const retiro = totals.hasPhysical && a.delivery.mode === 'retiro';
        const domicilio = totals.hasPhysical && a.delivery.mode === 'domicilio';
        const order = {
            id: a.orderId, folio: 100300 + s.seq++, userId: a.userId, ts: a.ts, channel: 'web', items,
            total: totals.total, shipping: totals.shipping,
            delivery: { ...a.delivery, pickupCode: retiro ? `RT-${hashHex(a.orderId).slice(0, 6).toUpperCase()}` : null },
            payment: { ...a.payment, status: 'Pagado', auth: hashHex(a.orderId + 'auth').slice(0, 6).toUpperCase() },
            status: retiro ? 'Listo para retiro' : domicilio ? 'En preparación' : 'Entregado (digital)',
            stage: domicilio ? 0 : null,
            tracking: null,
            keyIds,
        };
        s.orders = [order, ...s.orders];
        s.users = s.users.map((u) => (u.id === a.userId ? { ...u, points: (u.points || 0) + Math.floor(totals.total / 1000), phone: a.customer.phone || u.phone } : u));
        s.cart = { ...s.cart, items: [], reservedAt: null };

        const lineTxt = lines.map((l) => `${l.qty}× ${l.product.title}`).join(', ');
        mail(s, a.ts, a.customer.email, 'Boleta', `Boleta electrónica ${order.id}`, `Pago aprobado (${a.payment.gateway} · ${a.payment.method}). ${lineTxt}. Total: $${totals.total.toLocaleString('es-CL')}. Adjuntamos PDF y XML.`);
        if (keyIds.length) {
            const codes = keyIds.map((id) => {
                const k = keys.find((x) => x.id === id);
                return `${getProduct(s, k.productId).title}: ${decryptKey(k.enc)}`;
            });
            mail(s, a.ts, a.customer.email, 'Clave digital', `Tus claves digitales — ${order.id}`, `Canjea tus claves siguiendo la guía en tu bóveda:\n${codes.join('\n')}`);
        }
        if (retiro) mail(s, a.ts, a.customer.email, 'Retiro', `Tu pedido ${order.id} está listo para retiro`, `Código de retiro ${order.delivery.pickupCode} en ${branchName(a.delivery.branchId)} (máx. 2 horas hábiles).`);
        audit(s, a.ts, 'Ventas', 'Orden pagada', `${order.id} · ${lineTxt} · $${totals.total.toLocaleString('es-CL')} (${a.payment.gateway})`, { id: a.userId, name: a.customer.name });
        keyIds.forEach((id) => {
            const k = keys.find((x) => x.id === id);
            audit(s, a.ts, 'Claves', 'Clave despachada', `Orden ${order.id} · ${getProduct(s, k.productId).title} · ${a.customer.email} · hash ${k.hash.slice(0, 10)} · válida`, { id: 'sys', name: 'Sistema' });
        });
        return s;
    },
    PAYMENT_REJECTED(s, a) {
        s.cart = { ...s.cart, reservedAt: null };
        mail(s, a.ts, a.email, 'Pago', 'Pago rechazado', `La pasarela rechazó tu pago (${a.reason}). Liberamos la reserva de stock; puedes reintentar cuando quieras.`);
        audit(s, a.ts, 'Ventas', 'Pago rechazado', `${a.orderId} · ${a.gateway} · ${a.reason} — reserva liberada`, { id: a.userId || 'sys', name: a.name || 'Cliente' });
        return s;
    },

    /* ---------- logística ---------- */
    SET_TRACKING(s, a) {
        s.orders = s.orders.map((o) =>
            o.id !== a.orderId
                ? o
                : {
                      ...o, stage: 1, status: SHIP_STAGES[1],
                      tracking: { id: a.trackingId, courier: a.courier, events: [...(o.tracking?.events || [{ ts: o.ts, stage: 0, text: 'Pedido recibido y en preparación en bodega' }]), { ts: a.ts, stage: 1, text: `Entregado a ${courierName(s, a.courier)} — en camino` }] },
                  },
        );
        const o = s.orders.find((x) => x.id === a.orderId);
        const u = s.users.find((x) => x.id === o.userId);
        if (u) mail(s, a.ts, u.email, 'Despacho', `Tu pedido ${o.id} va en camino`, `Seguimiento ${a.trackingId} (${courierName(s, a.courier)}). Rastrea en /tracking.`);
        audit(s, a.ts, 'Logística', 'Tracking asignado', `${o.id} → ${a.trackingId} (${courierName(s, a.courier)})`);
        return s;
    },
    ADVANCE_SHIP(s, a) {
        const texts = ['', 'En camino', 'En reparto hacia tu comuna', 'Entregado al cliente'];
        s.orders = s.orders.map((o) => {
            if (o.id !== a.orderId || o.stage == null || o.stage >= 3 || !o.tracking) return o;
            const stage = o.stage + 1;
            return { ...o, stage, status: SHIP_STAGES[stage], tracking: { ...o.tracking, events: [...o.tracking.events, { ts: a.ts, stage, text: texts[stage] }] } };
        });
        const o = s.orders.find((x) => x.id === a.orderId);
        const u = s.users.find((x) => x.id === o.userId);
        if (u) mail(s, a.ts, u.email, 'Despacho', `Actualización de tu pedido ${o.id}`, `Nuevo estado: ${o.status}.`);
        audit(s, a.ts, 'Logística', 'Estado de despacho', `${o.id} → ${o.status}`);
        return s;
    },
    LABEL_PRINTED(s, a) {
        s.orders = s.orders.map((o) => (o.id === a.orderId ? { ...o, labelAt: a.ts } : o));
        audit(s, a.ts, 'Logística', 'Etiqueta generada', `Etiqueta PDF + packing slip del pedido ${a.orderId}`);
        return s;
    },
    PICKUP_DELIVER(s, a) {
        s.orders = s.orders.map((o) => (o.id === a.orderId ? { ...o, status: 'Entregado en Sucursal', pickup: { ts: a.ts, rut: a.rut, signature: a.signature, by: actorOf(s).name } } : o));
        audit(s, a.ts, 'Retiro en tienda', 'Entrega presencial', `Pedido ${a.orderId} entregado — RUT ${a.rut} (firma digital)`);
        return s;
    },

    /* ---------- inventario ---------- */
    STOCK_RECEIVE(s, a) {
        setStock(s, a.productId, a.branchId, (v) => v + a.qty);
        const code = `INV-${String(++s.seq).padStart(4, '0')}`;
        s.stockLog = [{ id: code, ts: a.ts, kind: 'Recepción', productId: a.productId, branchId: a.branchId, qty: a.qty, note: `Factura ${a.invoice} · ${a.supplier}` }, ...s.stockLog];
        audit(s, a.ts, 'Ajuste de stock', 'Recepción de mercadería', `${getProduct(s, a.productId).title} +${a.qty} en ${branchName(a.branchId)} · factura ${a.invoice} · código ${code}`);
        return s;
    },
    ADJUST_REQUEST(s, a) {
        const adj = { id: nid(s, 'adj'), code: `INV-${String(++s.seq).padStart(4, '0')}`, ts: a.ts, productId: a.productId, branchId: a.branchId, qty: a.qty, reason: a.reason, evidence: a.evidence, status: a.needsApproval ? 'Pendiente' : 'Aplicada', by: actorOf(s).name };
        s.adjustments = [adj, ...s.adjustments];
        if (!a.needsApproval) setStock(s, a.productId, a.branchId, (v) => v - a.qty);
        audit(s, a.ts, 'Ajuste de stock', adj.status === 'Aplicada' ? 'Merma registrada' : 'Ajuste solicitado', `${getProduct(s, a.productId).title} −${a.qty} (${a.reason}) en ${branchName(a.branchId)} · ${adj.code}${a.needsApproval ? ' · requiere aprobación' : ''}`);
        return s;
    },
    ADJUST_DECIDE(s, a) {
        const adj = s.adjustments.find((x) => x.id === a.id);
        if (!adj || adj.status !== 'Pendiente') return s;
        s.adjustments = s.adjustments.map((x) => (x.id === a.id ? { ...x, status: a.approve ? 'Aplicada' : 'Rechazada' } : x));
        if (a.approve) setStock(s, adj.productId, adj.branchId, (v) => v - adj.qty);
        audit(s, a.ts, 'Ajuste de stock', a.approve ? 'Ajuste aprobado' : 'Ajuste rechazado', `${adj.code} · ${getProduct(s, adj.productId).title} −${adj.qty}`);
        return s;
    },
    SET_THRESHOLD(s, a) {
        s.products = s.products.map((p) => (p.id === a.productId ? { ...p, critical: a.value } : p));
        audit(s, a.ts, 'Inventario', 'Umbral crítico', `${getProduct(s, a.productId).title}: umbral = ${a.value}`);
        return s;
    },
    REPLENISH_REQUEST(s, a) {
        s.replenish = [{ id: nid(s, 'rp'), ts: a.ts, productId: a.productId, branchId: a.branchId, by: actorOf(s).name }, ...s.replenish];
        audit(s, a.ts, 'Inventario', 'Solicitud de reposición', `${getProduct(s, a.productId).title} · ${branchName(a.branchId)}`);
        return s;
    },

    /* ---------- claves digitales ---------- */
    KEYS_IMPORT(s, a) {
        const base = s.keys.length + 1;
        const added = a.rows.map((r, i) => ({
            id: `k${String(base + i).padStart(3, '0')}${s.seq}`, productId: r.productId, enc: encryptKey(r.code), hash: hashHex(r.code),
            status: 'disponible', orderId: null, assignedTo: null, assignedAt: null, importedAt: a.ts,
        }));
        s.keys = [...s.keys, ...added];
        s.importReports = [{ id: nid(s, 'imp'), ts: a.ts, filename: a.filename, ok: a.rows.length, failed: a.errors.length, errors: a.errors }, ...s.importReports];
        audit(s, a.ts, 'Claves', 'Carga masiva de claves', `${a.filename}: ${a.rows.length} exitosas, ${a.errors.length} fallidas (AES-256 simulado)`);
        return s;
    },
    KEYS_AUDIT_SCAN(s, a) {
        const seen = new Set();
        let corrupt = 0;
        let duplicate = 0;
        s.keys = s.keys.map((k) => {
            if (!isValidKeyEnc(k.enc)) {
                if (k.status !== 'corrupta') corrupt++;
                return { ...k, status: 'corrupta' };
            }
            if (seen.has(k.hash)) {
                if (k.status === 'disponible') duplicate++;
                return k.status === 'disponible' ? { ...k, status: 'revocada' } : k;
            }
            seen.add(k.hash);
            return k;
        });
        s.lastKeyAudit = { ts: a.ts, scanned: s.keys.length, corrupt, duplicate };
        audit(s, a.ts, 'Claves', 'Auditoría de integridad', `${s.keys.length} claves escaneadas · ${corrupt} corruptas · ${duplicate} duplicadas bloqueadas`);
        return s;
    },

    /* ---------- POS ---------- */
    POS_SALE(s, a) {
        const sale = { ...a.sale };
        let keys = s.keys;
        const keyIds = [];
        sale.lines.forEach((l) => {
            const p = getProduct(s, l.productId);
            if (isDigital(p)) {
                const [k2, ids] = assignKeys(keys, p.id, l.qty, sale.id, 'Entregada en tienda', a.ts);
                keys = k2.map((k) => (ids.includes(k.id) ? { ...k, status: 'asignada', channel: 'tienda' } : k));
                keyIds.push(...ids);
            } else setStock(s, p.id, sale.branchId, (v) => v - l.qty);
        });
        s.keys = keys;
        sale.keyIds = keyIds;
        s.posSales = [sale, ...s.posSales];
        audit(s, a.ts, 'Ventas', sale.pending ? 'Venta POS (offline)' : 'Venta POS', `${sale.id} · folio ${sale.folio} · ${branchName(sale.branchId)} · $${sale.total.toLocaleString('es-CL')} · vendedor ${sale.sellerName}`);
        keyIds.forEach((id) => {
            const k = keys.find((x) => x.id === id);
            audit(s, a.ts, 'Claves', 'Clave entregada en tienda', `${sale.id} · ${getProduct(s, k.productId).title} · hash ${k.hash.slice(0, 10)}`);
        });
        return s;
    },
    OFFLINE_SET(s, a) {
        s.offline = a.value;
        audit(s, a.ts, 'POS', a.value ? 'Modo offline activado' : 'Conexión restablecida', a.value ? 'Se pierde conexión: ventas se guardan en caché local' : 'Conexión recuperada');
        return s;
    },
    POS_SYNC(s, a) {
        const n = s.posSales.filter((x) => x.pending).length;
        s.posSales = s.posSales.map((x) => ({ ...x, pending: false }));
        if (n) audit(s, a.ts, 'POS', 'Sincronización offline', `${n} venta(s) sincronizada(s) con el servidor central`);
        return s;
    },

    /* ---------- traslados ---------- */
    TRANSFER_REQUEST(s, a) {
        s.transfers = [{ id: nid(s, 't'), ts: a.ts, fromBranch: a.fromBranch, toBranch: a.toBranch, productId: a.productId, qty: a.qty, status: 'Solicitado', requestedBy: actorOf(s).name, guide: null }, ...s.transfers];
        audit(s, a.ts, 'Traslados', 'Solicitud de traspaso', `${getProduct(s, a.productId).title} ×${a.qty}: ${branchName(a.fromBranch)} → ${branchName(a.toBranch)}`);
        return s;
    },
    TRANSFER_DECIDE(s, a) {
        const t = s.transfers.find((x) => x.id === a.id);
        if (!t || t.status !== 'Solicitado') return s;
        if (a.approve) {
            setStock(s, t.productId, t.fromBranch, (v) => v - t.qty);
            s.transfers = s.transfers.map((x) => (x.id === a.id ? { ...x, status: 'En Tránsito Inter-Sucursal', guide: `GT-${String(++s.seq).padStart(5, '0')}`, approvedBy: actorOf(s).name } : x));
        } else s.transfers = s.transfers.map((x) => (x.id === a.id ? { ...x, status: 'Rechazado' } : x));
        audit(s, a.ts, 'Traslados', a.approve ? 'Traspaso autorizado' : 'Traspaso rechazado', `${getProduct(s, t.productId).title} ×${t.qty} (${branchName(t.fromBranch)} → ${branchName(t.toBranch)})`);
        return s;
    },
    TRANSFER_RECEIVE(s, a) {
        const t = s.transfers.find((x) => x.id === a.id);
        if (!t || t.status !== 'En Tránsito Inter-Sucursal') return s;
        setStock(s, t.productId, t.toBranch, (v) => v + t.qty);
        s.transfers = s.transfers.map((x) => (x.id === a.id ? { ...x, status: 'Recibido', receivedAt: a.ts } : x));
        audit(s, a.ts, 'Traslados', 'Traspaso recibido', `${t.guide} · ${getProduct(s, t.productId).title} ×${t.qty} en ${branchName(t.toBranch)}`);
        return s;
    },

    /* ---------- usuarios administrativos ---------- */
    USER_CREATE(s, a) {
        const id = nid(s, 'u');
        const temp = tempPassword(id + a.ts);
        s.users = [...s.users, { ...a.data, id, password: temp, mustChange: true, active: true, createdAt: a.ts }];
        mail(s, a.ts, a.data.email, 'Invitación', 'Invitación a Pixel Gamers (cuenta administrativa)', `Hola ${a.data.name}, tu rol es ${ROLE_LABELS[a.data.role]}. Contraseña temporal de un solo uso: ${temp} (deberás cambiarla al ingresar).`);
        audit(s, a.ts, 'Usuarios', 'Alta de usuario', `${a.data.name} · ${ROLE_LABELS[a.data.role]} · ${a.data.branches.map(branchName).join(', ') || 'sin sucursal'}`);
        return s;
    },
    USER_TOGGLE(s, a) {
        const u = s.users.find((x) => x.id === a.userId);
        s.users = s.users.map((x) => (x.id === a.userId ? { ...x, active: !x.active } : x));
        if (s.session?.userId === a.userId && u.active) s.session = null;
        audit(s, a.ts, 'Usuarios', u.active ? 'Cuenta desactivada' : 'Cuenta reactivada', `${u.name} (${ROLE_LABELS[u.role]})${u.active ? ' — sesiones cerradas' : ''}`);
        return s;
    },
    USER_RESET(s, a) {
        const temp = tempPassword(a.userId + a.ts);
        const u = s.users.find((x) => x.id === a.userId);
        s.users = s.users.map((x) => (x.id === a.userId ? { ...x, password: temp, mustChange: true } : x));
        mail(s, a.ts, u.email, 'Seguridad', 'Reseteo administrativo de credenciales', `Clave temporal de un solo uso: ${temp}. Debes cambiarla en tu próximo inicio de sesión.`);
        audit(s, a.ts, 'Usuarios', 'Reseteo de credenciales', `Reseteo administrativo para ${u.name}`);
        return s;
    },
    USER_BRANCHES(s, a) {
        s.users = s.users.map((x) => (x.id === a.userId ? { ...x, branches: a.branches } : x));
        audit(s, a.ts, 'Usuarios', 'Sucursales asignadas', `${s.users.find((x) => x.id === a.userId).name}: ${a.branches.map(branchName).join(', ') || '—'}`);
        return s;
    },
    RBAC_SET(s, a) {
        s.rbac = { ...s.rbac, [a.role]: { ...s.rbac[a.role], [a.module]: { ...s.rbac[a.role][a.module], [a.perm]: a.value } } };
        audit(s, a.ts, 'Permisos', 'Cambio de permisos', `${ROLE_LABELS[a.role]} · ${a.module} · ${a.perm.toUpperCase()} = ${a.value ? 'sí' : 'no'}`);
        return s;
    },

    /* ---------- marketing / comunidad ---------- */
    CAMPAIGN_CREATE(s, a) {
        s.campaigns = [{ ...a.campaign, id: nid(s, 'c'), status: 'Programada', sentAt: null, sent: 0, opens: 0, clicks: 0, createdBy: actorOf(s).name }, ...s.campaigns];
        audit(s, a.ts, 'Marketing', 'Campaña programada', `${a.campaign.name} → ${a.campaign.branchId === 'all' ? 'todas las sucursales' : branchName(a.campaign.branchId)}`);
        return s;
    },
    CAMPAIGN_SEND(s, a) {
        s.campaigns = s.campaigns.map((c) => (c.id === a.id ? { ...c, status: 'Enviada', sentAt: a.ts, sent: a.sent, opens: a.opens, clicks: a.clicks } : c));
        const c = s.campaigns.find((x) => x.id === a.id);
        mail(s, a.ts, 'segmento@pixelgamers.cl', 'Campaña', `[Campaña] ${c.subject}`, `Enviada a ${a.sent} suscriptores (se respetó la lista de desuscritos).`);
        audit(s, a.ts, 'Marketing', 'Campaña enviada', `${c.name}: ${a.sent} destinatarios`);
        return s;
    },
    WAITLIST_ADD(s, a) {
        if (s.waitlist.some((w) => w.productId === a.productId && w.email === a.email)) return s;
        s.waitlist = [...s.waitlist, { productId: a.productId, email: a.email, ts: a.ts }];
        return s;
    },
    REVIEW_ADD(s, a) {
        s.reviews = [{ id: nid(s, 'r'), productId: a.productId, userId: a.userId, userName: a.userName, rating: a.rating, text: a.text, ts: a.ts, verified: true }, ...s.reviews];
        return s;
    },

    /* ---------- salud / infra ---------- */
    HEALTH_RUN(s, a) {
        s.services = s.services.map((x) => {
            const r = a.rolls[x.id];
            return x.down ? { ...x, latency: null, success: 0, fails: x.fails + 1 } : { ...x, latency: r.latency, success: r.success, fails: 0 };
        });
        s.couriers = s.couriers.map((x) => {
            const r = a.rolls[x.id];
            if (x.down) {
                const fails = x.fails + 1;
                return { ...x, latency: null, success: 0, fails, active: fails >= 3 ? false : x.active };
            }
            return { ...x, latency: r.latency, success: r.success, fails: 0 };
        });
        s.healthCheckedAt = a.ts;
        const primary = s.couriers.find((c) => c.id === s.primaryCourier);
        if (primary && !primary.active) {
            const alt = s.couriers.find((c) => c.active);
            if (alt) {
                audit(s, a.ts, 'Salud', 'Conmutación automática', `${primary.name} desactivado tras 3 fallos; despachos → ${alt.name}`, { id: 'sys', name: 'Sistema' });
                s.primaryCourier = alt.id;
            }
        }
        return s;
    },
    HEALTH_DOWN_TOGGLE(s, a) {
        const key = a.kind === 'courier' ? 'couriers' : 'services';
        s[key] = s[key].map((x) => (x.id === a.id ? { ...x, down: !x.down, fails: x.down ? 0 : x.fails } : x));
        return s;
    },
    COURIER_TOGGLE(s, a) {
        s.couriers = s.couriers.map((c) => (c.id === a.id ? { ...c, active: !c.active, fails: 0, down: false } : c));
        return s;
    },
    FAILOVER(s, a) {
        const alt = s.couriers.find((c) => c.active && c.id !== s.primaryCourier);
        if (!alt) return s;
        audit(s, a.ts, 'Salud', 'Conmutación de emergencia', `Courier principal ${courierName(s, s.primaryCourier)} → ${alt.name}`);
        s.primaryCourier = alt.id;
        return s;
    },
    INFRA_PATCH(s, a) {
        s.infra = { ...s.infra, ...a.patch };
        return s;
    },
    INFRA_TICK(s, a) {
        const i = s.infra;
        const target = i.peak ? 86 : 34;
        const cpu = Math.round(clamp(i.cpu + (target - i.cpu) * 0.35 + a.noise * 6, 8, 99));
        const mem = Math.round(clamp(i.mem + ((i.peak ? 78 : 52) - i.mem) * 0.3 + a.noise * 3, 20, 97));
        let instances = i.instances;
        if (cpu > i.cpuThreshold && instances < i.maxInstances) instances++;
        else if (cpu < i.cpuThreshold - 30 && instances > 2) instances--;
        s.infra = { ...i, cpu, mem, instances, spendToday: i.spendToday + instances * 120, history: [...i.history.slice(-23), cpu] };
        return s;
    },
    DRP_BACKUP(s, a) {
        s.infra = { ...s.infra, drp: { ...s.infra.drp, lastBackup: a.ts } };
        audit(s, a.ts, 'DRP', 'Respaldo manual', 'Copia de respaldo cifrada generada y replicada en otra región');
        return s;
    },
    DRP_RESTORE(s, a) {
        s.infra = { ...s.infra, drp: { ...s.infra.drp, restores: s.infra.drp.restores + 1, status: 'Operativo' } };
        audit(s, a.ts, 'DRP', 'Restauración ejecutada', `Restauración simulada desde respaldo (RTO objetivo ${s.infra.drp.rtoHours} h · RPO ${s.infra.drp.rpoMin} min) con 2FA + doble confirmación`);
        return s;
    },
};

export function reducer(state, action) {
    const h = handlers[action.type];
    return h ? h({ ...state }, action) : state;
}
