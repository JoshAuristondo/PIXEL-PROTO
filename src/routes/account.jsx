import { useState } from "react";
import { Link } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Tabs, Badge, Field, Modal, Alert, Stat } from "../components/ui/Ui";
import { KeyCode, PickupTicket, RedeemGuide, Receipt } from "../components/commerce/Commerce";
import { useStore } from "../store/StoreContext";
import { useRequireUser } from "../store/hooks";
import { COMUNAS, REGIONS, ROLE_LABELS } from "../store/mockData";
import { getProduct } from "../store/selectors";
import { clp, decryptKey, fmtDate } from "../store/utils";

const Account = () => {
    const { state, api, notify } = useStore();
    const user = useRequireUser();
    const [tab, setTab] = useState('vault');
    const [revealed, setRevealed] = useState({});
    const [auth, setAuth] = useState(null); // keyId pendiente de re-autenticación
    const [pw, setPw] = useState('');
    const [guide, setGuide] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [ticket, setTicket] = useState(null);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [profile, setProfile] = useState(null);

    if (!user) return null;
    if (user.role !== 'comprador') {
        return (
            <Page header="Mi cuenta" title={user.name.toUpperCase()} body={ROLE_LABELS[user.role]}>
                <Panel><p>Eres personal de Pixel Gamers. Accede al panel interno.</p><div className="px-row"><Link className="px-btn px-btn--primary" href="/admin/dashboard">Ir al panel</Link><button className="px-btn" onClick={api.logout}>Cerrar sesión</button></div></Panel>
            </Page>
        );
    }

    const orders = state.orders
        .filter((o) => o.userId === user.id)
        .filter((o) => (!from || o.ts >= new Date(from).getTime()) && (!to || o.ts <= new Date(to).getTime() + 86400000))
        .sort((a, b) => b.ts - a.ts);
    const myKeys = state.orders.filter((o) => o.userId === user.id).flatMap((o) => o.keyIds.map((id) => ({ key: state.keys.find((k) => k.id === id), order: o }))).filter((x) => x.key);
    const p = profile || user;

    const confirmReveal = (e) => {
        e.preventDefault();
        if (pw !== user.password) return notify('Contraseña incorrecta', 'err');
        setRevealed((r) => ({ ...r, [auth]: true }));
        setAuth(null);
        setPw('');
    };

    return (
        <Page header="Mi cuenta" title={user.name.toUpperCase()} body={`${user.email} · ${user.points} puntos gamer`} wide>
            <div className="px-stats">
                <Stat label="Pedidos" value={state.orders.filter((o) => o.userId === user.id).length} />
                <Stat label="Claves en bóveda" value={myKeys.length} />
                <Stat label="Puntos gamer" value={user.points} sub="1 punto por cada $1.000" tone="ok" />
            </div>

            <Tabs value={tab} onChange={setTab} tabs={[{ id: 'vault', label: 'Bóveda digital' }, { id: 'orders', label: 'Historial de pedidos' }, { id: 'profile', label: 'Perfil y preferencias' }]} />

            {tab === 'vault' && (
                <Panel title="Bóveda de claves digitales" actions={<button className="px-btn px-btn--sm" onClick={() => setGuide(true)}>¿Cómo canjear?</button>} note="Las claves se almacenan cifradas. Para revelarlas debes volver a ingresar tu contraseña.">
                    {myKeys.length === 0 && <div className="px-empty"><p>Aún no tienes claves digitales.</p><Link className="px-btn" href="/">Ver juegos digitales</Link></div>}
                    {myKeys.map(({ key, order }) => {
                        const prod = getProduct(state, key.productId);
                        const reviewed = state.reviews.some((r) => r.productId === prod.id && r.userId === user.id);
                        return (
                            <div key={key.id} className="vault-key">
                                <div className="px-stack" style={{ gap: 4 }}>
                                    <strong>{prod.title}</strong>
                                    <KeyCode keyObj={key} revealed={revealed[key.id]} />
                                    <span className="px-muted">Orden {order.id} · {fmtDate(order.ts)}</span>
                                </div>
                                <div className="px-row">
                                    {revealed[key.id] ? (
                                        <button className="px-btn px-btn--sm" onClick={() => { navigator.clipboard?.writeText(decryptKey(key.enc)); notify('Clave copiada'); }}>Copiar</button>
                                    ) : (
                                        <button className="px-btn px-btn--sm px-btn--primary" onClick={() => setAuth(key.id)}>🔓 Revelar</button>
                                    )}
                                    <button className="px-btn px-btn--sm" onClick={() => setReceipt(order)}>Boleta PDF</button>
                                    {!reviewed && <Link className="px-btn px-btn--sm" href={`/product/${prod.id}`}>★ Reseñar</Link>}
                                </div>
                            </div>
                        );
                    })}
                </Panel>
            )}

            {tab === 'orders' && (
                <Panel title="Historial de compras">
                    <div className="px-form-grid" style={{ maxWidth: 440 }}>
                        <Field label="Desde"><input className="px-input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></Field>
                        <Field label="Hasta"><input className="px-input" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></Field>
                    </div>
                    {orders.length === 0 && <p className="px-muted">Sin pedidos en el rango.</p>}
                    <div className="px-table-wrap">
                        <table className="px-table">
                            <thead><tr><th>Orden</th><th>Fecha</th><th>Productos</th><th>Estado</th><th className="num">Total</th><th /></tr></thead>
                            <tbody>
                                {orders.map((o) => (
                                    <tr key={o.id}>
                                        <td className="mono">{o.id}</td>
                                        <td>{fmtDate(o.ts)}</td>
                                        <td>{o.items.map((i) => `${i.qty}× ${getProduct(state, i.productId)?.title}`).join(', ')}</td>
                                        <td><Badge tone={o.status.startsWith('Entregado') ? 'ok' : 'info'}>{o.status}</Badge></td>
                                        <td className="num">{clp(o.total)}</td>
                                        <td>
                                            <div className="px-row">
                                                <button className="px-btn px-btn--sm" onClick={() => setReceipt(o)}>Boleta</button>
                                                {o.tracking && <Link className="px-btn px-btn--sm" href={`/tracking?code=${o.tracking.id}`}>Rastrear</Link>}
                                                {o.delivery.pickupCode && o.status === 'Listo para retiro' && <button className="px-btn px-btn--sm" onClick={() => setTicket(o)}>QR retiro</button>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Panel>
            )}

            {tab === 'profile' && (
                <div className="px-stack">
                    <Panel title="Datos personales">
                        <div className="px-form-grid">
                            <Field label="Nombre"><input className="px-input" value={p.name} onChange={(e) => setProfile({ ...p, name: e.target.value })} /></Field>
                            <Field label="Teléfono"><input className="px-input" value={p.phone || ''} onChange={(e) => setProfile({ ...p, phone: e.target.value })} /></Field>
                            <Field label="Dirección"><input className="px-input" value={p.address || ''} onChange={(e) => setProfile({ ...p, address: e.target.value })} /></Field>
                            <Field label="Comuna"><select className="px-select" value={p.comuna || 'Providencia'} onChange={(e) => setProfile({ ...p, comuna: e.target.value })}>{Object.keys(COMUNAS).map((c) => <option key={c}>{c}</option>)}</select></Field>
                            <Field label="Región de tu consola"><select className="px-select" value={p.region} onChange={(e) => setProfile({ ...p, region: e.target.value })}>{REGIONS.filter((r) => r !== 'Global').map((r) => <option key={r}>{r}</option>)}</select></Field>
                        </div>
                        <div><button className="px-btn px-btn--primary" disabled={!profile} onClick={() => { api.updateProfile(user.id, { name: p.name, phone: p.phone, address: p.address, comuna: p.comuna, region: p.region }); setProfile(null); notify('Perfil actualizado'); }}>Guardar cambios</button></div>
                    </Panel>
                    <Panel title="Preferencias">
                        <label className="px-check">
                            <input type="checkbox" checked={user.newsletter} onChange={(e) => { api.subscribe(user.email, e.target.checked); notify(e.target.checked ? 'Suscrito al boletín' : 'Desuscrito: ya no recibirás promociones'); }} />
                            Boletín de lanzamientos, preventas y promociones
                        </label>
                        <Alert tone="info">Cada correo promocional incluye un enlace de desuscripción en un clic.</Alert>
                        <div className="px-row">
                            <button className="px-btn" onClick={api.logout}>Cerrar sesión</button>
                            <Link className="px-btn" href="/outbox">Ver correos recibidos</Link>
                        </div>
                    </Panel>
                </div>
            )}

            {auth && (
                <Modal title="Confirma tu identidad" onClose={() => setAuth(null)}>
                    <form className="px-stack" onSubmit={confirmReveal}>
                        <p>Por seguridad, ingresa tu contraseña para revelar la clave.</p>
                        <Field label="Contraseña"><input className="px-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus /></Field>
                        <button className="px-btn px-btn--primary">Revelar clave</button>
                    </form>
                </Modal>
            )}
            {guide && <RedeemGuide onClose={() => setGuide(false)} />}
            {receipt && <Receipt state={state} order={receipt} onClose={() => setReceipt(null)} />}
            {ticket && <PickupTicket order={ticket} onClose={() => setTicket(null)} />}
        </Page>
    );
};

export default Account;
