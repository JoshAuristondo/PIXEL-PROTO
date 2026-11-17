import { useState } from "react";
import { Link } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Alert, Badge } from "../components/ui/Ui";
import { KeyCode, PickupTicket, RedeemGuide, Receipt } from "../components/commerce/Commerce";
import { useStore } from "../store/StoreContext";
import { getBranch, getProduct } from "../store/selectors";
import { clp, decryptKey, fmtDateTime } from "../store/utils";

const Confirmation = ({ params }) => {
    const { state, notify } = useStore();
    const order = state.orders.find((o) => o.id === params.id);
    const [receipt, setReceipt] = useState(false);
    const [ticket, setTicket] = useState(false);
    const [guide, setGuide] = useState(false);

    if (!order) {
        return (
            <Page header="Orden" title="NO ENCONTRADA">
                <Panel><Link className="px-btn" href="/">Volver al catálogo</Link></Panel>
            </Page>
        );
    }

    const keys = order.keyIds.map((id) => state.keys.find((k) => k.id === id)).filter(Boolean);
    const retiro = order.delivery.mode === 'retiro';

    return (
        <Page header="¡Pago exitoso!" title={`ORDEN ${order.id}`} body={`Folio ${order.folio} · ${fmtDateTime(order.ts)} · ${order.payment.gateway} ${order.payment.method} (Aut. ${order.payment.auth})`} wide>
            <Alert tone="ok">✔ Tu pago fue aprobado. Enviamos la boleta electrónica {keys.length ? 'y tus claves ' : ''}a tu correo (revisa la <Link className="px-link" href="/outbox">bandeja simulada</Link>).</Alert>

            <div className="cart">
                <div className="px-stack">
                    {keys.length > 0 && (
                        <Panel title="Código de canje desbloqueado" actions={<button className="px-btn px-btn--sm" onClick={() => setGuide(true)}>¿Cómo canjear?</button>}>
                            {keys.map((k) => (
                                <div key={k.id} className="vault-key">
                                    <div className="px-stack" style={{ gap: 4 }}>
                                        <strong>{getProduct(state, k.productId).title}</strong>
                                        <KeyCode keyObj={k} revealed />
                                    </div>
                                    <button className="px-btn px-btn--sm" onClick={() => { navigator.clipboard?.writeText(decryptKey(k.enc)); notify('Clave copiada'); }}>Copiar</button>
                                </div>
                            ))}
                            <p className="px-panel__note">Las descargas se realizan desde los servidores oficiales de cada plataforma. Estas claves también quedan guardadas en tu bóveda.</p>
                        </Panel>
                    )}

                    <Panel title="Envío">
                        {retiro ? (
                            <>
                                <p>Retira en <strong>{getBranch(order.delivery.branchId).name}</strong> (listo en máx. 2 horas hábiles). Código de retiro:</p>
                                <div className="px-row"><Badge tone="contrast">{order.delivery.pickupCode}</Badge><button className="px-btn px-btn--sm" onClick={() => setTicket(true)}>Ver QR de retiro</button></div>
                            </>
                        ) : order.stage !== null ? (
                            <p>Despacho a <strong>{order.delivery.address}, {order.delivery.comuna}</strong>. Te avisaremos por correo cuando el courier lo reciba. <Link className="px-link" href="/tracking">Ir a seguimiento →</Link></p>
                        ) : (
                            <p>Pedido 100% digital: no requiere despacho.</p>
                        )}
                    </Panel>
                </div>

                <Panel title="Resumen de la orden">
                    {order.items.map((i) => (
                        <div key={i.productId} className="cart__sum"><span>{i.qty}× {getProduct(state, i.productId)?.title}</span><span className="px-mono">{clp(i.price * i.qty)}</span></div>
                    ))}
                    <div className="cart__sum"><span>Despacho</span><span className="px-mono">{order.shipping ? clp(order.shipping) : 'Gratis'}</span></div>
                    <div className="cart__sum cart__sum--total"><span>Total</span><span>{clp(order.total)}</span></div>
                    <button className="px-btn px-btn--primary px-btn--block" onClick={() => setReceipt(true)}>⬇ Descargar boleta PDF</button>
                    <Link className="px-btn px-btn--block" href="/account">Ir a mi cuenta</Link>
                    <Link className="px-btn px-btn--ghost px-btn--block" href="/">Seguir comprando</Link>
                </Panel>
            </div>

            {receipt && <Receipt state={state} order={order} onClose={() => setReceipt(false)} />}
            {ticket && <PickupTicket order={order} onClose={() => setTicket(false)} />}
            {guide && <RedeemGuide onClose={() => setGuide(false)} />}
        </Page>
    );
};

export default Confirmation;
