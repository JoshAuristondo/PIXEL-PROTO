import { useMemo } from 'react';
import { hash53, mulberry32 } from '../../store/utils';

/* Portadas generadas (SVG, sin descargas ni derechos de terceros): cada producto obtiene un
   "sprite" pixel-art simétrico único derivado de su id, con la paleta de su plataforma.
   Pesan menos de 2 KB cada una — compatible con el RNF-30 (landing ≤ 2.5 MB). */

const PALETTES = {
    PS5: ['#06255f', '#1e6bff'],
    Xbox: ['#07400f', '#2fd05a'],
    Switch: ['#7a0a14', '#ff3b4a'],
    PC: ['#23232d', '#ff8c42'],
};

const FORMAT_TAG = { fisico: 'FÍSICO', digital: 'DIGITAL', suscripcion: 'SUSCRIPCIÓN', dlc: 'DLC', accesorio: 'ACCESORIO' };

const wrap = (title, max = 15) => {
    const words = title.replace(/[:·]/g, ' ').split(/\s+/);
    const lines = [];
    let cur = '';
    words.forEach((w) => {
        if ((cur + ' ' + w).trim().length > max && cur) {
            lines.push(cur);
            cur = w;
        } else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
};

const Cover = ({ product, className = '' }) => {
    const art = useMemo(() => {
        const rnd = mulberry32(hash53(product.id));
        const [c1, c2] = PALETTES[product.platforms[0]] || PALETTES.PC;
        const hue = Math.floor(rnd() * 360);
        const cells = [];
        const cols = 4;
        const rows = 8;
        for (let y = 0; y < rows; y++)
            for (let x = 0; x < cols; x++) if (rnd() > 0.46) cells.push([x, y]);
        const accent = `hsl(${hue} 90% 68%)`;
        return { c1, c2, accent, cells, cols, rows };
    }, [product.id, product.platforms]);

    const cell = 12;
    const offX = 90 - art.cols * cell;
    const lines = wrap(product.title);
    const gid = `g-${product.id}`;

    return (
        <svg className={`cover ${className}`} viewBox="0 0 180 240" role="img" aria-label={`Portada de ${product.title}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={art.c2} />
                    <stop offset="1" stopColor={art.c1} />
                </linearGradient>
                <pattern id={`${gid}-s`} width="4" height="4" patternUnits="userSpaceOnUse">
                    <rect width="4" height="2" fill="#000" opacity="0.12" />
                </pattern>
            </defs>
            <rect width="180" height="240" fill={`url(#${gid})`} />
            <g opacity="0.14" stroke="#fff">
                {[40, 80, 120, 160].map((x) => <line key={x} x1={x} y1="0" x2={x} y2="240" />)}
                {[60, 120, 180].map((y) => <line key={y} x1="0" y1={y} x2="180" y2={y} />)}
            </g>
            <g transform={`translate(${offX},52)`} fill={art.accent}>
                {art.cells.map(([x, y]) => (
                    <g key={`${x}-${y}`}>
                        <rect x={x * cell} y={y * cell} width={cell - 1} height={cell - 1} />
                        <rect x={(art.cols * 2 - 1 - x) * cell} y={y * cell} width={cell - 1} height={cell - 1} />
                    </g>
                ))}
            </g>
            <rect width="180" height="24" fill="#000" opacity="0.4" />
            <text x="10" y="16" fill="#fff" fontFamily="monospace" fontSize="11" fontWeight="700">{product.platforms.length > 2 ? 'MULTI' : product.platforms.join(' / ')}</text>
            <text x="170" y="16" fill="#fff" fontFamily="monospace" fontSize="8" textAnchor="end" opacity="0.85">{FORMAT_TAG[product.format]}</text>
            <rect y="168" width="180" height="72" fill="#000" opacity="0.5" />
            {lines.map((l, i) => (
                <text key={i} x="10" y={188 + i * 15} fill="#fff" fontFamily="monospace" fontSize="12.5" fontWeight="700">{l}</text>
            ))}
            <text x="10" y="233" fill={art.accent} fontFamily="monospace" fontSize="8">PIXEL GAMERS ■</text>
            <rect width="180" height="240" fill={`url(#${gid}-s)`} />
        </svg>
    );
};

export default Cover;
