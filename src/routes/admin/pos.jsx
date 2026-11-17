import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, Badge, Alert, Field, Modal, PrintSheet, FakeQR, Barcode } from "../../components/ui/Ui";
import Cover from "../../components/ui/Cover";
import { useStore } from "../../store/StoreContext";
import { BRANCHES } from "../../store/mockData";
import { can, criticalItems, getBranch, getProduct, isDigital, usableKeys } from "../../store/selectors";
import { beep, clp, decryptKey, fmtDateTime, splitIva, sum } from "../../store/utils";

const METHODS = ['Efectivo', 'Débito', 'Crédito', 'Transferencia'];
const IDLE_MS = 3 * 60 * 1000;

const stockTone = (n, crit) => (n <= 0 ? 'err' : n <= crit ? 'warn' : 'ok');

const Pos = ({ forceOffline = false }) => {
    const { state, api, user, notify } = useStore();
    const branchId = state.session?.branchId || user.branches?.[0] || 's1';
    const [branch, setBranch] = useState(branchId);
    const [scan, setScan] = useState('');
    const [query, setQuery] = useState('');
    const [lines, setLines] = useState([]);
    const [phase, setPhase] = useState('sell'); // sell | pay | done
    const [payments, setPayments] = useState([]);
    const [method, setMethod] = useState('Efectivo');
    const [amount, setAmount] = useState('');
    const [rut, setRut] = useState('');
    const [lastSaleId, setLastSaleId] = useState(null);
    const [voucher, setVoucher] = useState(false);
    const [msg, setMsg] = useState(null);
    const [locked, setLocked] = useState(false);
    const [pin, setPin] = useState('');
    const lastActive = useRef(Date.now());
    const scanRef = useRef(null);
    const canSell = can(state, 'pos', 'c');
    const offline = state.offline;

    // Pantalla "POS offline": fuerza el modo al entrar
    useEffect(() => {
        if (forceOffline) api.setOffline(true);
    }, [forceOffline, api]);

    // Bloqueo por inactividad (3 min) — solo cajeros con PIN
    useEffect(() => {
        if (!user.pin) return undefined;
        const t = setInterval(() => { if (Date.now() - lastActive.current > IDLE_MS) setLocked(true); }, 5000);
        return () => clearInterval(t);
    }, [user.pin]);

    const products = useMemo(() => state.products.filter((p) => p.active), [state.products]);
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        return (q ? products.filter((p) => `${p.title} ${p.sku} ${p.barcode}`.toLowerCase().includes(q)) : products).slice(0, 12);
    }, [products, query]);

    const localStock = (p) => (isDigital(p) ? usableKeys(state, p.id).length : p.stock[branch]);
    const detail = lines.map((l) => ({ ...l, product: getProduct(state, l.productId) }));
    const total = sum(detail, (l) => l.product.price * l.qty);
    const { neto, iva } = splitIva(total);
    const paid = sum(payments, (p) => p.amount);
    const remaining = Math.max(0, total - paid);
    const cashPaid = sum(payments.filter((p) => p.method === 'Efectivo'), (p) => p.amount);
    const change = paid > total ? Math.min(paid - total, cashPaid) : 0;
    const critical = criticalItems(state, branch);
    const pendingSales = state.posSales.filter((s) => s.pending);

    const addProduct = (p, qty = 1) => {
        if (offline && isDigital(p)) { beep(180, 250); return setMsg({ tone: 'err', text: 'En modo offline no se pueden vender claves digitales (evita duplicar licencias).' }); }
        const avail = localStock(p);
        const cur = lines.find((l) => l.productId === p.id)?.qty || 0;
        if (cur + qty > avail) { beep(180, 250); return setMsg({ tone: 'err', text: `Stock local insuficiente de «${p.title}» (${avail} u.).` }); }
        setMsg(null);
        setLines((ls) => (cur ? ls.map((l) => (l.productId === p.id ? { ...l, qty: l.qty + qty } : l)) : [...ls, { productId: p.id, qty }]));
    };

    const onScan = (e) => {
        e.preventDefault();
        const code = scan.trim().toLowerCase();
        if (!code) return;
        const p = products.find((x) => x.barcode === code || x.sku.toLowerCase() === code);
        setScan('');
        if (!p) {
            beep(150, 300);
            setQuery(scan);
            return setMsg({ tone: 'err', text: `Código «${scan}» no existe. Se abrió la búsqueda manual por nombre.` });
        }
        beep(880, 80);
        addProduct(p);
    };

    const addPayment = () => {
        const n = Math.round(Number(amount) || remaining);
        if (n <= 0) return;
        setPayments((ps) => [...ps, { method, amount: n }]);
        setAmount('');
    };

    const finalize = () => {
        for (const l of detail) {
            if (isDigital(l.product) ? usableKeys(state, l.productId).length < l.qty : l.product.stock[branch] < l.qty) return notify(`Stock insuficiente: ${l.product.title}`, 'err');
        }
        const id = `POS-${String(Date.now()).slice(-6)}`;
        api.posSale({
            id, folio: 500000 + state.posSales.length + 1, ts: Date.now(), branchId: branch, sellerId: user.id, sellerName: user.name,
            lines: detail.map((l) => ({ productId: l.productId, qty: l.qty, price: l.product.price })),
            payments, total, change, customerRut: rut || null, pending: offline,
        });
        setLastSaleId(id);
        setPhase('done');
    };

    const reset = () => { setLines([]); setPayments([]); setRut(''); setPhase('sell'); setLastSaleId(null); setMsg(null); setTimeout(() => scanRef.current?.focus(), 50); };

    const sale = state.posSales.find((s) => s.id === lastSaleId);
    const saleKeys = sale?.keyIds?.map((id) => state.keys.find((k) => k.id === id)).filter(Boolean) || [];

    return (
        <div className={`px-stack ${offline ? 'pos--offline' : ''}`} style={{ gap: 22 }} onPointerDown={() => (lastActive.current = Date.now())} onKeyDown={() => (lastActive.current = Date.now())}>
            {offline && (
                <div className="pos__banner" role="alert">
                    <span>⚠ MODO OFFLINE — las ventas se guardan en caché local (SQLite) y se sincronizan al volver internet. Venta de claves digitales bloqueada.</span>
                    <span>{pendingSales.length} pendiente(s)</span>
                </div>
            )}

            <div className="px-row px-row--between">
                <div className="px-row">
                    <select className="px-select" style={{ width: 'auto' }} value={branch} onChange={(e) => { setBranch(e.target.value); setLines([]); }} disabled={user.role === 'vendedor'} aria-label="Sucursal">
                        {BRANCHES.filter((b) => user.role === 'vendedor' ? b.id === branchId : true).map((b) => <option key={b.id} value={b.id}>{b.short} · {b.name}</option>)}
                    </select>
                    <Badge tone={offline ? 'warn' : 'ok'}>{offline ? 'Sin conexión' : 'En línea'}</Badge>
                </div>
                <div className="px-row">
                    {offline ? (
                        <button className="px-btn px-btn--primary" onClick={() => { api.setOffline(false); setTimeout(api.syncPos, 400); notify('Conexión restablecida: sincronizando ventas…'); }}>Restablecer internet y sincronizar</button>
                    ) : (
                        <button className="px-btn" onClick={() => api.setOffline(true)}>Simular corte de internet</button>
                    )}
                </div>
            </div>

            {phase === 'sell' && (
                <div className="pos">
                    <div className="px-stack">
                        <Panel title="Escáner / SKU">
                            <form onSubmit={onScan}>
                                <input ref={scanRef} className="px-input pos__scan" value={scan} onChange={(e) => setScan(e.target.value)} placeholder="Escanea código de barras o escribe SKU y presiona Enter" autoFocus aria-label="Escáner" />
                            </form>
                            <span className="px-field__hint">Prueba: {products[0]?.barcode} o {products[1]?.sku}. Escaneos sucesivos suman unidades.</span>
                            {msg && <Alert tone={msg.tone}>{msg.text}</Alert>}
                            <input className="px-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Búsqueda manual por nombre…" aria-label="Búsqueda manual" />
                            <div className="pos__grid">
                                {results.map((p) => {
                                    const n = localStock(p);
                                    return (
                                        <button key={p.id} className="pos__tile" disabled={n <= 0 || !canSell || (offline && isDigital(p))} onClick={() => addProduct(p)}>
                                            <strong>{p.title}</strong>
                                            <span className="px-mono">{clp(p.price)}</span>
                                            <span><i className={`stock-dot stock-dot--${stockTone(n, p.critical)}`} />{isDigital(p) ? `${n} claves` : `${n} en tienda`}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Panel>

                        {critical.length > 0 && (
                            <Panel title={`Alertas de stock crítico (${critical.length})`} note="Indicador amarillo/rojo cuando el stock local es ≤ umbral. Solicita reposición a bodega central con un clic.">
                                <div className="px-table-wrap">
                                    <table className="px-table">
                                        <tbody>
                                            {critical.slice(0, 8).map((c) => (
                                                <tr key={`${c.product.id}-${c.branchId}`}>
                                                    <td><i className={`stock-dot stock-dot--${c.level}`} />{c.product.title}</td>
                                                    <td className="num">{c.qty} u.</td>
                                                    <td className="num">{state.replenish.some((r) => r.productId === c.product.id && r.branchId === c.branchId) ? <Badge tone="info">Solicitada</Badge> : <button className="px-btn px-btn--sm" onClick={() => { api.requestReplenish(c.product.id, c.branchId); notify('Solicitud de reposición enviada al Supervisor'); }}>Solicitar reposición</button>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Panel>
                        )}
                    </div>

                    <Panel title="Venta actual">
                        {detail.length === 0 && <p className="px-muted">Escanea un producto para comenzar.</p>}
                        {detail.map((l) => (
                            <div key={l.productId} className="px-row px-row--between" style={{ alignItems: 'flex-start' }}>
                                <div style={{ width: 44 }}><Cover product={l.product} /></div>
                                <div style={{ flex: 1, minWidth: 120 }}>
                                    <strong>{l.product.title}</strong><br />
                                    <span className="px-muted px-mono">{clp(l.product.price)} · <i className={`stock-dot stock-dot--${stockTone(localStock(l.product), l.product.critical)}`} />local {localStock(l.product)}</span>
                                </div>
                                <div className="px-row" style={{ gap: 4 }}>
                                    <button className="px-btn px-btn--sm" onClick={() => setLines((ls) => ls.map((x) => (x.productId === l.productId ? { ...x, qty: Math.max(1, x.qty - 1) } : x)))}>−</button>
                                    <span className="px-mono">{l.qty}</span>
                                    <button className="px-btn px-btn--sm" onClick={() => addProduct(l.product)}>+</button>
                                    <button className="px-btn px-btn--sm px-btn--danger" onClick={() => setLines((ls) => ls.filter((x) => x.productId !== l.productId))} aria-label="Quitar">✕</button>
                                </div>
                            </div>
                        ))}
                        <div className="px-stack" style={{ gap: 4 }}>
                            <div className="cart__sum"><span>Neto</span><span className="px-mono">{clp(neto)}</span></div>
                            <div className="cart__sum"><span>IVA 19%</span><span className="px-mono">{clp(iva)}</span></div>
                        </div>
                        <div className="pos__total">{clp(total)}</div>
                        <button className="px-btn px-btn--primary px-btn--lg px-btn--block" disabled={!detail.length || !canSell} onClick={() => { setPayments([]); setPhase('pay'); }}>Cobrar →</button>
                        <button className="px-btn px-btn--ghost px-btn--sm" onClick={reset}>Cancelar venta</button>
                    </Panel>
                </div>
            )}

            {phase === 'pay' && (
                <div className="two-col">
                    <Panel title="Cobro — medios de pago combinados">
                        <div className="pos__total">{clp(total)}</div>
                        <div className="choice">
                            {METHODS.map((m) => <button key={m} className={`choice__item ${method === m ? 'choice__item--on' : ''}`} onClick={() => setMethod(m)}><strong>{m}</strong></button>)}
                        </div>
                        <div className="pay-row">
                            <input className="px-input" type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={`Monto (resta ${clp(remaining)})`} aria-label="Monto" />
                            <button className="px-btn px-btn--primary" onClick={addPayment} disabled={remaining <= 0 && method !== 'Efectivo'}>Agregar pago</button>
                        </div>
                        <div className="px-row">{[remaining, 10000, 20000, 50000].map((v, i) => v > 0 && <button key={i} className="px-btn px-btn--sm" onClick={() => setAmount(String(v))}>{i === 0 ? 'Exacto' : clp(v)}</button>)}</div>
                        {payments.map((p, i) => <div key={i} className="px-row px-row--between"><span>{p.method}</span><span className="px-mono">{clp(p.amount)} <button className="px-link" onClick={() => setPayments((ps) => ps.filter((_, j) => j !== i))}>quitar</button></span></div>)}
                        <div className="cart__sum"><span>Pagado</span><span className="px-mono">{clp(paid)}</span></div>
                        <div className="cart__sum"><span>Falta</span><span className="px-mono">{clp(remaining)}</span></div>
                        <div className="cart__sum"><span>Vuelto</span><span className="px-mono">{clp(change)}</span></div>
                        <Field label="RUT del cliente (opcional)"><input className="px-input" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-5" /></Field>
                        <div className="px-row">
                            <button className="px-btn" onClick={() => setPhase('sell')}>← Volver</button>
                            <button className="px-btn px-btn--primary px-btn--lg" disabled={remaining > 0} onClick={finalize}>Finalizar venta</button>
                        </div>
                    </Panel>
                    <Panel title="Detalle">
                        {detail.map((l) => <div key={l.productId} className="cart__sum"><span>{l.qty}× {l.product.title}</span><span className="px-mono">{clp(l.qty * l.product.price)}</span></div>)}
                        {offline && <Alert tone="warn">Venta offline: quedará «Pendiente de sincronizar».</Alert>}
                    </Panel>
                </div>
            )}

            {phase === 'done' && sale && (
                <Panel title="Venta registrada — boleta y voucher">
                    <Alert tone="ok">✔ Venta {sale.id} · folio {sale.folio} · {fmtDateTime(sale.ts)} · stock local descontado{sale.pending ? ' (pendiente de sincronizar)' : ''}.</Alert>
                    {saleKeys.map((k) => (
                        <div key={k.id} className="vault-key"><strong>{getProduct(state, k.productId).title}</strong><span className="vault-key__code">{decryptKey(k.enc)}</span></div>
                    ))}
                    <div className="px-row">
                        <button className="px-btn px-btn--primary" onClick={() => setVoucher(true)}>🖨 Imprimir boleta / voucher</button>
                        <button className="px-btn" onClick={reset}>Nueva venta</button>
                    </div>
                </Panel>
            )}

            {pendingSales.length > 0 && (
                <Panel title={`Ventas pendientes de sincronizar (${pendingSales.length})`} actions={!offline && <button className="px-btn px-btn--sm px-btn--primary" onClick={() => { api.syncPos(); notify('Ventas sincronizadas'); }}>Sincronizar ahora</button>}>
                    <div className="px-table-wrap"><table className="px-table"><tbody>
                        {pendingSales.map((s) => <tr key={s.id}><td className="mono">{s.id}</td><td>{fmtDateTime(s.ts)}</td><td className="num">{clp(s.total)}</td><td><Badge tone="warn">Pendiente</Badge></td></tr>)}
                    </tbody></table></div>
                </Panel>
            )}

            {voucher && sale && (
                <PrintSheet onClose={() => setVoucher(false)}>
                    <div className="sheet-center"><h3>PIXEL GAMERS SpA</h3><div>{getBranch(sale.branchId).name} · Boleta electrónica</div></div>
                    <hr />
                    <div className="sheet-row"><span>Folio {sale.folio}</span><span>{fmtDateTime(sale.ts)}</span></div>
                    <div>Vendedor: {sale.sellerName}{sale.customerRut ? ` · Cliente ${sale.customerRut}` : ''}</div>
                    <table><tbody>{sale.lines.map((l) => <tr key={l.productId}><td>{l.qty}× {getProduct(state, l.productId).title}</td><td className="num">{clp(l.qty * l.price)}</td></tr>)}</tbody></table>
                    <hr />
                    <div className="sheet-row"><span>Neto</span><span>{clp(splitIva(sale.total).neto)}</span></div>
                    <div className="sheet-row"><span>IVA 19%</span><span>{clp(splitIva(sale.total).iva)}</span></div>
                    <div className="sheet-row"><strong>TOTAL</strong><strong>{clp(sale.total)}</strong></div>
                    <div>Pago: {sale.payments.map((p) => `${p.method} ${clp(p.amount)}`).join(' + ')}{sale.change ? ` · vuelto ${clp(sale.change)}` : ''}</div>
                    {saleKeys.map((k) => <div key={k.id}><div>Clave digital — {getProduct(state, k.productId).title}</div><div className="sheet-key">{decryptKey(k.enc)}</div></div>)}
                    <hr />
                    <div className="sheet-center"><FakeQR value={sale.id} size={90} /><div>Verificación tributaria · clave de devolución</div><Barcode value={String(sale.folio)} height={36} /></div>
                </PrintSheet>
            )}

            {locked && (
                <Modal title="Terminal bloqueado" onClose={() => {}}>
                    <p>Se bloqueó por 3 minutos de inactividad. Ingresa tu PIN de 4 dígitos (demo: <span className="px-mono">{user.pin}</span>).</p>
                    <input className="px-input" type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} autoFocus aria-label="PIN" />
                    <button className="px-btn px-btn--primary" onClick={() => { if (pin === user.pin) { setLocked(false); setPin(''); lastActive.current = Date.now(); } else notify('PIN incorrecto', 'err'); }}>Desbloquear</button>
                </Modal>
            )}
        </div>
    );
};

export default Pos;
