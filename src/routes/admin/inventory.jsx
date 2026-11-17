import { useState } from "react";
import { Panel, Badge, Field, Tabs, Alert } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { BRANCHES } from "../../store/mockData";
import { can, getBranch, getProduct, isDigital } from "../../store/selectors";
import { clp, fmtDateTime } from "../../store/utils";

const SUPPLIERS = ['Sony Interactive Chile', 'Microsoft Distribución LATAM', 'Nintendo Partner Chile', 'Tech Gaming Imports'];
const REASONS = ['Merma', 'Daño', 'Hurto', 'Error Conteo'];

const Inventory = () => {
    const { state, api, user, notify } = useStore();
    const [tab, setTab] = useState('matrix');
    const physical = state.products.filter((p) => !isDigital(p));
    const canWrite = can(state, 'inventario', 'c');
    const [rcv, setRcv] = useState({ productId: 'p22', branchId: 's1', qty: 5, supplier: SUPPLIERS[0], invoice: 'F-' + 48210 });
    const [adj, setAdj] = useState({ productId: 'p11', branchId: 's3', qty: 1, reason: 'Daño', evidence: '' });

    const receive = (e) => {
        e.preventDefault();
        if (!rcv.invoice.trim() || rcv.qty < 1) return notify('Factura y cantidad son obligatorias', 'err');
        api.receiveStock({ ...rcv, qty: Number(rcv.qty) });
        notify('Stock actualizado en catálogo web y sucursales');
    };

    const requestAdj = (e) => {
        e.preventDefault();
        const p = getProduct(state, adj.productId);
        if (!adj.evidence.trim()) return notify('Adjunta evidencia (descripción o nombre de archivo)', 'err');
        if (p.stock[adj.branchId] < adj.qty) return notify('La baja supera el stock disponible', 'err');
        const needsApproval = adj.qty > 5 || adj.qty * p.price > 100000;
        api.requestAdjust({ ...adj, qty: Number(adj.qty), needsApproval: needsApproval && user.role !== 'admin' });
        notify(needsApproval && user.role !== 'admin' ? 'Ajuste enviado: requiere aprobación del Administrador (>5 u. o $100.000)' : 'Merma registrada y descontada', needsApproval ? 'warn' : 'ok');
    };

    return (
        <>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'matrix', label: 'Stock y umbrales' }, { id: 'receive', label: 'Recepción de mercadería' }, { id: 'adjust', label: 'Mermas y ajustes' }]} />

            {tab === 'matrix' && (
                <Panel title="Matriz de stock (físico)" note="Define el mínimo crítico por producto: bajo ese valor se gatillan alertas en POS y panel.">
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>SKU</th><th>Producto</th>{BRANCHES.map((b) => <th key={b.id} className="num">{b.short}</th>)}<th className="num">Web</th><th className="num">Umbral</th></tr></thead>
                            <tbody>
                                {physical.map((p) => (
                                    <tr key={p.id}>
                                        <td className="mono">{p.sku}</td><td>{p.title}</td>
                                        {BRANCHES.map((b) => <td key={b.id} className="num"><Badge tone={p.stock[b.id] === 0 ? 'err' : p.stock[b.id] <= p.critical ? 'warn' : 'ok'}>{p.stock[b.id]}</Badge></td>)}
                                        <td className="num">{p.stock.web}</td>
                                        <td className="num"><input className="px-input" style={{ width: 64, height: 28, textAlign: 'right' }} type="number" min="0" value={p.critical} disabled={!can(state, 'inventario', 'u')} onChange={(e) => api.setThreshold(p.id, Math.max(0, Number(e.target.value)))} aria-label={`Umbral ${p.title}`} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {state.replenish.length > 0 && <Alert tone="info">{state.replenish.length} solicitud(es) de reposición pendientes (ej. {getProduct(state, state.replenish[0].productId)?.title} · {getBranch(state.replenish[0].branchId)?.short}).</Alert>}
                </Panel>
            )}

            {tab === 'receive' && (
                <div className="two-col">
                    <Panel title="Registrar recepción" note="Orden de recepción asociada a la factura del proveedor; suma unidades a bodega.">
                        <form className="px-stack" onSubmit={receive}>
                            <div className="px-form-grid">
                                <Field label="Producto"><select className="px-select" value={rcv.productId} onChange={(e) => setRcv({ ...rcv, productId: e.target.value })}>{physical.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
                                <Field label="Sucursal destino"><select className="px-select" value={rcv.branchId} onChange={(e) => setRcv({ ...rcv, branchId: e.target.value })}>{[...BRANCHES, { id: 'web', name: 'Bodega e-commerce', short: 'Web' }].map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
                                <Field label="Cantidad"><input className="px-input" type="number" min="1" value={rcv.qty} onChange={(e) => setRcv({ ...rcv, qty: e.target.value })} /></Field>
                                <Field label="Proveedor"><select className="px-select" value={rcv.supplier} onChange={(e) => setRcv({ ...rcv, supplier: e.target.value })}>{SUPPLIERS.map((s) => <option key={s}>{s}</option>)}</select></Field>
                                <Field label="N° de factura"><input className="px-input" value={rcv.invoice} onChange={(e) => setRcv({ ...rcv, invoice: e.target.value })} /></Field>
                            </div>
                            <div><button className="px-btn px-btn--primary" disabled={!canWrite}>Registrar recepción</button></div>
                        </form>
                    </Panel>
                    <Panel title="Movimientos recientes">
                        {state.stockLog.length === 0 && <p className="px-muted">Sin movimientos manuales aún.</p>}
                        {state.stockLog.map((m) => <div key={m.id} className="px-row px-row--between"><span><span className="px-mono">{m.id}</span> · {getProduct(state, m.productId)?.title} +{m.qty} ({m.branchId === 'web' ? 'Web' : getBranch(m.branchId)?.short})</span><span className="px-muted">{fmtDateTime(m.ts)}</span></div>)}
                    </Panel>
                </div>
            )}

            {tab === 'adjust' && (
                <>
                    <Panel title="Registrar merma / ajuste" note="Cada cambio manual genera un código único (INV-xxxx). Ajustes de más de 5 unidades o $100.000 requieren aprobación del Administrador.">
                        <form className="px-stack" onSubmit={requestAdj}>
                            <div className="px-form-grid">
                                <Field label="Producto"><select className="px-select" value={adj.productId} onChange={(e) => setAdj({ ...adj, productId: e.target.value })}>{physical.map((p) => <option key={p.id} value={p.id}>{p.title} ({clp(p.price)})</option>)}</select></Field>
                                <Field label="Sucursal"><select className="px-select" value={adj.branchId} onChange={(e) => setAdj({ ...adj, branchId: e.target.value })}>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></Field>
                                <Field label="Unidades a dar de baja"><input className="px-input" type="number" min="1" value={adj.qty} onChange={(e) => setAdj({ ...adj, qty: e.target.value })} /></Field>
                                <Field label="Motivo"><select className="px-select" value={adj.reason} onChange={(e) => setAdj({ ...adj, reason: e.target.value })}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select></Field>
                                <Field label="Evidencia"><input className="px-input" value={adj.evidence} onChange={(e) => setAdj({ ...adj, evidence: e.target.value })} placeholder="foto_caja_danada.jpg / descripción" /></Field>
                            </div>
                            <div><button className="px-btn px-btn--primary" disabled={!canWrite}>Registrar ajuste</button></div>
                        </form>
                    </Panel>
                    <Panel title={`Ajustes (${state.adjustments.length})`}>
                        <div className="px-table-wrap">
                            <table className="px-table">
                                <thead><tr><th>Código</th><th>Producto</th><th className="num">Uds.</th><th>Motivo</th><th>Estado</th><th /></tr></thead>
                                <tbody>
                                    {state.adjustments.map((a) => (
                                        <tr key={a.id}>
                                            <td className="mono">{a.code}</td><td>{getProduct(state, a.productId)?.title}<br /><span className="px-muted">{getBranch(a.branchId)?.short} · {a.by}</span></td><td className="num">−{a.qty}</td><td>{a.reason}</td>
                                            <td><Badge tone={a.status === 'Aplicada' ? 'ok' : a.status === 'Pendiente' ? 'warn' : 'err'}>{a.status}</Badge></td>
                                            <td>{a.status === 'Pendiente' && user.role === 'admin' && <div className="px-row"><button className="px-btn px-btn--sm px-btn--primary" onClick={() => api.decideAdjust(a.id, true)}>Aprobar</button><button className="px-btn px-btn--sm" onClick={() => api.decideAdjust(a.id, false)}>Rechazar</button></div>}</td>
                                        </tr>
                                    ))}
                                    {state.adjustments.length === 0 && <tr><td colSpan={6} className="px-muted">Sin ajustes registrados.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </>
            )}
        </>
    );
};

export default Inventory;
