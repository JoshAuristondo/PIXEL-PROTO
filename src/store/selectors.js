import { COMUNAS, BRANCHES } from './mockData';
import { isValidKeyEnc, splitIva, sum } from './utils';

export const DIGITAL_FORMATS = ['digital', 'suscripcion', 'dlc'];
export const isDigital = (p) => DIGITAL_FORMATS.includes(p.format);

export const currentUser = (s) => {
    const u = s.session && s.users.find((x) => x.id === s.session.userId);
    return u && u.active ? u : null;
};

export const getProduct = (s, id) => s.products.find((p) => p.id === id);
export const getBranch = (id) => BRANCHES.find((b) => b.id === id);
export const getUser = (s, id) => s.users.find((u) => u.id === id);

export const can = (s, module, perm = 'r') => {
    const u = currentUser(s);
    if (!u) return false;
    return !!s.rbac?.[u.role]?.[module]?.[perm];
};

export const usableKeys = (s, productId) =>
    s.keys.filter((k) => k.productId === productId && k.status === 'disponible' && isValidKeyEnc(k.enc));

export const availableWeb = (s, p) => (isDigital(p) ? usableKeys(s, p.id).length : p.stock.web);

export const totalStock = (s, p) => (isDigital(p) ? usableKeys(s, p.id).length : p.stock.s1 + p.stock.s2 + p.stock.s3 + p.stock.web);

export const stockLevel = (s, p) => {
    const total = totalStock(s, p);
    if (total <= 0) return { key: 'out', label: 'Agotado', tone: 'err' };
    if (!isDigital(p) && total <= 5) return { key: 'low', label: 'Últimas unidades', tone: 'warn' };
    if (isDigital(p) && total <= 3) return { key: 'low', label: 'Pocas claves', tone: 'warn' };
    return { key: 'ok', label: 'En stock', tone: 'ok' };
};

export const productRating = (s, productId) => {
    const rs = s.reviews.filter((r) => r.productId === productId);
    if (!rs.length) return { avg: 0, count: 0 };
    return { avg: sum(rs, (r) => r.rating) / rs.length, count: rs.length };
};

export const hasPurchased = (s, userId, productId) =>
    s.orders.some((o) => o.userId === userId && o.items.some((i) => i.productId === productId));

export const cartLines = (s) =>
    s.cart.items.map((i) => ({ ...i, product: getProduct(s, i.productId) })).filter((l) => l.product);

export const courierRate = (s, courierId) => s.couriers.find((c) => c.id === courierId)?.rate ?? 1;

export const shippingQuote = (s, lines, delivery) => {
    const physical = lines.filter((l) => !isDigital(l.product));
    if (!physical.length || delivery.mode !== 'domicilio') return 0;
    const base = COMUNAS[delivery.comuna] ?? 3490;
    const fragile = sum(physical.filter((l) => l.product.fragile), (l) => 1990 * l.qty);
    return Math.round((base * courierRate(s, delivery.courier) + fragile) / 10) * 10;
};

export const cartTotals = (s, delivery = s.cart.delivery) => {
    const lines = cartLines(s);
    const subtotal = sum(lines, (l) => l.product.price * l.qty);
    const shipping = shippingQuote(s, lines, delivery);
    const total = subtotal + shipping;
    return { lines, subtotal, shipping, total, ...splitIva(subtotal), count: sum(lines, (l) => l.qty), hasPhysical: lines.some((l) => !isDigital(l.product)) };
};

export const cartIssues = (s, delivery = s.cart.delivery) => {
    const issues = [];
    cartLines(s).forEach((l) => {
        if (isDigital(l.product)) {
            if (usableKeys(s, l.product.id).length < l.qty) issues.push(`${l.product.title}: no hay suficientes claves disponibles.`);
        } else if (delivery.mode === 'retiro') {
            if ((l.product.stock[delivery.branchId] ?? 0) < l.qty)
                issues.push(`${l.product.title}: sin stock suficiente en ${getBranch(delivery.branchId)?.name}.`);
        } else if (l.product.stock.web < l.qty) {
            issues.push(`${l.product.title}: stock web insuficiente (${l.product.stock.web}).`);
        }
    });
    return issues;
};

export const criticalItems = (s, branchId) =>
    s.products
        .filter((p) => p.active && !isDigital(p))
        .flatMap((p) =>
            (branchId ? [branchId] : ['s1', 's2', 's3'])
                .filter((b) => p.stock[b] <= p.critical)
                .map((b) => ({ product: p, branchId: b, qty: p.stock[b], level: p.stock[b] === 0 ? 'err' : p.stock[b] <= 1 ? 'err' : 'warn' })),
        );

export const keysByProduct = (s) => {
    const map = {};
    s.keys.forEach((k) => {
        map[k.productId] ??= { disponible: 0, asignada: 0, revocada: 0, corrupta: 0 };
        map[k.productId][k.status] = (map[k.productId][k.status] || 0) + 1;
    });
    return map;
};

export const recipientsFor = (s, branchId) =>
    s.subscribers.filter((x) => x.subscribed && (branchId === 'all' || x.branchId === branchId));

export const orderTotalsToday = (s) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const t = d.getTime();
    const web = sum(s.orders.filter((o) => o.ts >= t), (o) => o.total);
    const pos = sum(s.posSales.filter((o) => o.ts >= t), (o) => o.total);
    return { web, pos, count: s.orders.filter((o) => o.ts >= t).length + s.posSales.filter((o) => o.ts >= t).length };
};
