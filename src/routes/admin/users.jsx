import { useState } from "react";
import { Panel, Badge, Field, Modal, Alert, Tabs } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { BRANCHES, MODULES, ROLE_LABELS, STAFF_ROLES } from "../../store/mockData";
import { can } from "../../store/selectors";
import { fmtDate, formatRut, validRut } from "../../store/utils";

const PERMS = [['c', 'Crear'], ['r', 'Leer'], ['u', 'Actualizar'], ['d', 'Borrar']];

const Users = () => {
    const { state, api, user, notify } = useStore();
    const [tab, setTab] = useState('users');
    const [role, setRole] = useState('vendedor');
    const [form, setForm] = useState({ role: 'vendedor', name: '', rut: '', email: '', branches: ['s1'] });
    const [temp, setTemp] = useState(null);
    const canWrite = can(state, 'usuarios', 'c');
    const staff = state.users.filter((u) => STAFF_ROLES.includes(u.role));

    const create = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !validRut(form.rut) || !/^\S+@pixelgamers\.cl$/.test(form.email)) return notify('Completa nombre, RUT válido y correo corporativo @pixelgamers.cl', 'err');
        if (state.users.some((u) => u.email === form.email)) return notify('El correo ya existe', 'err');
        api.createUser({ ...form, rut: formatRut(form.rut) });
        notify(`Invitación enviada a ${form.email}`);
        setForm({ role: 'vendedor', name: '', rut: '', email: '', branches: ['s1'] });
    };

    const reset = (u) => {
        api.resetUser(u.id);
        setTemp(u.name);
    };

    return (
        <>
            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'users', label: 'Usuarios administrativos' }, { id: 'rbac', label: 'Matriz RBAC' }, { id: 'policy', label: 'Política de contraseñas' }]} />

            {tab === 'users' && (
                <>
                    <Panel title={`Personal (${staff.length})`}>
                        <div className="px-table-wrap">
                            <table className="px-table">
                                <thead><tr><th>Nombre</th><th>Rol</th><th>Sucursales</th><th>Correo</th><th>Estado</th><th /></tr></thead>
                                <tbody>
                                    {staff.map((u) => (
                                        <tr key={u.id}>
                                            <td><strong>{u.name}</strong><br /><span className="px-muted px-mono">{u.rut}</span></td>
                                            <td>{ROLE_LABELS[u.role]}</td>
                                            <td>
                                                <div className="px-row" style={{ gap: 4 }}>
                                                    {BRANCHES.map((b) => (
                                                        <label key={b.id} className="px-check" title={b.name}>
                                                            <input type="checkbox" disabled={!canWrite || u.role === 'admin'} checked={u.branches?.includes(b.id) || false}
                                                                onChange={(e) => api.setUserBranches(u.id, e.target.checked ? [...(u.branches || []), b.id] : (u.branches || []).filter((x) => x !== b.id))} />
                                                            S{b.id.slice(1)}
                                                        </label>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="mono">{u.email}</td>
                                            <td><Badge tone={u.active ? 'ok' : 'err'}>{u.active ? 'Activo' : 'Inactivo'}</Badge>{u.mustChange && <Badge tone="warn">Clave temporal</Badge>}</td>
                                            <td>
                                                <div className="px-row">
                                                    <button className="px-btn px-btn--sm" disabled={!canWrite || u.id === user.id} onClick={() => { api.toggleUser(u.id); notify(u.active ? `${u.name} desactivado — sesiones cerradas` : `${u.name} reactivado`); }}>
                                                        {u.active ? 'Desactivar' : 'Reactivar'}
                                                    </button>
                                                    <button className="px-btn px-btn--sm" disabled={!canWrite} onClick={() => reset(u)}>Resetear clave</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>

                    <Panel title="Alta de usuario administrativo" note="Se envía una invitación por correo con una clave temporal de un solo uso (ver bandeja simulada).">
                        <form className="px-stack" onSubmit={create}>
                            <div className="px-form-grid">
                                <Field label="Rol"><select className="px-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{STAFF_ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}</select></Field>
                                <Field label="Nombre completo"><input className="px-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
                                <Field label="RUT"><input className="px-input" value={form.rut} onChange={(e) => setForm({ ...form, rut: formatRut(e.target.value) })} placeholder="12.345.678-5" /></Field>
                                <Field label="Correo corporativo"><input className="px-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nombre@pixelgamers.cl" /></Field>
                            </div>
                            <div className="px-row">
                                <span className="px-field__label">Sucursal(es):</span>
                                {BRANCHES.map((b) => (
                                    <label key={b.id} className="px-check"><input type="checkbox" checked={form.branches.includes(b.id)} onChange={(e) => setForm({ ...form, branches: e.target.checked ? [...form.branches, b.id] : form.branches.filter((x) => x !== b.id) })} />{b.short}</label>
                                ))}
                            </div>
                            <div><button className="px-btn px-btn--primary" disabled={!canWrite}>Crear y enviar invitación</button></div>
                        </form>
                    </Panel>
                </>
            )}

            {tab === 'rbac' && (
                <Panel title="Permisos por módulo (RBAC)" note="Los cambios se aplican de inmediato en la sesión del usuario afectado. Los vendedores nunca pueden modificar precios ni ver claves.">
                    <Tabs value={role} onChange={setRole} tabs={Object.keys(state.rbac).map((r) => ({ id: r, label: ROLE_LABELS[r] }))} />
                    <div className="px-table-wrap">
                        <table className="px-table rbac">
                            <thead><tr><th>Módulo</th>{PERMS.map(([k, l]) => <th key={k}>{l}</th>)}</tr></thead>
                            <tbody>
                                {MODULES.map((m) => (
                                    <tr key={m.id}>
                                        <td>{m.label}</td>
                                        {PERMS.map(([k, l]) => (
                                            <td key={k}>
                                                <input type="checkbox" aria-label={`${m.label} ${l}`} checked={!!state.rbac[role][m.id]?.[k]} disabled={!canWrite || (role === 'admin' && m.id === 'usuarios')}
                                                    onChange={(e) => api.setPermission(role, m.id, k, e.target.checked)} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === 'policy' && (
                <Panel title="Política de seguridad">
                    <dl className="px-kv">
                        <dt>Largo mínimo</dt><dd>12 caracteres, mayúsculas, minúsculas, números y símbolos</dd>
                        <dt>2FA administrativo</dt><dd><label className="px-check"><input type="checkbox" checked={state.policies.twoFa} disabled readOnly /> Obligatorio (Supervisor, TI, Administrador)</label></dd>
                        <dt>Expiración</dt><dd>Cada 90 días calendario</dd>
                        <dt>Sesión POS</dt><dd>Bloqueo tras 3 minutos de inactividad</dd>
                    </dl>
                    <Alert tone="info">Intentos de login: {state.loginStats.ok} correctos · {state.loginStats.failed} fallidos · {state.loginStats.injection} intentos de inyección bloqueados.</Alert>
                    <p className="px-muted">Cuentas creadas el {fmtDate(staff[0]?.createdAt)} y posteriores quedan registradas en la bitácora inalterable.</p>
                </Panel>
            )}

            {temp && (
                <Modal title="Credenciales reseteadas" onClose={() => setTemp(null)}>
                    <p>Se generó una clave temporal de un solo uso para <strong>{temp}</strong> y se envió por correo (ver bandeja simulada). Deberá cambiarla en su primer inicio de sesión. El evento quedó en la bitácora de auditoría.</p>
                    <button className="px-btn px-btn--primary" onClick={() => setTemp(null)}>Entendido</button>
                </Modal>
            )}
        </>
    );
};

export default Users;
