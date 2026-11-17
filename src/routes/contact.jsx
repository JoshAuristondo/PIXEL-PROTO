import { useState } from "react";
import { Link } from "wouter";
import "../styles/shop.scss";
import "../styles/info.scss";
import { Page, Panel, Field, Alert } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { BRANCHES } from "../store/mockData";
import { CONTACT_REASONS } from "../store/policies";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Contact = () => {
    const { user, api, notify } = useStore();
    const [form, setForm] = useState({ name: '', email: '', reason: CONTACT_REASONS[0], orderId: '', message: '' });
    const [sent, setSent] = useState(null);
    const [touched, setTouched] = useState(false);

    const f = { ...form, name: form.name || user?.name || '', email: form.email || user?.email || '' };
    const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

    const errors = {
        name: f.name.trim().length < 2 ? 'Ingresa tu nombre' : '',
        email: !EMAIL_RE.test(f.email.trim()) ? 'Correo no válido' : '',
        message: f.message.trim().length < 10 ? 'Cuéntanos un poco más (mínimo 10 caracteres)' : '',
    };
    const invalid = Object.values(errors).some(Boolean);

    const submit = (e) => {
        e.preventDefault();
        setTouched(true);
        if (invalid) return notify('Revisa los campos marcados', 'err');
        const ticket = api.sendContact({ ...f, name: f.name.trim(), email: f.email.trim().toLowerCase(), message: f.message.trim() });
        setSent({ ticket, email: f.email.trim() });
        setForm({ name: '', email: '', reason: CONTACT_REASONS[0], orderId: '', message: '' });
        setTouched(false);
        notify('Mensaje enviado');
    };

    return (
        <Page header="Contacto" title="HABLEMOS" body="Escríbenos por pedidos, claves digitales, garantías o cualquier consulta. Respondemos en un máximo de 1 día hábil." wide>
            <div className="contact">
                <Panel title="Envíanos un mensaje">
                    {sent && (
                        <Alert tone="ok">
                            Recibimos tu mensaje (ticket <strong>{sent.ticket}</strong>). Enviamos una confirmación a {sent.email}; puedes verla en el <Link className="contact__link" href="/outbox">correo simulado</Link>.
                        </Alert>
                    )}
                    <form className="px-stack" onSubmit={submit} noValidate>
                        <div className="px-form-grid">
                            <Field label="Nombre" error={touched && errors.name}>
                                <input className="px-input" value={f.name} onChange={set('name')} autoComplete="name" />
                            </Field>
                            <Field label="Correo electrónico" error={touched && errors.email}>
                                <input className="px-input" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
                            </Field>
                            <Field label="Motivo">
                                <select className="px-select" value={f.reason} onChange={set('reason')}>
                                    {CONTACT_REASONS.map((r) => <option key={r}>{r}</option>)}
                                </select>
                            </Field>
                            <Field label="N° de orden (opcional)" hint="Ej.: PG-100001">
                                <input className="px-input" value={f.orderId} onChange={set('orderId')} />
                            </Field>
                        </div>
                        <Field label="Mensaje" error={touched && errors.message}>
                            <textarea className="px-textarea" rows={6} value={f.message} onChange={set('message')} />
                        </Field>
                        <div><button className="px-btn px-btn--primary">Enviar mensaje</button></div>
                    </form>
                </Panel>

                <div className="px-stack">
                    <Panel title="Canales" note="Atención online: lunes a viernes 09:00–18:00.">
                        <p>Correo: <strong>soporte@pixelgamers.cl</strong></p>
                        <p>Teléfono: <strong>+56 2 2555 0100</strong></p>
                        <p>Revisa primero nuestras <Link className="contact__link" href="/faq">preguntas frecuentes</Link> y <Link className="contact__link" href="/policy">políticas</Link>.</p>
                    </Panel>
                    <Panel title="Sucursales" note="Todos los días 10:00–21:00.">
                        {BRANCHES.map((b) => (
                            <div key={b.id} className="contact__branch">
                                <strong>{b.name}</strong>
                                <span>{b.address}</span>
                                <span>{b.phone}</span>
                            </div>
                        ))}
                        <Link className="px-btn px-btn--sm" href="/locations">Ver mapas</Link>
                    </Panel>
                </div>
            </div>
        </Page>
    );
};

export default Contact;
