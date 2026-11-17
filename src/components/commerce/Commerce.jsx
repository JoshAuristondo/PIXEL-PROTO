import { useState } from "react";
import "../../styles/shop.scss";
import { Barcode, FakeQR, Modal, PrintSheet } from "../ui/Ui";
import { BRANCHES } from "../../store/mockData";
import { getProduct, getUser } from "../../store/selectors";
import { clp, decryptKey, fmtDateTime, splitIva } from "../../store/utils";

/* Boleta electrónica imprimible (PDF vía "Guardar como PDF" del navegador). */
export const Receipt = ({ state, order, onClose }) => {
    const user = getUser(state, order.userId);
    const { neto, iva } = splitIva(order.total - (order.shipping || 0));
    const keys = (order.keyIds || []).map((id) => state.keys.find((k) => k.id === id)).filter(Boolean);
    return (
        <PrintSheet onClose={onClose}>
            <div className="sheet-center"><h3>PIXEL GAMERS SpA</h3><div>RUT 77.123.456-7 · Boleta electrónica</div></div>
            <hr />
            <div className="sheet-row"><span>Folio N° {order.folio}</span><span>{fmtDateTime(order.ts)}</span></div>
            <div>Orden {order.id} · {order.payment.gateway} {order.payment.method} · Aut. {order.payment.auth}</div>
            <div>Cliente: {user?.name} · {user?.rut}</div>
            <hr />
            <table>
                <thead><tr><th>Producto</th><th className="num">Cant.</th><th className="num">Total</th></tr></thead>
                <tbody>
                    {order.items.map((i) => (
                        <tr key={i.productId}><td>{getProduct(state, i.productId)?.title}</td><td className="num">{i.qty}</td><td className="num">{clp(i.price * i.qty)}</td></tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <div className="sheet-row"><span>Neto</span><span>{clp(neto)}</span></div>
            <div className="sheet-row"><span>IVA 19%</span><span>{clp(iva)}</span></div>
            <div className="sheet-row"><span>Despacho</span><span>{order.shipping ? clp(order.shipping) : 'Gratis'}</span></div>
            <div className="sheet-row"><strong>TOTAL</strong><strong>{clp(order.total)}</strong></div>
            {keys.length > 0 && <div>Claves digitales entregadas: {keys.length} (ver bóveda y correo).</div>}
            <hr />
            <div className="sheet-center"><FakeQR value={order.id} size={96} /><div>Timbre electrónico SII (simulado)</div></div>
        </PrintSheet>
    );
};

export const PickupTicket = ({ order, onClose }) => (
    <PrintSheet onClose={onClose}>
        <div className="sheet-center"><h3>Retiro en tienda</h3></div>
        <div>Pedido {order.id} · {BRANCHES.find((b) => b.id === order.delivery.branchId)?.name}</div>
        <div className="sheet-center"><FakeQR value={order.delivery.pickupCode} size={150} /></div>
        <div className="sheet-key">{order.delivery.pickupCode}</div>
        <div className="sheet-center">Presenta este código o tu RUT al vendedor.</div>
    </PrintSheet>
);

/* Guía interactiva de canje (≤ 4 pantallas, RNF-27). */
const STEPS = [
    { t: 'Copia tu clave', d: 'Abre tu bóveda digital y presiona “Revelar” para ver el código de 16 caracteres. Cópialo con un clic.' },
    { t: 'Entra a tu plataforma', d: 'PlayStation: PSN › Canjear códigos · Xbox: Microsoft Store › Canjear · Nintendo: eShop › Introducir código · PC: Steam › Activar producto.' },
    { t: 'Pega y confirma', d: 'Ingresa el código sin espacios. Verifica que la región de la clave coincida con la de tu cuenta.' },
    { t: '¡A jugar!', d: 'Tu juego queda en tu biblioteca y comenzará a descargarse desde los servidores oficiales de la plataforma.' },
];

export const RedeemGuide = ({ onClose }) => {
    const [i, setI] = useState(0);
    const s = STEPS[i];
    return (
        <Modal title="Cómo canjear tu clave" onClose={onClose}>
            <div className="guide">
                <div className="guide__step">{i + 1}</div>
                <strong className="px-mono">{s.t}</strong>
                <p>{s.d}</p>
                <div className="guide__dots">{STEPS.map((_, n) => <span key={n} className={n === i ? 'on' : ''} />)}</div>
                <div className="px-row">
                    <button className="px-btn" disabled={i === 0} onClick={() => setI(i - 1)}>← Anterior</button>
                    {i < STEPS.length - 1 ? <button className="px-btn px-btn--primary" onClick={() => setI(i + 1)}>Siguiente →</button> : <button className="px-btn px-btn--primary" onClick={onClose}>Entendido</button>}
                </div>
            </div>
        </Modal>
    );
};

export const KeyCode = ({ keyObj, revealed }) => {
    const code = decryptKey(keyObj.enc);
    return <span className="vault-key__code">{revealed ? code : code.replace(/[A-Z0-9]/g, '•')}</span>;
};

export const ShipLabel = ({ state, order, onClose }) => {
    const user = getUser(state, order.userId);
    const code = order.tracking?.id || order.id;
    return (
        <PrintSheet onClose={onClose}>
            <div className="sheet-row"><h3>PIXEL GAMERS · DESPACHO</h3><strong>{(order.tracking?.courier || order.delivery.courier || '').toUpperCase()}</strong></div>
            <hr />
            <div><strong>Remitente:</strong> Bodega Central Pixel Gamers · Av. Américo Vespucio 399, Maipú</div>
            <div><strong>Destinatario:</strong> {user?.name} · {user?.phone}</div>
            <div>{order.delivery.address}, {order.delivery.comuna}</div>
            <Barcode value={code} height={60} />
            <div className="sheet-center px-mono">{code}</div>
            <hr />
            <h3>Packing slip</h3>
            <table>
                <thead><tr><th>SKU</th><th>Producto</th><th className="num">Cant.</th></tr></thead>
                <tbody>
                    {order.items.filter((i) => i.format === 'fisico' || i.format === 'accesorio').map((i) => {
                        const p = getProduct(state, i.productId);
                        return <tr key={i.productId}><td>{p.sku}</td><td>{p.title}</td><td className="num">{i.qty}</td></tr>;
                    })}
                </tbody>
            </table>
            {order.items.some((i) => getProduct(state, i.productId)?.fragile) && <div className="sheet-key">⚠ FRÁGIL — EMPAQUE ESPECIAL</div>}
            <div>Pedido {order.id} · {fmtDateTime(order.ts)}</div>
        </PrintSheet>
    );
};
