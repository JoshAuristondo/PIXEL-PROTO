import { useState } from "react";
import { Panel, Badge, Field, Alert } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { BRANCHES } from "../../store/mockData";
import { can, getBranch, getProduct, isDigital } from "../../store/selectors";
import { fmtDateTime } from "../../store/utils";

const TONE = { Solicitado: 'warn', 'En Tránsito Inter-Sucursal': 'info', Recibido: 'ok', Rechazado: 'err' };

const Transfers = () => {
    const { state, api, user, notify } = useStore();
    const myBranch = state.session?.branchId || user.branches?.[0] || 's1';
    const [form, setForm] = useState({ fromBranch: myBranch === 's2' ? 's1' : 's2', toBranch: myBranch, productId: 'p02', qty: 1 });
    const physical = state.products.filter((p) => !isDigital(p) && p.active);
    const prod = getProduct(state, form.productId);
    const canRequest = can(state, 'traslados', 'c');
    const canDecide = can(state, 'traslados', 'u');

    const submit = (e) => {
        e.preventDefault();
        if (form.fromBranch === form.toBranch) return notify('Origen y destino deben ser distintos', 'err');
        if (prod.stock[form.fromBranch] < form.qty) return notify(`Origen solo tiene ${prod.stock[form.fromBranch]} unidades`, 'err');
        api.requestTransfer({ ...form, qty: Number(form.qty) });
        notify('Solicitud enviada al Supervisor Logístico de la sucursal origen');
    };

    return (
        <>
            <div className="two-col">
                <Panel title="Solicitar traslado" note="El stock se congela en la sucursal origen cuando el supervisor autoriza la guía interna.">
                    <form className="px-stack" onSubmit={submit}>
                        <div className="px-form-grid">
                            <Field label="Producto"><select className="px-select" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>{physical.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></Field>
                            <Field label="Cantidad"><input className="px-input" type="number" min="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })} /></Field>
                            <Field label="Sucursal origen"><select className="px-select" value={form.fromBranch} onChange={(e) => setForm({ ...form, fromBranch: e.target.value })}>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.short} · {b.name}</option>)}</select></Field>
                            <Field label="Sucursal destino"><select className="px-select" value={form.toBranch} onChange={(e) => setForm({ ...form, toBranch: e.target.value })}>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.short} · {b.name}</option>)}</select></Field>
                        </div>
                        <div className="px-row">{BRANCHES.map((b) => <Badge key={b.id} tone={prod.stock[b.id] === 0 ? 'err' : prod.stock[b.id] <= prod.critical ? 'warn' : 'ok'}>{b.short}: {prod.stock[b.id]} u.</Badge>)}</div>
                        <div><button className="px-btn px-btn--primary" disabled={!canRequest}>Crear solicitud</button></div>
                    </form>
                </Panel>

                <Panel title="Resumen">
                    <Alert tone="info">Flujo: <strong>Solicitado</strong> → autorizado por Supervisor (guía interna, stock congelado) → <strong>En Tránsito Inter-Sucursal</strong> → <strong>Recibido</strong> en destino.</Alert>
                    <p className="px-muted">{state.transfers.filter((t) => t.status === 'Solicitado').length} pendiente(s) de autorización · {state.transfers.filter((t) => t.status === 'En Tránsito Inter-Sucursal').length} en tránsito.</p>
                </Panel>
            </div>

            <Panel title={`Traspasos (${state.transfers.length})`}>
                <div className="px-table-wrap">
                    <table className="px-table">
                        <thead><tr><th>Fecha</th><th>Producto</th><th className="num">Cant.</th><th>Ruta</th><th>Guía</th><th>Estado</th><th /></tr></thead>
                        <tbody>
                            {state.transfers.map((t) => (
                                <tr key={t.id}>
                                    <td>{fmtDateTime(t.ts)}</td>
                                    <td>{getProduct(state, t.productId)?.title}<br /><span className="px-muted">por {t.requestedBy}</span></td>
                                    <td className="num">{t.qty}</td>
                                    <td>{getBranch(t.fromBranch)?.short} → {getBranch(t.toBranch)?.short}</td>
                                    <td className="mono">{t.guide || '—'}</td>
                                    <td><Badge tone={TONE[t.status]}>{t.status}</Badge></td>
                                    <td>
                                        <div className="px-row">
                                            {t.status === 'Solicitado' && canDecide && <>
                                                <button className="px-btn px-btn--sm px-btn--primary" onClick={() => { if (getProduct(state, t.productId).stock[t.fromBranch] < t.qty) return notify('Stock insuficiente en origen', 'err'); api.decideTransfer(t.id, true); notify('Traspaso autorizado: stock congelado'); }}>Autorizar</button>
                                                <button className="px-btn px-btn--sm px-btn--danger" onClick={() => api.decideTransfer(t.id, false)}>Rechazar</button>
                                            </>}
                                            {t.status === 'En Tránsito Inter-Sucursal' && can(state, 'traslados', 'r') && <button className="px-btn px-btn--sm" onClick={() => { api.receiveTransfer(t.id); notify('Mercadería recibida en destino'); }}>Marcar recibido</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>
        </>
    );
};

export default Transfers;
