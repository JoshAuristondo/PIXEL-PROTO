import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Field, Alert, Badge } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { useRequireUser } from "../store/hooks";
import { cartIssues, cartTotals } from "../store/selectors";
import { getBranch } from "../store/selectors";
import { clp } from "../store/utils";

const GATEWAYS = [
    { id: 'Webpay', hint: 'Transbank · tarjetas y débito' },
    { id: 'MercadoPago', hint: 'Tarjetas, saldo y transferencia' },
];
const METHODS = ['Crédito', 'Débito', 'Transferencia'];

const Checkout = () => {
    const { state, api, notify } = useStore();
    const user = useRequireUser();
    const [, navigate] = useLocation();
    const t = cartTotals(state);
    const d = state.cart.delivery;
    const issues = cartIssues(state);

    const [form, setForm] = useState({ name: user?.name || '', rut: user?.rut || '', email: user?.email || '', phone: user?.phone || '', address: user?.address || '' });
    const [gateway, setGateway] = useState('Webpay');
    const [method, setMethod] = useState('Crédito');
    const [outcome, setOutcome] = useState('approved');
    const [phase, setPhase] = useState('form'); // form | redirect | rejected
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (phase === 'form' && t.lines.length === 0) navigate('/cart');
    }, [t.lines.length, phase, navigate]);

    if (!user) return null;

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
    const needsAddress = t.hasPhysical && d.mode === 'domicilio';
    const valid = form.name && form.rut && form.email.includes('@') && form.phone && (!needsAddress || form.address);

    const pay = (e) => {
        e.preventDefault();
        if (!valid) return notify('Completa los datos de facturación.', 'warn');
        setPhase('redirect');
        setTimeout(() => {
            if (outcome === 'approved') {
                const orderId = api.placeOrder({
                    userId: user.id,
                    customer: form,
                    delivery: { mode: t.hasPhysical ? d.mode : 'digital', branchId: d.branchId, comuna: d.comuna, courier: d.courier, address: form.address },
                    payment: { gateway, method },
                });
                navigate(`/confirmation/${orderId}`);
            } else {
                const why = ['Fondos insuficientes', 'Tarjeta rechazada por el emisor', 'Timeout de la pasarela (> 10 s)'][Math.floor(Math.random() * 3)];
                setReason(why);
                api.rejectPayment({ userId: user.id, name: user.name, email: form.email, gateway, reason: why });
                setPhase('rejected');
            }
        }, 2400);
    };

    if (phase === 'redirect') {
        return (
            <Page header="Pago seguro" title="REDIRIGIENDO…" narrow>
                <div className="gateway">
                    <div className="loader" />
                    <strong>Conectando con {gateway} (TLS 1.3)</strong>
                    <span className="px-muted">Procesando autorización… no cierres esta ventana. (Simulación: no se realiza ningún cargo real.)</span>
                </div>
            </Page>
        );
    }

    return (
        <Page header="Checkout" title="PAGO SEGURO" body="Datos → pago → confirmación: menos de 3 pasos desde el carrito." wide>
            <form className="cart" onSubmit={pay}>
                <div className="px-stack">
                    {phase === 'rejected' && (
                        <Alert tone="err"><strong>Pago rechazado:</strong> {reason}. Liberamos la reserva de stock y te enviamos un aviso por correo. Puedes reintentar.</Alert>
                    )}
                    {issues.map((i) => <Alert key={i} tone="err">{i}</Alert>)}

                    <Panel title="Datos de facturación">
                        <div className="px-form-grid">
                            <Field label="Nombre completo"><input className="px-input" value={form.name} onChange={set('name')} required /></Field>
                            <Field label="RUT"><input className="px-input" value={form.rut} onChange={set('rut')} required /></Field>
                            <Field label="Correo (boleta y claves)"><input className="px-input" type="email" value={form.email} onChange={set('email')} required /></Field>
                            <Field label="Teléfono"><input className="px-input" value={form.phone} onChange={set('phone')} required /></Field>
                            {needsAddress && <Field label={`Dirección de despacho (${d.comuna})`}><input className="px-input" value={form.address} onChange={set('address')} required /></Field>}
                        </div>
                        <p className="px-panel__note">
                            Entrega: {!t.hasPhysical ? 'digital inmediata' : d.mode === 'retiro' ? `retiro en ${getBranch(d.branchId).name}` : `domicilio · ${state.couriers.find((c) => c.id === d.courier)?.name} · ${d.comuna}`}. <Link className="px-link" href="/cart">Cambiar</Link>
                        </p>
                    </Panel>

                    <Panel title="Medio de pago">
                        <div className="choice">
                            {GATEWAYS.map((g) => (
                                <button type="button" key={g.id} className={`choice__item ${gateway === g.id ? 'choice__item--on' : ''}`} onClick={() => setGateway(g.id)}>
                                    <strong>{g.id}</strong><span className="px-muted">{g.hint}</span>
                                </button>
                            ))}
                        </div>
                        <div className="choice">
                            {METHODS.map((m) => (
                                <button type="button" key={m} className={`choice__item ${method === m ? 'choice__item--on' : ''}`} onClick={() => setMethod(m)}>{m}</button>
                            ))}
                        </div>
                        {method !== 'Transferencia' && (
                            <div className="px-form-grid">
                                <Field label="Tarjeta (demo)" hint="Prototipo: los datos no se envían a ningún lugar."><input className="px-input" defaultValue="4111 1111 1111 1111" inputMode="numeric" /></Field>
                                <Field label="Vencimiento"><input className="px-input" defaultValue="12/30" /></Field>
                                <Field label="CVV"><input className="px-input" defaultValue="123" /></Field>
                            </div>
                        )}
                        <Field label="Resultado simulado de la pasarela (solo demo)">
                            <select className="px-select" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                                <option value="approved">Pago aprobado</option>
                                <option value="rejected">Pago rechazado</option>
                            </select>
                        </Field>
                    </Panel>
                </div>

                <Panel title="Tu orden">
                    {t.lines.map((l) => (
                        <div key={l.productId} className="cart__sum"><span>{l.qty}× {l.product.title}</span><span className="px-mono">{clp(l.product.price * l.qty)}</span></div>
                    ))}
                    <div className="px-stack" style={{ gap: 6 }}>
                        <div className="cart__sum"><span>Neto</span><span className="px-mono">{clp(t.neto)}</span></div>
                        <div className="cart__sum"><span>IVA 19%</span><span className="px-mono">{clp(t.iva)}</span></div>
                        <div className="cart__sum"><span>Despacho</span><span className="px-mono">{t.shipping ? clp(t.shipping) : 'Gratis'}</span></div>
                        <div className="cart__sum cart__sum--total"><span>Total</span><span>{clp(t.total)}</span></div>
                    </div>
                    <Badge tone="ok">🔒 Cifrado SSL/TLS 1.3</Badge>
                    <button className="px-btn px-btn--primary px-btn--lg px-btn--block" disabled={issues.length > 0 || !valid}>Pagar {clp(t.total)}</button>
                </Panel>
            </form>
        </Page>
    );
};

export default Checkout;
