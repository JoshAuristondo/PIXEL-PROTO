import { Panel, Badge, Alert, Stat } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { can } from "../../store/selectors";
import { fmtDateTime } from "../../store/utils";

const Row = ({ item, kind, api, canWrite, primary }) => {
    const down = item.down;
    const inactive = kind === 'courier' && !item.active;
    const tone = down || inactive ? 'err' : item.latency > 650 ? 'warn' : 'ok';
    return (
        <div className="svc__item">
            <div><strong>{item.name}</strong>{primary && <> <Badge tone="contrast">Principal</Badge></>}<br /><span className="px-muted">{item.fails > 0 ? `${item.fails} fallo(s) consecutivo(s)` : 'Sin fallos'}</span></div>
            <span className="px-mono">{item.latency ? `${item.latency} ms` : '—'}</span>
            <span className="px-mono">{item.success ? `${item.success}%` : '0%'}</span>
            <div className="px-row">
                <Badge tone={tone}>{down ? 'Caído' : inactive ? 'Desactivado' : 'Operativo'}</Badge>
                {canWrite && <button className="px-btn px-btn--sm px-btn--ghost" onClick={() => api.toggleDown(kind, item.id)}>{down ? 'Restaurar' : 'Simular caída'}</button>}
                {canWrite && kind === 'courier' && <button className="px-btn px-btn--sm" onClick={() => api.toggleCourier(item.id)}>{item.active ? 'Desactivar' : 'Reactivar'}</button>}
            </div>
        </div>
    );
};

const Health = () => {
    const { state, api, notify } = useStore();
    const canWrite = can(state, 'salud', 'u');
    const all = [...state.services, ...state.couriers];
    const bad = all.filter((x) => x.down || x.active === false).length;
    const primary = state.couriers.find((c) => c.id === state.primaryCourier);

    return (
        <>
            <div className="px-stats">
                <Stat label="Servicios monitoreados" value={all.length} />
                <Stat label="Con incidentes" value={bad} tone={bad ? 'err' : 'ok'} />
                <Stat label="Courier principal" value={primary?.name || '—'} tone={primary?.active ? 'ok' : 'err'} />
                <Stat label="Último healthcheck" value={fmtDateTime(state.healthCheckedAt).split(' ').pop()} sub={fmtDateTime(state.healthCheckedAt)} />
            </div>

            <div className="px-row">
                <button className="px-btn px-btn--primary" onClick={() => { api.runHealth(); notify('Healthcheck ejecutado'); }}>▶ Ejecutar healthcheck</button>
                <button className="px-btn px-btn--danger" disabled={!canWrite} onClick={() => { api.failover(); notify('Conmutación de emergencia aplicada', 'warn'); }}>⚡ Conmutar courier de emergencia</button>
            </div>

            {bad > 0 && <Alert tone="warn">Hay servicios con incidentes. Un courier se desactiva automáticamente tras 3 healthchecks fallidos consecutivos y los despachos se conmutan al alternativo.</Alert>}

            <Panel title="Infraestructura y pasarelas" note="Endpoints /health: base de datos, SMTP y pasarelas de pago.">
                <div className="svc">{state.services.map((s) => <Row key={s.id} item={s} kind="service" api={api} canWrite={canWrite} />)}</div>
            </Panel>
            <Panel title="APIs de couriers" note="Latencia y tasa de éxito de solicitudes de cotización/guías.">
                <div className="svc">{state.couriers.map((c) => <Row key={c.id} item={c} kind="courier" api={api} canWrite={canWrite} primary={c.id === state.primaryCourier} />)}</div>
            </Panel>
        </>
    );
};

export default Health;
