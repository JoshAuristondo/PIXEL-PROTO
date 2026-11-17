import { Link, useLocation } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Badge, Alert, Field } from "../components/ui/Ui";
import Cover from "../components/ui/Cover";
import { useStore } from "../store/StoreContext";
import { useNow } from "../store/hooks";
import { BRANCHES, COMUNAS } from "../store/mockData";
import { cartIssues, cartTotals, isDigital, shippingQuote } from "../store/selectors";
import { clp } from "../store/utils";

const RESERVE_MS = 15 * 60 * 1000;

const Cart = () => {
    const { state, api, user } = useStore();
    const [, navigate] = useLocation();
    const now = useNow(1000);
    const t = cartTotals(state);
    const d = state.cart.delivery;
    const issues = cartIssues(state);

    const left = state.cart.reservedAt ? state.cart.reservedAt + RESERVE_MS - now : RESERVE_MS;
    const expired = state.cart.reservedAt && left <= 0;
    const mm = String(Math.max(0, Math.floor(left / 60000))).padStart(2, '0');
    const ss = String(Math.max(0, Math.floor((left % 60000) / 1000))).padStart(2, '0');

    const goCheckout = () => navigate(user ? '/checkout' : '/login?next=/checkout');

    return (
        <Page header="Carrito" title="TU CARRITO UNIFICADO" body="Productos físicos y licencias digitales en una sola transacción de pago." wide>
            {t.lines.length === 0 ? (
                <Panel>
                    <div className="px-empty">
                        <p>Tu carrito está vacío.</p>
                        <Link className="px-btn px-btn--primary" href="/">Explorar catálogo</Link>
                    </div>
                </Panel>
            ) : (
                <div className="cart">
                    <div className="px-stack">
                        <Panel title={`Productos (${t.count})`}>
                            {t.lines.map((l) => (
                                <div key={l.productId} className="cart__line">
                                    <Link href={`/product/${l.productId}`}><Cover product={l.product} /></Link>
                                    <div className="px-stack" style={{ gap: 4 }}>
                                        <Link className="px-link" href={`/product/${l.productId}`}><strong>{l.product.title}</strong></Link>
                                        <div className="px-row">
                                            <Badge tone="contrast">{isDigital(l.product) ? 'Licencia digital' : 'Físico'}</Badge>
                                            <span className="px-muted">{l.product.platforms.join('/')}</span>
                                        </div>
                                        <span className="px-muted">{clp(l.product.price)} c/u</span>
                                    </div>
                                    <div className="px-stack" style={{ alignItems: 'flex-end', gap: 8 }}>
                                        <div className="product__qty">
                                            <button onClick={() => (l.qty > 1 ? api.setQty(l.productId, l.qty - 1) : api.removeFromCart(l.productId))} aria-label="Menos">−</button>
                                            <span>{l.qty}</span>
                                            <button onClick={() => api.setQty(l.productId, l.qty + 1)} aria-label="Más">+</button>
                                        </div>
                                        <strong className="px-mono">{clp(l.product.price * l.qty)}</strong>
                                        <button className="px-link" onClick={() => api.removeFromCart(l.productId)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </Panel>

                        <Panel title="Entrega">
                            {!t.hasPhysical && <Alert tone="info">Tu carrito solo tiene licencias digitales: se entregan al instante por correo y en tu bóveda, sin costo de despacho.</Alert>}
                            {t.hasPhysical && (
                                <>
                                    <div className="choice">
                                        <button className={`choice__item ${d.mode === 'domicilio' ? 'choice__item--on' : ''}`} onClick={() => api.setDelivery({ mode: 'domicilio' })}>
                                            <strong>🚚 Despacho a domicilio</strong><span className="px-muted">Courier cotizado según comuna</span>
                                        </button>
                                        <button className={`choice__item ${d.mode === 'retiro' ? 'choice__item--on' : ''}`} onClick={() => api.setDelivery({ mode: 'retiro' })}>
                                            <strong>🏬 Retiro en sucursal</strong><span className="px-muted">Gratis · listo en máx. 2 h hábiles</span>
                                        </button>
                                    </div>

                                    {d.mode === 'domicilio' ? (
                                        <div className="px-form-grid">
                                            <Field label="Comuna">
                                                <select className="px-select" value={d.comuna} onChange={(e) => api.setDelivery({ comuna: e.target.value })}>
                                                    {Object.keys(COMUNAS).map((c) => <option key={c}>{c}</option>)}
                                                </select>
                                            </Field>
                                            <Field label="Courier (cotización en línea)">
                                                <select className="px-select" value={d.courier} onChange={(e) => api.setDelivery({ courier: e.target.value })}>
                                                    {state.couriers.filter((c) => c.active).map((c) => (
                                                        <option key={c.id} value={c.id}>{c.name} — {clp(shippingQuote(state, t.lines, { ...d, courier: c.id }))}</option>
                                                    ))}
                                                </select>
                                            </Field>
                                        </div>
                                    ) : (
                                        <div className="choice">
                                            {BRANCHES.map((b) => (
                                                <button key={b.id} className={`choice__item ${d.branchId === b.id ? 'choice__item--on' : ''}`} onClick={() => api.setDelivery({ branchId: b.id })}>
                                                    <strong>{b.short} · {b.name}</strong>
                                                    <span className="px-muted">
                                                        {t.lines.filter((l) => !isDigital(l.product)).map((l) => `${l.product.stock[b.id]} u.`).join(' / ')} disponibles
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </Panel>
                    </div>

                    <Panel title="Resumen">
                        <div className="px-stack" style={{ gap: 6 }}>
                            <span className="px-field__label">Reserva de stock</span>
                            <span className="cart__timer">{expired ? 'Reserva expirada' : `${mm}:${ss}`}</span>
                            {expired && <button className="px-btn px-btn--sm" onClick={api.renewCart}>Renovar reserva (15 min)</button>}
                            <span className="px-field__hint">Reservamos tus productos físicos durante 15 minutos de checkout.</span>
                        </div>

                        <div className="px-stack" style={{ gap: 6 }}>
                            <div className="cart__sum"><span>Subtotal neto</span><span className="px-mono">{clp(t.neto)}</span></div>
                            <div className="cart__sum"><span>IVA (19%)</span><span className="px-mono">{clp(t.iva)}</span></div>
                            <div className="cart__sum"><span>Despacho</span><span className="px-mono">{t.shipping ? clp(t.shipping) : 'Gratis'}</span></div>
                            <div className="cart__sum cart__sum--total"><span>Total</span><span>{clp(t.total)}</span></div>
                        </div>

                        {issues.map((i) => <Alert key={i} tone="err">{i}</Alert>)}

                        <button className="px-btn px-btn--primary px-btn--lg px-btn--block" disabled={issues.length > 0 || expired} onClick={goCheckout}>
                            {user ? 'Ir a pagar →' : 'Inicia sesión para pagar →'}
                        </button>
                        <button className="px-btn px-btn--ghost px-btn--sm" onClick={api.clearCart}>Vaciar carrito</button>
                    </Panel>
                </div>
            )}
        </Page>
    );
};

export default Cart;
