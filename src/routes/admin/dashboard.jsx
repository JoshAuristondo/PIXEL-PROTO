import { useEffect, useState } from "react";
import { Panel, Stat, Badge, Field, Modal, Alert, Sparkline } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { DEMO_2FA_CODE } from "../../store/mockData";
import { can, criticalItems, keysByProduct, orderTotalsToday } from "../../store/selectors";
import { clp, dayKey, fmtDateTime, sum } from "../../store/utils";

const Meter = ({ value, tone, mark }) => (
    <div className="meter" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className={`meter__fill ${tone ? `meter__fill--${tone}` : ''}`} style={{ width: `${Math.min(100, value)}%` }} />
        {mark != null && <div className="meter__mark" style={{ left: `${mark}%` }} />}
    </div>
);

const Dashboard = () => {
    const { state, api, notify } = useStore();
    const i = state.infra;
    const canWrite = can(state, 'dashboard', 'u');
    const [restore, setRestore] = useState(null); // null | 'auth' | 'confirm'
    const [code, setCode] = useState('');
    const [confirm, setConfirm] = useState('');

    useEffect(() => {
        const t = setInterval(api.tickInfra, 2500);
        return () => clearInterval(t);
    }, [api]);

    const today = orderTotalsToday(state);
    const week = state.salesHistory;
    const keyStats = Object.values(keysByProduct(state));
    const available = sum(keyStats, (k) => k.disponible);
    const crit = criticalItems(state).length;
    const bars = [...week.map((d) => ({ label: new Date(d.day).toLocaleDateString('es-CL', { weekday: 'short' }), web: d.web, pos: d.pos })), { label: 'hoy', web: today.web, pos: today.pos }];
    const max = Math.max(...bars.map((b) => b.web + b.pos), 1);
    const cpuTone = i.cpu > i.cpuThreshold ? 'err' : i.cpu > i.cpuThreshold - 15 ? 'warn' : '';
    const budgetPct = Math.round((i.spendToday / i.dailyBudget) * 100);
    const monthRevenue = sum(week, (d) => d.web + d.pos) + today.web + today.pos;

    const doRestore = () => {
        if (code !== DEMO_2FA_CODE) return notify('Código 2FA incorrecto', 'err');
        setRestore('confirm');
    };
    const confirmRestore = () => {
        if (confirm.trim().toUpperCase() !== 'RESTAURAR') return notify('Escribe RESTAURAR para confirmar', 'err');
        api.restore();
        setRestore(null); setCode(''); setConfirm('');
        notify('Restauración completada desde el respaldo cifrado');
    };

    return (
        <>
            <div className="px-stats">
                <Stat label="Uptime mensual" value={`${i.uptime}%`} sub="Objetivo ≥ 99,9%" tone="ok" />
                <Stat label="CPU nube" value={`${i.cpu}%`} sub={`Umbral autoescalado ${i.cpuThreshold}%`} tone={cpuTone} />
                <Stat label="Memoria" value={`${i.mem}%`} />
                <Stat label="Instancias web" value={i.instances} sub={`Máx. ${i.maxInstances}`} />
                <Stat label="Ventas hoy" value={clp(today.web + today.pos)} sub={`${today.count} transacciones`} />
                <Stat label="Claves disponibles" value={available} sub={`${crit} alertas de stock`} tone={crit ? 'warn' : ''} />
            </div>

            <div className="two-col">
                <Panel title="Uso de CPU (tiempo real)" actions={<Badge tone={i.peak ? 'err' : 'ok'}>{i.peak ? 'Pico de demanda' : 'Tráfico normal'}</Badge>}>
                    <Sparkline data={i.history} height={90} />
                    <Meter value={i.cpu} tone={cpuTone} mark={i.cpuThreshold} />
                    <div className="px-row">
                        <button className="px-btn px-btn--primary" disabled={!canWrite} onClick={() => api.patchInfra({ peak: !i.peak })}>{i.peak ? 'Terminar evento' : '🚀 Simular CyberDay / lanzamiento'}</button>
                        <span className="px-muted">Al superar el umbral se agregan instancias en &lt; 3 min.</span>
                    </div>
                </Panel>

                <Panel title="Reglas de autoescalado y costos">
                    <div className="px-form-grid">
                        <Field label={`Umbral de CPU: ${i.cpuThreshold}%`}><input type="range" min="50" max="90" value={i.cpuThreshold} disabled={!canWrite} onChange={(e) => api.patchInfra({ cpuThreshold: Number(e.target.value) })} aria-label="Umbral CPU" /></Field>
                        <Field label={`Instancias máximas: ${i.maxInstances}`}><input type="range" min="2" max="12" value={i.maxInstances} disabled={!canWrite} onChange={(e) => api.patchInfra({ maxInstances: Number(e.target.value) })} aria-label="Instancias máximas" /></Field>
                    </div>
                    <span className="px-field__label">Gasto diario proyectado: {clp(i.spendToday)} de {clp(i.dailyBudget)} ({budgetPct}%)</span>
                    <Meter value={budgetPct} tone={budgetPct > 85 ? 'err' : budgetPct > 65 ? 'warn' : ''} />
                    {budgetPct > 85 && <Alert tone="warn">El gasto proyectado excede el 85% del tope diario: se notificó al Administrador.</Alert>}
                    <p className="px-muted">Capacidad objetivo: &gt; 10.000 usuarios concurrentes sin degradar tiempos de respuesta.</p>
                </Panel>
            </div>

            <div className="two-col">
                <Panel title="Ventas últimos 7 días (CLP)">
                    <div className="bars">
                        {bars.map((b) => (
                            <div key={b.label} className="bars__col" title={`${clp(b.web)} web · ${clp(b.pos)} POS`}>
                                <div className="bars__bar bars__bar--pos" style={{ height: `${(b.pos / max) * 100}%` }} />
                                <div className="bars__bar" style={{ height: `${(b.web / max) * 100}%` }} />
                                <span>{b.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="px-row"><Badge tone="contrast">Web</Badge><Badge tone="info">POS</Badge><span className="px-muted">Total semana: {clp(monthRevenue)} · {dayKey(Date.now())}</span></div>
                </Panel>

                <Panel title="Plan de recuperación ante desastres (DRP)" actions={<Badge tone="ok">{i.drp.status}</Badge>}>
                    <dl className="px-kv">
                        <dt>Último respaldo</dt><dd>{fmtDateTime(i.drp.lastBackup)}</dd>
                        <dt>RTO objetivo</dt><dd>&lt; {i.drp.rtoHours} horas</dd>
                        <dt>RPO objetivo</dt><dd>&lt; {i.drp.rpoMin} minutos</dd>
                        <dt>Restauraciones</dt><dd>{i.drp.restores}</dd>
                    </dl>
                    <div className="px-row">
                        <button className="px-btn" disabled={!canWrite} onClick={() => { api.backup(); notify('Respaldo cifrado generado'); }}>Respaldar ahora</button>
                        <button className="px-btn px-btn--danger" disabled={!canWrite} onClick={() => setRestore('auth')}>Restaurar desde respaldo…</button>
                    </div>
                    <p className="px-panel__note">Una restauración masiva exige 2FA y doble confirmación.</p>
                </Panel>
            </div>

            {restore === 'auth' && (
                <Modal title="Paso 1/2 · Autenticación 2FA" onClose={() => setRestore(null)}>
                    <p>Ingresa el código de tu app autenticadora (demo: <span className="px-mono">{DEMO_2FA_CODE}</span>).</p>
                    <input className="px-input" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} autoFocus aria-label="Código 2FA" />
                    <button className="px-btn px-btn--primary" onClick={doRestore}>Verificar</button>
                </Modal>
            )}
            {restore === 'confirm' && (
                <Modal title="Paso 2/2 · Confirmación" onClose={() => setRestore(null)}>
                    <Alert tone="err">Se reemplazará el estado operativo por el último respaldo ({fmtDateTime(i.drp.lastBackup)}). Esta acción es crítica.</Alert>
                    <Field label="Escribe RESTAURAR para confirmar"><input className="px-input" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoFocus /></Field>
                    <button className="px-btn px-btn--danger" onClick={confirmRestore}>Ejecutar restauración</button>
                </Modal>
            )}
        </>
    );
};

export default Dashboard;
