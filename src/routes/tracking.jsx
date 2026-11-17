import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Badge, Alert } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { SHIP_STAGES } from "../store/mockData";
import { getProduct } from "../store/selectors";
import { fmtDateTime } from "../store/utils";

const Tracking = () => {
    const { state, api, user, notify } = useStore();
    const [, navigate] = useLocation();
    const search = new URLSearchParams(useSearch());
    const code = (search.get('code') || '').trim();
    const [input, setInput] = useState(code);
    const [synced, setSynced] = useState(() => Date.now());

    const order = code ? state.orders.find((o) => o.tracking?.id.toLowerCase() === code.toLowerCase() || o.id.toLowerCase() === code.toLowerCase()) : null;
    const mine = user ? state.orders.filter((o) => o.userId === user.id && o.tracking) : [];

    const submit = (e) => {
        e.preventDefault();
        navigate(`/tracking?code=${encodeURIComponent(input.trim())}`);
    };

    return (
        <Page header="Seguimiento" title="RASTREA TU PEDIDO" body="Ingresa tu Tracking ID (ej. CHX-5521983) o el número de orden." narrow>
            <Panel title="Buscar envío">
                <form className="px-row" onSubmit={submit}>
                    <input className="px-input" style={{ flex: 1, minWidth: 200 }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tracking ID u orden" aria-label="Tracking ID" />
                    <button className="px-btn px-btn--primary">Buscar</button>
                </form>
                {mine.length > 0 && (
                    <div className="px-row"><span className="px-muted">Mis envíos:</span>{mine.map((o) => <button key={o.id} className="px-btn px-btn--sm" onClick={() => { setInput(o.tracking.id); navigate(`/tracking?code=${o.tracking.id}`); }}>{o.tracking.id}</button>)}</div>
                )}
            </Panel>

            {code && !order && <Alert tone="err">No encontramos un envío con el código «{code}». Verifica que el pedido ya haya sido entregado al courier.</Alert>}

            {order && (
                <Panel title={`Pedido ${order.id}`} actions={<Badge tone={order.stage === 3 ? 'ok' : 'info'}>{order.status}</Badge>}>
                    <div className="px-kv">
                        <dt>Tracking</dt><dd className="px-mono">{order.tracking?.id || 'Aún sin asignar'}</dd>
                        <dt>Courier</dt><dd>{state.couriers.find((c) => c.id === (order.tracking?.courier || order.delivery.courier))?.name}</dd>
                        <dt>Destino</dt><dd>{order.delivery.address ? `${order.delivery.address}, ` : ''}{order.delivery.comuna}</dd>
                        <dt>Productos</dt><dd>{order.items.filter((i) => i.format === 'fisico' || i.format === 'accesorio').map((i) => `${i.qty}× ${getProduct(state, i.productId)?.title}`).join(', ')}</dd>
                    </div>

                    <ol className="timeline">
                        {SHIP_STAGES.map((label, i) => {
                            const ev = order.tracking?.events.filter((e) => e.stage === i).pop();
                            const done = order.stage !== null && i <= order.stage;
                            return (
                                <li key={label} className={`timeline__step ${done ? 'timeline__step--done' : ''} ${i === order.stage ? 'timeline__step--now' : ''}`}>
                                    <span className="timeline__dot">{done ? '✓' : i + 1}</span>
                                    <span className="timeline__label">{label}</span>
                                    <span className="timeline__time">{ev ? fmtDateTime(ev.ts) : '—'}</span>
                                </li>
                            );
                        })}
                    </ol>

                    <div className="px-stack" style={{ gap: 6 }}>
                        {[...(order.tracking?.events || [])].reverse().map((e, i) => (
                            <div key={i} className="px-row"><span className="px-mono px-muted">{fmtDateTime(e.ts)}</span><span>{e.text}</span></div>
                        ))}
                    </div>

                    <div className="px-row px-row--between">
                        <span className="px-muted">Sincronizado con el courier: {fmtDateTime(synced)} (se actualiza cada 30 min)</span>
                        <div className="px-row">
                            <button className="px-btn px-btn--sm" onClick={() => { setSynced(Date.now()); notify('Estado sincronizado con el courier'); }}>Sincronizar ahora</button>
                            {order.stage !== null && order.stage >= 1 && order.stage < 3 && (
                                <button className="px-btn px-btn--sm px-btn--ghost" title="Solo demo" onClick={() => api.advanceShip(order.id)}>⏩ Simular avance del courier</button>
                            )}
                        </div>
                    </div>
                </Panel>
            )}
        </Page>
    );
};

export default Tracking;
