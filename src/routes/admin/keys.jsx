import { useRef, useState } from "react";
import { Panel, Badge, Alert, Stat, Tabs } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { can, getProduct, isDigital, keysByProduct } from "../../store/selectors";
import { KEY_REGEX, fmtDateTime, hashHex } from "../../store/utils";

const SAMPLE = `sku,code
PG-P20,QWER-TY23-ASDF-GH45
PG-P20,ZXCV-BN67-MKLP-JH89
PG-P16,H0LL-0W4K-N1GH-T5K1
PG-P16,H0LL-0W4K-N1GH-T5K1
PG-P99,AAAA-BBBB-CCCC-DDDD
PG-P17,corrupto-123`;

const parse = (text, filename) => {
    const t = text.trim();
    if (filename.endsWith('.json') || t.startsWith('[')) {
        const arr = JSON.parse(t);
        return arr.map((r) => ({ sku: String(r.sku || '').trim(), code: String(r.code || '').trim().toUpperCase() }));
    }
    return t.split(/\r?\n/).filter((l) => l.trim() && !/^sku\s*,/i.test(l)).map((l) => {
        const [sku, code] = l.split(',');
        return { sku: (sku || '').trim(), code: (code || '').trim().toUpperCase() };
    });
};

const Keys = () => {
    const { state, api, notify } = useStore();
    const [tab, setTab] = useState('import');
    const [text, setText] = useState('');
    const [fname, setFname] = useState('lote.csv');
    const [over, setOver] = useState(false);
    const [log, setLog] = useState([]);
    const [report, setReport] = useState(null);
    const input = useRef(null);
    const canWrite = can(state, 'claves', 'c');
    const summary = keysByProduct(state);
    const digital = state.products.filter(isDigital);

    const readFile = (file) => {
        if (!file) return;
        const r = new FileReader();
        r.onload = () => { setText(String(r.result)); setFname(file.name); setReport(null); setLog([`Archivo «${file.name}» cargado (${(file.size / 1024).toFixed(1)} KB)`]); };
        r.readAsText(file);
    };

    const process = () => {
        const t0 = performance.now();
        let rows;
        try {
            rows = parse(text, fname);
        } catch {
            return notify('No se pudo leer el archivo (CSV o JSON inválido)', 'err');
        }
        const seen = new Set(state.keys.map((k) => k.hash));
        const ok = [];
        const errors = [];
        const lines = [`> Validando ${rows.length} registros…`];
        rows.forEach((r, i) => {
            const p = state.products.find((x) => x.sku === r.sku);
            let err = null;
            if (!p) err = `SKU inexistente «${r.sku}»`;
            else if (!isDigital(p)) err = `${r.sku} no es un producto digital`;
            else if (!KEY_REGEX.test(r.code)) err = `formato de clave inválido «${r.code}»`;
            else if (seen.has(hashHex(r.code))) err = `clave duplicada ${r.code.slice(0, 4)}-••••`;
            if (err) {
                errors.push({ line: i + 1, error: err });
                lines.push(`✗ L${i + 1}: ${err}`);
            } else {
                seen.add(hashHex(r.code));
                ok.push({ productId: p.id, code: r.code });
                lines.push(`✓ L${i + 1}: ${r.sku} — cifrada con AES-256 (simulado) y almacenada`);
            }
        });
        const ms = Math.round(performance.now() - t0);
        lines.push(`> Listo en ${ms} ms · ${ok.length} exitosas · ${errors.length} fallidas`);
        setLog(lines);
        setReport({ ok: ok.length, errors });
        api.importKeys(ok, errors, fname);
        notify(`Lote procesado: ${ok.length} claves cargadas`, errors.length ? 'warn' : 'ok');
    };

    const unsafe = state.lastKeyAudit && (state.lastKeyAudit.corrupt || state.lastKeyAudit.duplicate);

    return (
        <>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'import', label: 'Carga masiva' }, { id: 'stock', label: 'Resumen por SKU' }, { id: 'audit', label: 'Auditoría de integridad' }]} />

            {tab === 'import' && (
                <div className="two-col">
                    <Panel title="Importar lote (CSV / JSON)" note="Formato CSV: sku,code · JSON: [{ sku, code }]. Las claves se cifran antes de guardarse.">
                        <div className={`px-dropzone ${over ? 'px-dropzone--over' : ''}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
                            onDrop={(e) => { e.preventDefault(); setOver(false); readFile(e.dataTransfer.files[0]); }} onClick={() => input.current.click()} role="button" tabIndex={0}>
                            <strong>⬆ Arrastra y suelta tu archivo aquí</strong>
                            <span className="px-muted">o haz clic para seleccionarlo</span>
                            <input ref={input} type="file" accept=".csv,.json,.txt" hidden onChange={(e) => readFile(e.target.files[0])} />
                        </div>
                        <textarea className="px-textarea px-mono" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="…o pega aquí el contenido del lote" aria-label="Contenido del lote" />
                        <div className="px-row">
                            <button className="px-btn px-btn--primary" disabled={!text.trim() || !canWrite} onClick={process}>Procesar y cifrar lote</button>
                            <button className="px-btn" onClick={() => { setText(SAMPLE); setFname('lote_ejemplo.csv'); setReport(null); setLog([]); }}>Cargar lote de ejemplo</button>
                        </div>
                    </Panel>

                    <Panel title="Log de validación y cifrado">
                        <div className="px-log" aria-live="polite">{log.length ? log.join('\n') : 'Esperando archivo…'}</div>
                        {report && (
                            <div className="px-stats">
                                <Stat label="Exitosas" value={report.ok} tone="ok" />
                                <Stat label="Fallidas" value={report.errors.length} tone={report.errors.length ? 'err' : ''} />
                            </div>
                        )}
                        {state.importReports.length > 0 && <p className="px-muted">Último reporte: {state.importReports[0].filename} · {fmtDateTime(state.importReports[0].ts)}</p>}
                    </Panel>
                </div>
            )}

            {tab === 'stock' && (
                <Panel title="Claves por SKU">
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>SKU</th><th>Producto</th><th className="num">Disponibles</th><th className="num">Asignadas</th><th className="num">Revocadas</th><th className="num">Corruptas</th></tr></thead>
                            <tbody>
                                {digital.map((p) => {
                                    const s = summary[p.id] || { disponible: 0, asignada: 0, revocada: 0, corrupta: 0 };
                                    return (
                                        <tr key={p.id}>
                                            <td className="mono">{p.sku}</td><td>{p.title}</td>
                                            <td className="num"><Badge tone={s.disponible <= 2 ? 'warn' : 'ok'}>{s.disponible}</Badge></td>
                                            <td className="num">{s.asignada}</td><td className="num">{s.revocada}</td><td className="num">{s.corrupta ? <Badge tone="err">{s.corrupta}</Badge> : 0}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === 'audit' && (
                <Panel title="Escaneo de integridad" note="Detecta claves corruptas (no descifrables) o duplicadas y bloquea automáticamente las inconsistentes.">
                    <div className="px-row"><button className="px-btn px-btn--primary" disabled={!can(state, 'claves', 'u')} onClick={() => { api.auditKeys(); notify('Escaneo completado'); }}>Ejecutar escaneo</button></div>
                    {state.lastKeyAudit ? (
                        <>
                            <div className="px-stats">
                                <Stat label="Claves escaneadas" value={state.lastKeyAudit.scanned} />
                                <Stat label="Corruptas" value={state.lastKeyAudit.corrupt} tone={state.lastKeyAudit.corrupt ? 'err' : 'ok'} />
                                <Stat label="Duplicadas bloqueadas" value={state.lastKeyAudit.duplicate} tone={state.lastKeyAudit.duplicate ? 'warn' : 'ok'} />
                            </div>
                            <Alert tone={unsafe ? 'warn' : 'ok'}>{unsafe ? 'Se bloquearon lotes con inconsistencias de firma criptográfica; no se asignarán a clientes.' : 'Inventario íntegro: sin duplicaciones ni claves expuestas.'} · {fmtDateTime(state.lastKeyAudit.ts)}</Alert>
                        </>
                    ) : <Alert tone="info">Aún no se ha ejecutado ningún escaneo. El inventario semilla incluye una clave corrupta y una duplicada de prueba.</Alert>}
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>ID</th><th>Producto</th><th>Estado</th><th>Hash</th></tr></thead>
                            <tbody>
                                {state.keys.filter((k) => ['corrupta', 'revocada'].includes(k.status) || k.enc.includes('corrupta')).map((k) => (
                                    <tr key={k.id}><td className="mono">{k.id}</td><td>{getProduct(state, k.productId)?.title}</td><td><Badge tone="err">{k.status}</Badge></td><td className="hash">{k.hash}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}
        </>
    );
};

export default Keys;
