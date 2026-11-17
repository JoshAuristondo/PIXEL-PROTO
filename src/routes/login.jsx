import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Field, Alert } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { BRANCHES, DEMO_2FA_CODE, ROLE_LABELS } from "../store/mockData";
import { passwordStrength } from "../store/utils";

const HOME = { comprador: '/account', vendedor: '/admin/pos', supervisor: '/admin/logistics', ti: '/admin/health', admin: '/admin/dashboard' };

const Login = () => {
    const { state, api } = useStore();
    const [, navigate] = useLocation();
    const next = new URLSearchParams(useSearch()).get('next');

    const [step, setStep] = useState('creds'); // creds | 2fa | change
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [branch, setBranch] = useState('s1');
    const [code, setCode] = useState('');
    const [newPw, setNewPw] = useState('');
    const [err, setErr] = useState('');
    const [pending, setPending] = useState(null);

    const finish = (user) => {
        api.login(user.id, user.role === 'vendedor' ? branch : null);
        navigate(next && user.role === 'comprador' ? next : HOME[user.role]);
    };

    const submitCreds = (e) => {
        e.preventDefault();
        const r = api.authenticate(id, pw);
        if (!r.ok) return setErr(r.error);
        setErr('');
        if (r.user.role === 'vendedor' && !r.user.branches.includes(branch)) return setErr('No estás asignado a la sucursal seleccionada.');
        setPending(r);
        if (r.needs2fa) return setStep('2fa');
        if (r.mustChange) return setStep('change');
        finish(r.user);
    };

    const submit2fa = (e) => {
        e.preventDefault();
        if (!api.check2fa(code)) return setErr('Código 2FA incorrecto.');
        setErr('');
        if (pending.mustChange) return setStep('change');
        finish(pending.user);
    };

    const submitChange = (e) => {
        e.preventDefault();
        if (newPw.length < 12 || passwordStrength(newPw) < 4) return setErr('Mínimo 12 caracteres con mayúsculas, minúsculas, números y símbolos.');
        api.changePassword(pending.user.id, newPw);
        finish(pending.user);
    };

    const quick = (u) => {
        setId(u.email);
        setPw(u.password);
        if (u.role === 'vendedor') setBranch(u.branches[0]);
    };

    const selected = state.users.find((u) => u.email.toLowerCase() === id.trim().toLowerCase());
    const showBranch = selected?.role === 'vendedor';

    return (
        <Page header="Acceso" title="INICIAR SESIÓN" body="Un único acceso para clientes, personal de tienda y administración." narrow>
            <Panel title={step === 'creds' ? 'Credenciales' : step === '2fa' ? 'Verificación en dos pasos' : 'Cambio obligatorio de clave'}>
                {err && <Alert tone="err">{err}</Alert>}

                {step === 'creds' && (
                    <form className="auth" onSubmit={submitCreds}>
                        <Field label="RUT o correo"><input className="px-input" value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required /></Field>
                        <Field label="Contraseña"><input className="px-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" required /></Field>
                        {showBranch && (
                            <Field label="Sucursal (terminal POS)">
                                <select className="px-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                                    {BRANCHES.map((b) => <option key={b.id} value={b.id}>{b.short} · {b.name}</option>)}
                                </select>
                            </Field>
                        )}
                        <button className="px-btn px-btn--primary px-btn--lg">Ingresar</button>
                        <div className="px-row px-row--between">
                            <Link className="px-link" href="/signup">Crear cuenta de comprador</Link>
                            <button type="button" className="px-link" onClick={() => setErr('Demo: se enviaría un enlace de recuperación (válido 15 min) si el correo existe.')}>¿Olvidaste tu clave?</button>
                        </div>
                    </form>
                )}

                {step === '2fa' && (
                    <form className="auth" onSubmit={submit2fa}>
                        <p className="px-panel__note">Rol administrativo detectado: ingresa el código de tu app autenticadora. <br />Demo: <strong className="px-mono">{DEMO_2FA_CODE}</strong></p>
                        <Field label="Código de 6 dígitos"><input className="px-input" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" maxLength={6} autoFocus required /></Field>
                        <button className="px-btn px-btn--primary px-btn--lg">Verificar</button>
                    </form>
                )}

                {step === 'change' && (
                    <form className="auth" onSubmit={submitChange}>
                        <p className="px-panel__note">Ingresaste con una clave temporal. Define una nueva contraseña de alta complejidad.</p>
                        <Field label="Nueva contraseña"><input className="px-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} autoFocus required /></Field>
                        <div className="auth__strength">{[1, 2, 3, 4].map((n) => <span key={n} className={passwordStrength(newPw) >= n ? `on-${passwordStrength(newPw)}` : ''} />)}</div>
                        <button className="px-btn px-btn--primary px-btn--lg">Guardar y entrar</button>
                    </form>
                )}
            </Panel>

            {step === 'creds' && (
                <Panel title="Cuentas de demostración" note={`Un usuario por rol. 2FA para roles administrativos: ${DEMO_2FA_CODE}.`}>
                    <div className="auth__demo">
                        {state.users.filter((u) => u.active).map((u) => (
                            <button key={u.id} type="button" onClick={() => quick(u)}>
                                <span>{ROLE_LABELS[u.role]}</span><span className="px-muted">{u.email}</span>
                            </button>
                        ))}
                    </div>
                    <button className="px-link" onClick={() => { if (window.confirm('¿Reiniciar todos los datos demo?')) { api.resetDemo(); setErr(''); } }}>Reiniciar datos demo</button>
                </Panel>
            )}
        </Page>
    );
};

export default Login;
