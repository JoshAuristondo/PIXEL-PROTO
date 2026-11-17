import { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import "../../styles/ui.scss";
import Hero from '../hero/hero';
import Loader from '../loader/loader';
import { hash53, mulberry32 } from '../../store/utils';

/* ---------- estructura de página ---------- */

export const Page = ({ header, title, body, wide, narrow, children }) => (
    <>
        <div className="px-page">
            <div className={`px-page__inner ${wide ? 'px-page__inner--wide' : ''} ${narrow ? 'px-page__inner--narrow' : ''}`}>
                {(header || title) && (
                    <div className="px-hero">
                        <Hero header={header} title={title} body={body} />
                    </div>
                )}
                {children}
            </div>
        </div>
        <Loader />
    </>
);

export const Panel = ({ title, actions, note, flat, className = '', children }) => (
    <section className={`px-panel ${flat ? 'px-panel--flat' : ''} ${className}`}>
        {(title || actions) && (
            <div className="px-panel__head">
                {title && <h2 className="px-panel__title">{title}</h2>}
                {actions && <div className="px-row">{actions}</div>}
            </div>
        )}
        {note && <p className="px-panel__note">{note}</p>}
        {children}
    </section>
);

export const Field = ({ label, hint, error, children }) => (
    <label className="px-field">
        {label && <span className="px-field__label">{label}</span>}
        {children}
        {hint && !error && <span className="px-field__hint">{hint}</span>}
        {error && <span className="px-field__error">{error}</span>}
    </label>
);

export const Badge = ({ tone = '', children }) => <span className={`px-badge ${tone ? `px-badge--${tone}` : ''}`}>{children}</span>;

export const Stat = ({ label, value, sub, tone }) => (
    <div className={`px-stat ${tone ? `px-stat--${tone}` : ''}`}>
        <span className="px-stat__label">{label}</span>
        <span className="px-stat__value">{value}</span>
        {sub && <span className="px-stat__sub">{sub}</span>}
    </div>
);

export const Tabs = ({ tabs, value, onChange }) => (
    <div className="px-tabs" role="tablist">
        {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={value === t.id} className={`px-btn px-btn--sm ${value === t.id ? 'px-btn--active' : ''}`} onClick={() => onChange(t.id)}>
                {t.label}
            </button>
        ))}
    </div>
);

export const Alert = ({ tone = 'info', children }) => <div className={`px-alert px-alert--${tone}`}>{children}</div>;

export const Modal = ({ title, onClose, wide, children }) => {
    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose?.();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return createPortal(
        <div className="px-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
            <div className={`px-modal__box ${wide ? 'px-modal__box--wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
                <div className="px-modal__head">
                    <span>{`> ${title}`}</span>
                    <button className="px-btn px-btn--sm px-btn--ghost" onClick={onClose} aria-label="Cerrar">✕</button>
                </div>
                <div className="px-modal__body">{children}</div>
            </div>
        </div>,
        document.body,
    );
};

/* ---------- hoja imprimible (boleta, etiqueta, voucher) ---------- */

export const PrintSheet = ({ onClose, children }) =>
    createPortal(
        <div className="print-modal">
            <div className="print-modal__bar">
                <button className="px-btn px-btn--primary" onClick={() => window.print()}>🖨 Imprimir / Guardar PDF</button>
                <button className="px-btn" onClick={onClose}>Cerrar</button>
            </div>
            <div className="print-modal__sheet">{children}</div>
        </div>,
        document.body,
    );

/* ---------- gráficos decorativos (código de barras y QR simulados) ---------- */

export const Barcode = ({ value, height = 46 }) => {
    const bars = useMemo(() => {
        const out = [];
        let x = 0;
        String(value)
            .split('')
            .forEach((ch) => {
                const code = ch.charCodeAt(0);
                for (let i = 0; i < 7; i++) {
                    const w = (code >> i) & 1 ? 3 : 1;
                    if (i % 2 === 0) out.push({ x, w });
                    x += w;
                }
                x += 2;
            });
        return { out, width: x };
    }, [value]);

    return (
        <svg viewBox={`0 0 ${bars.width} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-label={`Código de barras ${value}`}>
            {bars.out.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height={height} fill="#111" />)}
        </svg>
    );
};

export const FakeQR = ({ value, size = 110 }) => {
    const cells = useMemo(() => {
        const n = 21;
        const rnd = mulberry32(hash53(String(value)));
        const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => rnd() > 0.5));
        const finder = (ox, oy) => {
            for (let y = 0; y < 7; y++)
                for (let x = 0; x < 7; x++) {
                    const edge = x === 0 || y === 0 || x === 6 || y === 6;
                    const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
                    grid[oy + y][ox + x] = edge || core;
                }
            for (let i = 0; i < 8; i++) {
                if (oy + 7 < n && ox + i < n) grid[oy + 7 < n ? oy + 7 : oy][Math.min(ox + i, n - 1)] = false;
            }
        };
        finder(0, 0);
        finder(n - 7, 0);
        finder(0, n - 7);
        return grid;
    }, [value]);

    return (
        <svg viewBox="0 0 21 21" width={size} height={size} shapeRendering="crispEdges" aria-label="Código QR simulado">
            <rect width="21" height="21" fill="#fff" />
            {cells.flatMap((row, y) => row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#111" /> : null)))}
        </svg>
    );
};

export const Stars = ({ value, size = '1rem' }) => (
    <span style={{ color: 'var(--color-contrast)', fontSize: size, letterSpacing: 2 }} aria-label={`${value.toFixed(1)} de 5`}>
        {'★'.repeat(Math.round(value))}
        <span style={{ opacity: 0.3 }}>{'★'.repeat(5 - Math.round(value))}</span>
    </span>
);

export const Sparkline = ({ data, width = 260, height = 70, color = 'var(--color-contrast)' }) => {
    const max = Math.max(...data, 1);
    const pts = data.map((v, i) => `${(i / Math.max(data.length - 1, 1)) * width},${height - (v / max) * (height - 6) - 3}`).join(' ');
    return (
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none" aria-hidden="true">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" />
        </svg>
    );
};

/* Lienzo de firma digital (retiro en tienda) */
export const SignaturePad = ({ onChange }) => {
    const ref = useRef(null);
    const drawing = useRef(false);

    const pos = (e) => {
        const r = ref.current.getBoundingClientRect();
        return { x: ((e.clientX - r.left) / r.width) * ref.current.width, y: ((e.clientY - r.top) / r.height) * ref.current.height };
    };
    const start = (e) => {
        drawing.current = true;
        const ctx = ref.current.getContext('2d');
        const p = pos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ref.current.setPointerCapture(e.pointerId);
    };
    const move = (e) => {
        if (!drawing.current) return;
        const ctx = ref.current.getContext('2d');
        const p = pos(e);
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#111';
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };
    const end = () => {
        if (!drawing.current) return;
        drawing.current = false;
        onChange(ref.current.toDataURL('image/png'));
    };
    const clear = () => {
        const c = ref.current;
        c.getContext('2d').clearRect(0, 0, c.width, c.height);
        onChange(null);
    };

    return (
        <div className="px-stack" style={{ gap: 8 }}>
            <canvas ref={ref} width={420} height={140} style={{ width: '100%', maxWidth: 420, height: 140, background: '#fff', border: '1px solid var(--color-border-line-hover)', touchAction: 'none', cursor: 'crosshair' }} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} />
            <div><button type="button" className="px-btn px-btn--sm" onClick={clear}>Borrar firma</button></div>
        </div>
    );
};
