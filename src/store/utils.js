// Utilidades compartidas del prototipo (todo es simulado, nada sale del navegador).

export const IVA_RATE = 0.19;

export const clp = (n) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(Math.round(n || 0));

export const fmtDateTime = (ts) =>
    ts ? new Date(ts).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export const fmtDate = (ts) => (ts ? new Date(ts).toLocaleDateString('es-CL') : '—');

const pad = (n) => String(n).padStart(2, '0');
export const dayKey = (ts) => {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Precios incluyen IVA: se desglosa neto + IVA 19%.
export const splitIva = (total) => {
    const neto = Math.round(total / (1 + IVA_RATE));
    return { neto, iva: Math.round(total) - neto };
};

/* ---------- hash / rng ---------- */

export function hash53(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;
    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export const hashHex = (s) => hash53(String(s)).toString(16).padStart(14, '0');

export function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/* ---------- "cifrado" simulado de claves digitales ---------- */

const xorStr = (str) =>
    str
        .split('')
        .map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ (7 + (i % 5))))
        .join('');

export const encryptKey = (code) => 'AES256$' + btoa(xorStr(code));

export const decryptKey = (enc) => {
    try {
        return xorStr(atob(String(enc).replace('AES256$', '')));
    } catch {
        return '';
    }
};

export const KEY_REGEX = /^[A-Z0-9]{4}(-[A-Z0-9]{4}){3}$/;
export const isValidKeyEnc = (enc) => KEY_REGEX.test(decryptKey(enc));
export const maskKey = (code) => code.replace(/[A-Z0-9]/g, '•');

/* ---------- RUT chileno ---------- */

export const cleanRut = (r) => String(r || '').replace(/[^0-9kK]/g, '').toUpperCase();

export const rutDv = (body) => {
    let sum = 0;
    let mul = 2;
    String(body)
        .split('')
        .reverse()
        .forEach((d) => {
            sum += Number(d) * mul;
            mul = mul === 7 ? 2 : mul + 1;
        });
    const r = 11 - (sum % 11);
    return r === 11 ? '0' : r === 10 ? 'K' : String(r);
};

export const formatRut = (r) => {
    const c = cleanRut(r);
    if (c.length < 2) return c;
    const body = c.slice(0, -1);
    return body.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + c.slice(-1);
};

export const mkRut = (body) => formatRut(String(body) + rutDv(body));

export const validRut = (r) => {
    const c = cleanRut(r);
    if (c.length < 8) return false;
    return rutDv(c.slice(0, -1)) === c.slice(-1);
};

/* ---------- varios ---------- */

export const passwordStrength = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/\d/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4);
};

export const tempPassword = (seed) => `Tmp#${hashHex(seed).slice(0, 8)}!`;

export const downloadFile = (filename, text, mime = 'text/plain') => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const beep = (freq = 220, ms = 180) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'square';
        gain.gain.value = 0.05;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        setTimeout(() => {
            osc.stop();
            ctx.close();
        }, ms);
    } catch {
        /* sin audio */
    }
};

export const sum = (arr, fn = (x) => x) => arr.reduce((a, b) => a + fn(b), 0);
