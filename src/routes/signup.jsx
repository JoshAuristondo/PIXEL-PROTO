import { useState } from "react";
import { Link, useLocation } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Field, Alert } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { COMUNAS, REGIONS } from "../store/mockData";
import { formatRut, passwordStrength, validRut } from "../store/utils";

const Signup = () => {
    const { state, api } = useStore();
    const [, navigate] = useLocation();
    const [f, setF] = useState({ name: '', rut: '', email: '', phone: '+56 9 ', address: '', comuna: 'Providencia', region: 'LATAM', password: '', newsletter: true });
    const [errors, setErrors] = useState({});
    const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
    const strength = passwordStrength(f.password);

    const submit = (e) => {
        e.preventDefault();
        const er = {};
        if (f.name.trim().split(' ').length < 2) er.name = 'Ingresa nombre y apellido.';
        if (!validRut(f.rut)) er.rut = 'RUT inválido (verifica el dígito verificador).';
        if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Correo inválido.';
        else if (state.users.some((u) => u.email.toLowerCase() === f.email.toLowerCase())) er.email = 'Este correo ya está registrado.';
        if (f.phone.replace(/\D/g, '').length < 10) er.phone = 'Teléfono incompleto.';
        if (f.password.length < 8 || strength < 3) er.password = 'Usa 8+ caracteres con mayúsculas, números y símbolos.';
        setErrors(er);
        if (Object.keys(er).length) return;
        api.register({ ...f, rut: formatRut(f.rut), email: f.email.trim() });
        navigate('/account');
    };

    return (
        <Page header="Registro" title="CREAR CUENTA" body="Guarda tus datos de envío, historial y claves digitales." narrow>
            <Panel title="Datos personales">
                <form className="px-stack" onSubmit={submit} noValidate>
                    <div className="px-form-grid">
                        <Field label="Nombre completo" error={errors.name}><input className="px-input" value={f.name} onChange={set('name')} /></Field>
                        <Field label="RUT" error={errors.rut}><input className="px-input" value={f.rut} onChange={(e) => setF((p) => ({ ...p, rut: formatRut(e.target.value) }))} placeholder="12.345.678-5" /></Field>
                        <Field label="Correo" error={errors.email}><input className="px-input" type="email" value={f.email} onChange={set('email')} /></Field>
                        <Field label="Teléfono" error={errors.phone}><input className="px-input" value={f.phone} onChange={set('phone')} /></Field>
                        <Field label="Dirección de despacho"><input className="px-input" value={f.address} onChange={set('address')} /></Field>
                        <Field label="Comuna"><select className="px-select" value={f.comuna} onChange={set('comuna')}>{Object.keys(COMUNAS).map((c) => <option key={c}>{c}</option>)}</select></Field>
                        <Field label="Región de tu consola"><select className="px-select" value={f.region} onChange={set('region')}>{REGIONS.filter((r) => r !== 'Global').map((r) => <option key={r}>{r}</option>)}</select></Field>
                        <Field label="Contraseña" error={errors.password}>
                            <input className="px-input" type="password" value={f.password} onChange={set('password')} autoComplete="new-password" />
                            <div className="auth__strength">{[1, 2, 3, 4].map((n) => <span key={n} className={strength >= n ? `on-${strength}` : ''} />)}</div>
                        </Field>
                    </div>
                    <label className="px-check"><input type="checkbox" checked={f.newsletter} onChange={set('newsletter')} /> Quiero recibir lanzamientos y preventas por correo</label>
                    <Alert tone="info">Tu contraseña se almacenaría con hash seguro (Argon2/bcrypt) en la versión real. Este prototipo guarda todo solo en tu navegador.</Alert>
                    <button className="px-btn px-btn--primary px-btn--lg">Crear cuenta</button>
                    <span className="px-muted">¿Ya tienes cuenta? <Link className="px-link" href="/login">Inicia sesión</Link></span>
                </form>
            </Panel>
        </Page>
    );
};

export default Signup;
