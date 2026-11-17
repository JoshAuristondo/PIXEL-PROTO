import { useState } from "react";
import { Panel, Badge, Field, Stat, Tabs } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { BRANCHES } from "../../store/mockData";
import { can, criticalItems, getBranch, recipientsFor } from "../../store/selectors";
import { fmtDateTime } from "../../store/utils";

const TEMPLATES = ['Oferta local', 'Lanzamiento', 'Preventa exclusiva', 'Liquidación'];
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : '—');

const Marketing = () => {
    const { state, api, user, notify } = useStore();
    const [tab, setTab] = useState('campaigns');
    const [f, setF] = useState({ name: '', subject: '', template: TEMPLATES[0], branchId: user.role === 'vendedor' ? state.session.branchId : 'all', when: '' });
    const canCreate = can(state, 'marketing', 'c');
    const crit = criticalItems(state);

    const create = (e) => {
        e.preventDefault();
        if (!f.name.trim() || !f.subject.trim()) return notify('Completa nombre y asunto', 'err');
        api.createCampaign({ name: f.name, subject: f.subject, template: f.template, branchId: f.branchId, scheduledAt: f.when ? new Date(f.when).getTime() : Date.now() + 3600000 });
        setF({ ...f, name: '', subject: '' });
        notify('Campaña programada');
    };

    const send = (c) => {
        const n = recipientsFor(state, c.branchId).length;
        api.sendCampaign(c.id, n);
        notify(`Campaña enviada a ${n} suscriptor(es). Se respetó la lista de desuscritos.`);
    };

    return (
        <>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'campaigns', label: 'Campañas' }, { id: 'alerts', label: `Alertas de stock (${crit.length})` }, { id: 'subs', label: 'Suscriptores' }]} />

            {tab === 'campaigns' && (
                <>
                    <Panel title="Nueva campaña segmentada">
                        <form className="px-stack" onSubmit={create}>
                            <div className="px-form-grid">
                                <Field label="Nombre interno"><input className="px-input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
                                <Field label="Asunto del correo"><input className="px-input" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} /></Field>
                                <Field label="Plantilla"><select className="px-select" value={f.template} onChange={(e) => setF({ ...f, template: e.target.value })}>{TEMPLATES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                                <Field label="Segmento" hint={`${recipientsFor(state, f.branchId).length} destinatarios activos`}>
                                    <select className="px-select" value={f.branchId} disabled={user.role === 'vendedor'} onChange={(e) => setF({ ...f, branchId: e.target.value })}>
                                        <option value="all">Todas las sucursales</option>{BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                </Field>
                                <Field label="Programar para"><input className="px-input" type="datetime-local" value={f.when} onChange={(e) => setF({ ...f, when: e.target.value })} /></Field>
                            </div>
                            <div><button className="px-btn px-btn--primary" disabled={!canCreate}>Programar campaña</button></div>
                        </form>
                    </Panel>
                    <Panel title={`Campañas (${state.campaigns.length})`}>
                        <div className="px-table-wrap">
                            <table className="px-table">
                                <thead><tr><th>Campaña</th><th>Segmento</th><th>Programada</th><th>Estado</th><th className="num">Enviados</th><th className="num">Aperturas</th><th className="num">Clics</th><th /></tr></thead>
                                <tbody>
                                    {state.campaigns.map((c) => (
                                        <tr key={c.id}>
                                            <td><strong>{c.name}</strong><br /><span className="px-muted">{c.subject}</span></td>
                                            <td>{c.branchId === 'all' ? 'Todas' : getBranch(c.branchId)?.short}</td>
                                            <td>{fmtDateTime(c.scheduledAt)}</td>
                                            <td><Badge tone={c.status === 'Enviada' ? 'ok' : 'warn'}>{c.status}</Badge></td>
                                            <td className="num">{c.sent}</td><td className="num">{pct(c.opens, c.sent)}</td><td className="num">{pct(c.clicks, c.sent)}</td>
                                            <td>{c.status === 'Programada' && <button className="px-btn px-btn--sm px-btn--primary" disabled={!canCreate} onClick={() => send(c)}>Enviar ahora</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                </>
            )}

            {tab === 'alerts' && (
                <Panel title="Productos bajo el umbral crítico" note="Los mismos indicadores aparecen en el POS de cada sucursal.">
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>Producto</th><th>Sucursal</th><th className="num">Stock</th><th className="num">Umbral</th><th /></tr></thead>
                            <tbody>
                                {crit.map((c) => (
                                    <tr key={`${c.product.id}-${c.branchId}`}>
                                        <td>{c.product.title}</td><td>{getBranch(c.branchId)?.short}</td>
                                        <td className="num"><Badge tone={c.level}>{c.qty}</Badge></td><td className="num">≤ {c.product.critical}</td>
                                        <td>{state.replenish.some((r) => r.productId === c.product.id && r.branchId === c.branchId) ? <Badge tone="info">Reposición solicitada</Badge> : <button className="px-btn px-btn--sm" onClick={() => { api.requestReplenish(c.product.id, c.branchId); notify('Reposición solicitada'); }}>Solicitar reposición</button>}</td>
                                    </tr>
                                ))}
                                {crit.length === 0 && <tr><td colSpan={5} className="px-muted">Sin alertas.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === 'subs' && (
                <>
                    <div className="px-stats">
                        <Stat label="Suscritos" value={state.subscribers.filter((s) => s.subscribed).length} tone="ok" />
                        <Stat label="Desuscritos (opt-out)" value={state.subscribers.filter((s) => !s.subscribed).length} />
                    </div>
                    <Panel title="Lista de suscriptores">
                        <div className="px-table-wrap">
                            <table className="px-table">
                                <thead><tr><th>Correo</th><th>Sucursal</th><th>Estado</th></tr></thead>
                                <tbody>{state.subscribers.map((s) => <tr key={s.email}><td className="mono">{s.email}</td><td>{getBranch(s.branchId)?.short}</td><td><Badge tone={s.subscribed ? 'ok' : 'err'}>{s.subscribed ? 'Suscrito' : 'Opt-out'}</Badge></td></tr>)}</tbody>
                            </table>
                        </div>
                    </Panel>
                </>
            )}
        </>
    );
};

export default Marketing;
