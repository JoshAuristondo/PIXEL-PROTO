import { useState } from "react";
import { Panel, Badge, Alert, Modal, Field } from "../../components/ui/Ui";
import { ShipLabel } from "../../components/commerce/Commerce";
import { useStore } from "../../store/StoreContext";
import { SHIP_STAGES, COMUNAS } from "../../store/mockData";
import { can, getProduct, getUser } from "../../store/selectors";
import { clp, fmtDateTime, hashHex } from "../../store/utils";

const PREFIX = { starken: 'STK', chilexpress: 'CHX', bluex: 'BLX' };

const Logistics = () => {
    const { state, api, notify } = useStore();
    const [label, setLabel] = useState(null);
    const [assign, setAssign] = useState(null);
    const [courier, setCourier] = useState(state.primaryCourier);
    const [tid, setTid] = useState('');
    const canWrite = can(state, 'logistica', 'u');

    const shipments = state.orders.filter((o) => o.stage !== null && o.stage !== undefined).sort((a, b) => b.ts - a.ts);
    const count = (s) => shipments.filter((o) => o.stage === s).length;
    const labelOrder = state.orders.find((o) => o.id === label);

    const openAssign = (o) => {
        setAssign(o.id);
        setCourier(state.couriers.find((c) => c.id === o.delivery.courier && c.active)?.id || state.primaryCourier);
        setTid('');
    };

    const submitAssign = (e) => {
        e.preventDefault();
        if (!tid.trim()) return notify('Ingresa o escanea el Tracking ID', 'err');
        api.setTracking(assign, tid.trim().toUpperCase(), courier);
        notify('Tracking registrado — cliente notificado por correo');
        setAssign(null);
    };

    return (
        <>
            <div className="pipeline">
                {SHIP_STAGES.map((s, i) => <div key={s}><strong>{count(i)}</strong><span>{s}</span></div>)}
                <div><strong>{state.orders.filter((o) => o.status === 'Listo para retiro').length}</strong><span>Listos para retiro</span></div>
            </div>

            {state.couriers.find((c) => c.id === state.primaryCourier)?.active === false && <Alert tone="err">El courier principal está desactivado. Usa la conmutación de emergencia en Salud de servicios.</Alert>}

            <Panel title={`Despachos a domicilio (${shipments.length})`} note="Flujo: En preparación → etiqueta PDF → tracking del courier → En camino → En reparto → Entregado (cada cambio notifica al cliente).">
                <div className="px-table-wrap">
                    <table className="px-table">
                        <thead><tr><th>Orden</th><th>Cliente / destino</th><th>Productos</th><th>Courier</th><th>Tracking</th><th>Estado</th><th /></tr></thead>
                        <tbody>
                            {shipments.map((o) => (
                                <tr key={o.id}>
                                    <td className="mono">{o.id}<br /><span className="px-muted">{fmtDateTime(o.ts)}</span></td>
                                    <td>{getUser(state, o.userId)?.name}<br /><span className="px-muted">{o.delivery.comuna}</span></td>
                                    <td>{o.items.filter((i) => i.format === 'fisico' || i.format === 'accesorio').map((i) => `${i.qty}× ${getProduct(state, i.productId)?.title}`).join(', ')}</td>
                                    <td>{state.couriers.find((c) => c.id === (o.tracking?.courier || o.delivery.courier))?.name}</td>
                                    <td className="mono">{o.tracking?.id || '—'}</td>
                                    <td><Badge tone={o.stage === 3 ? 'ok' : o.stage === 0 ? 'warn' : 'info'}>{SHIP_STAGES[o.stage]}</Badge></td>
                                    <td>
                                        <div className="px-row">
                                            <button className="px-btn px-btn--sm" onClick={() => { setLabel(o.id); api.labelPrinted(o.id); }}>🏷 Etiqueta PDF</button>
                                            {o.stage === 0 && <button className="px-btn px-btn--sm px-btn--primary" disabled={!canWrite} onClick={() => openAssign(o)}>Asignar tracking</button>}
                                            {o.stage >= 1 && o.stage < 3 && <button className="px-btn px-btn--sm" disabled={!canWrite} onClick={() => api.advanceShip(o.id)}>Avanzar estado</button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {shipments.length === 0 && <tr><td colSpan={7} className="px-muted">No hay despachos.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </Panel>

            <Panel title="Cotización de couriers (API simulada)" note="Respuesta < 1,5 s. Se aplica recargo de embalaje especial a productos frágiles.">
                <div className="px-table-wrap">
                    <table className="px-table">
                        <thead><tr><th>Comuna</th>{state.couriers.map((c) => <th key={c.id} className="num">{c.name}{!c.active && ' (inactivo)'}</th>)}</tr></thead>
                        <tbody>{Object.entries(COMUNAS).slice(0, 5).map(([name, base]) => <tr key={name}><td>{name}</td>{state.couriers.map((c) => <td key={c.id} className="num">{c.active ? clp(Math.round((base * c.rate) / 10) * 10) : '—'}</td>)}</tr>)}</tbody>
                    </table>
                </div>
            </Panel>

            {labelOrder && <ShipLabel state={state} order={labelOrder} onClose={() => setLabel(null)} />}

            {assign && (
                <Modal title={`Tracking — ${assign}`} onClose={() => setAssign(null)}>
                    <form className="px-stack" onSubmit={submitAssign}>
                        <Field label="Courier"><select className="px-select" value={courier} onChange={(e) => setCourier(e.target.value)}>{state.couriers.filter((c) => c.active).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
                        <Field label="Tracking ID (escanea la guía o ingrésalo)"><input className="px-input px-mono" value={tid} onChange={(e) => setTid(e.target.value)} autoFocus /></Field>
                        <div className="px-row">
                            <button type="button" className="px-btn" onClick={() => setTid(`${PREFIX[courier]}-${String(parseInt(hashHex(assign + Date.now()).slice(0, 7), 16)).slice(0, 7)}`)}>Generar ID demo</button>
                            <button className="px-btn px-btn--primary">Confirmar y notificar</button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
};

export default Logistics;
