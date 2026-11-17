import { useMemo, useState } from "react";
import { Panel, Badge, Alert, Tabs, Stat } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { getProduct } from "../../store/selectors";
import { downloadFile, fmtDateTime, hashHex } from "../../store/utils";

const verify = (list) => {
    let prev = '0'.repeat(14);
    for (let i = 0; i < list.length; i++) {
        const e = list[i];
        if (e.prevHash !== prev || e.hash !== hashHex(prev + e.module + e.action + e.detail + e.ts)) return { ok: false, index: i, id: e.id };
        prev = e.hash;
    }
    return { ok: true };
};

const Audit = () => {
    const { state } = useStore();
    const [tab, setTab] = useState('events');
    const [f, setF] = useState({ q: '', module: '', actor: '', ip: '', from: '' });
    const [result, setResult] = useState(null);

    const modules = [...new Set(state.audit.map((e) => e.module))].sort();
    const actors = [...new Set(state.audit.map((e) => e.actor))].sort();

    const rows = useMemo(() => state.audit.filter((e) =>
        (!f.module || e.module === f.module) && (!f.actor || e.actor === f.actor) && (!f.ip || e.ip.includes(f.ip)) &&
        (!f.from || e.ts >= new Date(f.from).getTime()) && (!f.q || `${e.action} ${e.detail}`.toLowerCase().includes(f.q.toLowerCase())),
    ).slice().reverse(), [state.audit, f]);

    const deliveries = state.keys.filter((k) => k.status === 'asignada').sort((a, b) => b.assignedAt - a.assignedAt);

    const runVerify = () => setResult({ ...verify(state.audit), tamper: false });
    const runTamper = () => {
        const copy = state.audit.map((e, i) => (i === Math.floor(state.audit.length / 2) ? { ...e, detail: e.detail + ' (editado)' } : e));
        setResult({ ...verify(copy), tamper: true });
    };

    const exportCsv = () => downloadFile('auditoria.csv', ['id,fecha,usuario,modulo,accion,detalle,ip,hash', ...rows.map((e) => [e.id, new Date(e.ts).toISOString(), e.actor, e.module, e.action, `"${e.detail.replace(/"/g, '""')}"`, e.ip, e.hash].join(','))].join('\n'), 'text/csv');
    const exportJson = () => downloadFile('auditoria.json', JSON.stringify(rows, null, 2), 'application/json');

    return (
        <>
            <div className="px-stats">
                <Stat label="Eventos registrados" value={state.audit.length} />
                <Stat label="Entregas de claves" value={deliveries.length} />
                <Stat label="Cadena de hashes" value={verify(state.audit).ok ? 'ÍNTEGRA' : 'ROTA'} tone={verify(state.audit).ok ? 'ok' : 'err'} />
            </div>

            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'events', label: 'Bitácora de eventos' }, { id: 'keys', label: 'Entregas de claves digitales' }]} />

            {tab === 'events' && (
                <Panel title="Bitácora inalterable" note="Cada evento incluye el hash del anterior (encadenado). Ningún rol puede editar ni borrar registros." actions={<><button className="px-btn px-btn--sm" onClick={runVerify}>Verificar integridad</button><button className="px-btn px-btn--sm" onClick={runTamper}>Probar detección de alteración</button><button className="px-btn px-btn--sm" onClick={exportCsv}>CSV</button><button className="px-btn px-btn--sm" onClick={exportJson}>JSON</button></>}>
                    {result && (result.ok ? <Alert tone="ok">✔ Cadena verificada: ningún registro fue alterado.</Alert> : <Alert tone="err">✖ {result.tamper ? 'Alteración simulada detectada' : 'Inconsistencia detectada'} en el evento {result.id} (posición {result.index + 1}): el hash no coincide.</Alert>)}
                    <div className="px-form-grid">
                        <input className="px-input" placeholder="Buscar acción / detalle" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} aria-label="Buscar" />
                        <select className="px-select" value={f.module} onChange={(e) => setF({ ...f, module: e.target.value })} aria-label="Módulo"><option value="">Todos los módulos</option>{modules.map((m) => <option key={m}>{m}</option>)}</select>
                        <select className="px-select" value={f.actor} onChange={(e) => setF({ ...f, actor: e.target.value })} aria-label="Usuario"><option value="">Todos los usuarios</option>{actors.map((m) => <option key={m}>{m}</option>)}</select>
                        <input className="px-input" placeholder="Dirección IP" value={f.ip} onChange={(e) => setF({ ...f, ip: e.target.value })} aria-label="IP" />
                        <input className="px-input" type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} aria-label="Desde" />
                    </div>
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>Fecha</th><th>Usuario</th><th>Módulo / acción</th><th>Detalle</th><th>IP</th><th>Hash</th></tr></thead>
                            <tbody>
                                {rows.map((e) => (
                                    <tr key={e.id}>
                                        <td>{fmtDateTime(e.ts)}</td><td>{e.actor}</td>
                                        <td><Badge tone="contrast">{e.module}</Badge><br />{e.action}</td>
                                        <td>{e.detail}</td><td className="mono">{e.ip}</td><td className="hash">{e.hash}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && <tr><td colSpan={6} className="px-muted">Sin resultados.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === 'keys' && (
                <Panel title="Bitácora de despacho de claves digitales" note="Registro de cada clave asignada: fecha/hora, IP, correo, transacción y hash de validez (los códigos no se muestran).">
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>Fecha</th><th>Transacción</th><th>Cliente</th><th>Producto</th><th>Canal</th><th>Hash de validez</th><th>Estado</th></tr></thead>
                            <tbody>
                                {deliveries.map((k) => (
                                    <tr key={k.id}>
                                        <td>{fmtDateTime(k.assignedAt)}</td><td className="mono">{k.orderId}</td><td>{k.assignedTo}</td>
                                        <td>{getProduct(state, k.productId)?.title}</td><td>{k.channel === 'tienda' ? 'Tienda' : 'Web'}</td>
                                        <td className="hash">{k.hash}</td><td><Badge tone="ok">Válida · asignada</Badge></td>
                                    </tr>
                                ))}
                                {deliveries.length === 0 && <tr><td colSpan={7} className="px-muted">Sin entregas.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}
        </>
    );
};

export default Audit;
