import { useState } from "react";
import { Panel, Badge, Alert, Field, SignaturePad, FakeQR } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { can, getBranch, getProduct, getUser } from "../../store/selectors";
import { cleanRut, clp, fmtDateTime } from "../../store/utils";

const Pickup = () => {
    const { state, api, user, notify } = useStore();
    const branchId = state.session?.branchId || user.branches?.[0] || 's1';
    const [q, setQ] = useState('');
    const [found, setFound] = useState(null);
    const [searched, setSearched] = useState(false);
    const [sig, setSig] = useState(null);
    const [rut, setRut] = useState('');
    const canWrite = can(state, 'retiro', 'u') || can(state, 'retiro', 'c');

    const retiros = state.orders.filter((o) => o.delivery.mode === 'retiro');
    const ready = retiros.filter((o) => o.status === 'Listo para retiro' && (user.role === 'vendedor' ? o.delivery.branchId === branchId : true));

    const search = (e) => {
        e?.preventDefault();
        const t = q.trim().toLowerCase();
        const o = retiros.find((x) => x.delivery.pickupCode?.toLowerCase() === t || x.id.toLowerCase() === t || cleanRut(getUser(state, x.userId)?.rut || '') === cleanRut(q));
        setFound(o ? o.id : null);
        setSearched(true);
        setSig(null);
        setRut(o ? getUser(state, o.userId)?.rut || '' : '');
    };

    const order = state.orders.find((o) => o.id === found);
    const customer = order && getUser(state, order.userId);
    const wrongBranch = order && user.role === 'vendedor' && order.delivery.branchId !== branchId;

    const deliver = () => {
        api.pickupDeliver(order.id, rut, sig);
        notify(`Pedido ${order.id} entregado`);
    };

    return (
        <>
            <div className="two-col">
                <Panel title="Validar orden de retiro">
                    <form className="px-row" onSubmit={search}>
                        <input className="px-input" style={{ flex: 1, minWidth: 200 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Código de retiro, N° de orden o RUT" aria-label="Búsqueda" />
                        <button className="px-btn px-btn--primary">Buscar</button>
                    </form>
                    <div className="px-row"><span className="px-muted">Listos para retiro:</span>{ready.map((o) => <button key={o.id} className="px-btn px-btn--sm" onClick={() => { setQ(o.delivery.pickupCode); setTimeout(() => { setFound(o.id); setSearched(true); setRut(getUser(state, o.userId)?.rut || ''); setSig(null); }, 0); }}>{o.delivery.pickupCode}</button>)}{ready.length === 0 && <span className="px-muted">ninguno (compra uno desde el catálogo con retiro en tienda)</span>}</div>
                    {searched && !order && <Alert tone="err">No se encontró ninguna orden de retiro con ese dato.</Alert>}
                </Panel>

                {order && (
                    <Panel title={`Orden ${order.id}`} actions={<Badge tone={order.status === 'Listo para retiro' ? 'ok' : 'info'}>{order.status}</Badge>}>
                        <dl className="px-kv">
                            <dt>Cliente</dt><dd>{customer?.name} · {customer?.rut}</dd>
                            <dt>Sucursal</dt><dd>{getBranch(order.delivery.branchId)?.name}</dd>
                            <dt>Pago</dt><dd><Badge tone="ok">{order.payment.status}</Badge> {order.payment.gateway} {order.payment.method} · {clp(order.total)}</dd>
                            <dt>Productos</dt><dd>{order.items.map((i) => `${i.qty}× ${getProduct(state, i.productId)?.title}`).join(', ')}</dd>
                            <dt>Código</dt><dd className="px-mono">{order.delivery.pickupCode}</dd>
                        </dl>
                        {wrongBranch && <Alert tone="err">Esta orden corresponde a otra sucursal ({getBranch(order.delivery.branchId)?.name}).</Alert>}
                        {order.status === 'Listo para retiro' && !wrongBranch && (
                            <>
                                <div className="px-row"><div style={{ background: '#fff', padding: 6 }}><FakeQR value={order.delivery.pickupCode} size={90} /></div><span className="px-muted">QR de la compra (escaneable desde el celular del cliente)</span></div>
                                <Field label="RUT del retirante (verificación de identidad)"><input className="px-input" value={rut} onChange={(e) => setRut(e.target.value)} /></Field>
                                <div className="px-stack"><span className="px-field__label">Firma digital en pantalla</span><SignaturePad onChange={setSig} /></div>
                                <button className="px-btn px-btn--primary px-btn--lg" disabled={!sig || !rut || !canWrite} onClick={deliver}>Confirmar entrega</button>
                            </>
                        )}
                        {order.pickup && (
                            <div className="px-stack">
                                <Alert tone="ok">Entregado {fmtDateTime(order.pickup.ts)} a RUT {order.pickup.rut} por {order.pickup.by}.</Alert>
                                {order.pickup.signature && <img src={order.pickup.signature} alt="Firma" style={{ background: '#fff', maxWidth: 260, border: '1px solid var(--color-border-line)' }} />}
                            </div>
                        )}
                    </Panel>
                )}
            </div>

            <Panel title={`Historial de retiros (${retiros.length})`}>
                <div className="px-table-wrap">
                    <table className="px-table">
                        <thead><tr><th>Orden</th><th>Sucursal</th><th>Código</th><th>Estado</th><th className="num">Total</th></tr></thead>
                        <tbody>{retiros.map((o) => <tr key={o.id}><td className="mono">{o.id}</td><td>{getBranch(o.delivery.branchId)?.short}</td><td className="mono">{o.delivery.pickupCode}</td><td><Badge tone={o.status === 'Listo para retiro' ? 'warn' : 'ok'}>{o.status}</Badge></td><td className="num">{clp(o.total)}</td></tr>)}
                            {retiros.length === 0 && <tr><td colSpan={5} className="px-muted">Aún no hay órdenes con retiro en tienda.</td></tr>}</tbody>
                    </table>
                </div>
            </Panel>
        </>
    );
};

export default Pickup;
