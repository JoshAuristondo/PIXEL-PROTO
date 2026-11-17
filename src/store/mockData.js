import { encryptKey, mulberry32, hashHex, mkRut } from './utils';

export const DAY = 86400000;
export const HOUR = 3600000;

/* ---------- catálogos estáticos ---------- */

export const BRANCHES = [
    { id: 's1', name: 'Mallplaza Tobalaba', short: 'Sucursal 1', address: 'Av. Camilo Henríquez 3692, Puente Alto', comuna: 'Puente Alto', phone: '+56 2 2555 0101' },
    { id: 's2', name: 'Costanera Center', short: 'Sucursal 2', address: 'Av. Andrés Bello 2447, Providencia', comuna: 'Providencia', phone: '+56 2 2555 0102' },
    { id: 's3', name: 'Arauco Maipú', short: 'Sucursal 3', address: 'Av. Américo Vespucio 399, Maipú', comuna: 'Maipú', phone: '+56 2 2555 0103' },
];

export const ROLE_LABELS = {
    comprador: 'Comprador',
    vendedor: 'Vendedor de Tienda',
    supervisor: 'Supervisor Logístico',
    ti: 'TI / Sistemas',
    admin: 'Administrador de Negocio',
};

export const STAFF_ROLES = ['vendedor', 'supervisor', 'ti', 'admin'];
export const TWO_FA_ROLES = ['supervisor', 'ti', 'admin'];
export const DEMO_2FA_CODE = '123456';

export const PLATFORMS = ['PS5', 'Xbox', 'Switch', 'PC'];
export const FORMATS = { fisico: 'Físico', digital: 'Digital', suscripcion: 'Suscripción', dlc: 'DLC', accesorio: 'Accesorio' };
export const REGIONS = ['Global', 'LATAM', 'EE.UU.', 'Europa'];

export const COMUNAS = {
    Santiago: 2490,
    Providencia: 2990,
    Ñuñoa: 3290,
    'Las Condes': 3490,
    Vitacura: 3490,
    Maipú: 2990,
    'Puente Alto': 3490,
    'La Florida': 3290,
    'San Bernardo': 3990,
    Pudahuel: 3690,
};

export const SHIP_STAGES = ['En preparación', 'En camino', 'En reparto', 'Entregado'];

// Módulos del panel interno y permisos CRUD por rol (matriz RBAC editable).
export const MODULES = [
    { id: 'dashboard', label: 'Dashboard ejecutivo', path: '/admin/dashboard' },
    { id: 'usuarios', label: 'Usuarios y RBAC', path: '/admin/users' },
    { id: 'pos', label: 'Terminal POS', path: '/admin/pos' },
    { id: 'retiro', label: 'Retiro en tienda', path: '/admin/pickup' },
    { id: 'traslados', label: 'Traslados', path: '/admin/transfers' },
    { id: 'inventario', label: 'Inventario', path: '/admin/inventory' },
    { id: 'claves', label: 'Claves digitales', path: '/admin/keys' },
    { id: 'logistica', label: 'Logística y despachos', path: '/admin/logistics' },
    { id: 'marketing', label: 'Marketing y alertas', path: '/admin/marketing' },
    { id: 'auditoria', label: 'Auditoría', path: '/admin/audit' },
    { id: 'salud', label: 'Salud de servicios', path: '/admin/health' },
];

const F = { c: true, r: true, u: true, d: true };
const RW = { c: true, r: true, u: true, d: false };
const R = { c: false, r: true, u: false, d: false };
const N = { c: false, r: false, u: false, d: false };

export const DEFAULT_RBAC = {
    admin: Object.fromEntries(MODULES.map((m) => [m.id, { ...F }])),
    vendedor: { dashboard: N, usuarios: N, pos: RW, retiro: RW, traslados: { c: true, r: true, u: false, d: false }, inventario: R, claves: N, logistica: N, marketing: { c: true, r: true, u: false, d: false }, auditoria: N, salud: N },
    supervisor: { dashboard: N, usuarios: N, pos: R, retiro: R, traslados: RW, inventario: RW, claves: RW, logistica: RW, marketing: R, auditoria: R, salud: R },
    ti: { dashboard: R, usuarios: R, pos: N, retiro: N, traslados: N, inventario: R, claves: R, logistica: N, marketing: N, auditoria: R, salud: RW },
};

/* ---------- usuarios (1 por tipo) ---------- */

const now0 = Date.now();

const USERS = [
    {
        id: 'u1', role: 'comprador', name: 'Camila Rojas Pérez', rut: mkRut(19456789), email: 'camila.rojas@demo.cl',
        phone: '+56 9 5555 0101', address: 'Av. Providencia 1234, Depto 56', comuna: 'Providencia', region: 'LATAM',
        password: 'Gamer2026!', newsletter: true, points: 1250, active: true, createdAt: now0 - 120 * DAY,
    },
    {
        id: 'u2', role: 'vendedor', name: 'Diego Fuentes Vera', rut: mkRut(17234567), email: 'diego.fuentes@pixelgamers.cl',
        branches: ['s1'], password: 'Vendedor#Pixel26', pin: '1234', active: true, createdAt: now0 - 300 * DAY,
    },
    {
        id: 'u3', role: 'supervisor', name: 'Valentina Mora Díaz', rut: mkRut(16345678), email: 'valentina.mora@pixelgamers.cl',
        branches: ['s1', 's2', 's3'], password: 'Logistica#Pixel26', active: true, createdAt: now0 - 400 * DAY,
    },
    {
        id: 'u4', role: 'admin', name: 'Andrés Contreras Silva', rut: mkRut(12456789), email: 'admin@pixelgamers.cl',
        branches: ['s1', 's2', 's3'], password: 'Admin#Pixel2026!', active: true, createdAt: now0 - 700 * DAY,
    },
    {
        id: 'u5', role: 'ti', name: 'Sebastián Paredes Lagos', rut: mkRut(15678901), email: 'ti@pixelgamers.cl',
        branches: ['s1', 's2', 's3'], password: 'Sistemas#Pixel26', active: true, createdAt: now0 - 500 * DAY,
    },
];

/* ---------- productos ---------- */

const P = (id, title, platforms, format, genre, price, o = {}) => ({
    id,
    sku: `PG-${id.toUpperCase()}`,
    barcode: `780${String(1000000 + Number(id.slice(1)) * 7919).slice(0, 9)}`,
    title,
    platforms,
    format,
    genre,
    price,
    description: '',
    age: '+12',
    voices: 'Español LATAM / Inglés',
    subtitles: 'Español / Inglés',
    region: format === 'fisico' || format === 'accesorio' ? 'Global' : 'LATAM',
    active: true,
    critical: 3,
    fragile: false,
    popular: false,
    stock: { s1: 0, s2: 0, s3: 0, web: 0 },
    ...o,
});

const PRODUCTS = [
    P('p01', 'God of War Ragnarök', ['PS5'], 'fisico', 'Acción', 44990, { age: '+18', popular: true, description: 'Kratos y Atreus enfrentan el fin del mundo nórdico en una aventura épica de combate brutal y narrativa intensa.', stock: { s1: 5, s2: 3, s3: 2, web: 12 } }),
    P('p02', "Marvel's Spider-Man 2", ['PS5'], 'fisico', 'Acción', 49990, { age: '+12', popular: true, description: 'Peter y Miles recorren una Nueva York ampliada, con nuevas habilidades y una amenaza simbionte.', stock: { s1: 2, s2: 6, s3: 4, web: 9 } }),
    P('p03', 'EA SPORTS FC 26', ['PS5'], 'digital', 'Deportes', 59990, { age: '+3', popular: true, description: 'El fútbol más completo con nuevos modos, plantillas actualizadas y juego online. Código de descarga PSN.' }),
    P('p04', 'Gran Turismo 7', ['PS5'], 'digital', 'Carreras', 34990, { age: '+3', description: 'Más de 400 autos, circuitos legendarios y un modo carrera pensado para coleccionistas del motor.' }),
    P('p05', 'PlayStation Plus Esencial · 12 meses', ['PS5'], 'suscripcion', 'Servicio', 54990, { age: '+3', region: 'LATAM', description: 'Juego online, juegos mensuales y descuentos exclusivos durante un año. Código para canje en PSN.' }),
    P('p06', 'Control DualSense Blanco', ['PS5'], 'accesorio', 'Accesorio', 74990, { age: '—', voices: '—', subtitles: '—', description: 'Control inalámbrico con gatillos adaptativos y retroalimentación háptica.', stock: { s1: 6, s2: 8, s3: 5, web: 20 } }),

    P('p07', 'Halo Infinite', ['Xbox', 'PC'], 'digital', 'Shooter', 29990, { age: '+16', region: 'EE.UU.', description: 'El Jefe Maestro regresa en una campaña de mundo abierto y un multijugador free-to-play.' }),
    P('p08', 'Forza Horizon 5', ['Xbox', 'PC'], 'digital', 'Carreras', 39990, { age: '+3', popular: true, description: 'Carreras abiertas en un México vibrante: festival, eventos y cientos de autos.' }),
    P('p09', 'Xbox Game Pass Ultimate · 3 meses', ['Xbox', 'PC'], 'suscripcion', 'Servicio', 44990, { age: '+3', region: 'Global', description: 'Catálogo rotativo de cientos de juegos en consola y PC, más Xbox Live Gold.' }),
    P('p10', 'Control Xbox Wireless Carbon', ['Xbox', 'PC'], 'accesorio', 'Accesorio', 64990, { age: '—', voices: '—', subtitles: '—', description: 'Control ergonómico con Bluetooth, compatible con consola, PC y móviles.', stock: { s1: 4, s2: 3, s3: 2, web: 14 } }),
    P('p11', 'Starfield', ['Xbox'], 'fisico', 'RPG', 29990, { age: '+16', description: 'Explora más de mil planetas como parte de la expedición Constelación.', stock: { s1: 1, s2: 0, s3: 3, web: 7 } }),

    P('p12', 'The Legend of Zelda: Tears of the Kingdom', ['Switch'], 'fisico', 'Aventura', 59990, { age: '+12', popular: true, fragile: true, description: 'Hyrule vuelve a cambiar: cielo, superficie y profundidades por descubrir. Edición coleccionista con caja reforzada.', stock: { s1: 3, s2: 2, s3: 1, web: 8 } }),
    P('p13', 'Super Mario Bros. Wonder', ['Switch'], 'fisico', 'Plataformas', 54990, { age: '+3', popular: true, description: 'Plataformas 2D con flores Maravilla que transforman cada nivel. Hasta 4 jugadores.', stock: { s1: 4, s2: 5, s3: 3, web: 10 } }),
    P('p14', 'Mario Kart 8 Deluxe', ['Switch'], 'digital', 'Carreras', 49990, { age: '+3', popular: true, description: 'El clásico de carreras con todas las pistas y personajes. Código de descarga eShop.' }),
    P('p15', 'Joy-Con Par Neón', ['Switch'], 'accesorio', 'Accesorio', 69990, { age: '—', voices: '—', subtitles: '—', description: 'Par de controles Joy-Con rojo y azul neón con correas incluidas.', stock: { s1: 2, s2: 4, s3: 0, web: 11 } }),
    P('p16', 'Hollow Knight: Silksong', ['Switch', 'PC'], 'digital', 'Metroidvania', 17990, { age: '+7', description: 'Hornet viaja a un reino nuevo en una aventura de acción y exploración dibujada a mano.' }),

    P('p17', 'Cyberpunk 2077', ['PC'], 'digital', 'RPG', 24990, { age: '+18', region: 'Global', popular: true, description: 'RPG de mundo abierto en Night City. Clave de activación Steam.' }),
    P('p18', 'Cyberpunk 2077: Phantom Liberty', ['PC'], 'dlc', 'RPG', 19990, { age: '+18', region: 'Global', description: 'Expansión de espionaje y thriller político ambientada en Dogtown. Requiere juego base.' }),
    P('p19', 'Elden Ring', ['PC'], 'digital', 'RPG', 39990, { age: '+16', region: 'Europa', popular: true, description: 'Explora las Tierras Intermedias en un RPG de acción de mundo abierto. Clave Steam región Europa.' }),
    P('p20', 'Stardew Valley', ['PC', 'Switch'], 'digital', 'Simulación', 8990, { age: '+3', region: 'Global', description: 'Hereda la granja de tu abuelo y construye una nueva vida rural.' }),
    P('p21', 'Headset Gamer HyperX Cloud', ['PS5', 'Xbox', 'Switch', 'PC'], 'accesorio', 'Accesorio', 59990, { age: '—', voices: '—', subtitles: '—', description: 'Audífonos con micrófono desmontable, espuma viscoelástica y compatibilidad multiplataforma.', stock: { s1: 5, s2: 4, s3: 6, web: 18 } }),
    P('p22', 'Resident Evil 4 Remake', ['PS5'], 'fisico', 'Terror', 39990, { age: '+18', description: 'Leon S. Kennedy regresa en la reimaginación del clásico de survival horror.', stock: { s1: 0, s2: 0, s3: 0, web: 0 } }),
];

/* ---------- claves digitales (almacenadas "cifradas") ---------- */

const rng = mulberry32(20260316);
const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const genCode = () =>
    Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => ALPH[Math.floor(rng() * ALPH.length)]).join('')).join('-');

const mkKey = (n, productId, code, extra = {}) => ({
    id: `k${String(n).padStart(3, '0')}`,
    productId,
    enc: encryptKey(code),
    hash: hashHex(code),
    status: 'disponible',
    orderId: null,
    assignedTo: null,
    assignedAt: null,
    importedAt: now0 - 30 * DAY,
    ...extra,
});

const buildKeys = () => {
    const keys = [];
    let n = 1;
    const digital = PRODUCTS.filter((p) => ['digital', 'suscripcion', 'dlc'].includes(p.format));
    digital.forEach((p) => {
        const count = p.id === 'p20' ? 3 : 6 + Math.floor(rng() * 4);
        for (let i = 0; i < count; i++) keys.push(mkKey(n++, p.id, genCode()));
    });
    return { keys, next: n };
};

/* ---------- semilla completa ---------- */

export const buildInitialState = () => {
    const now = Date.now();
    const { keys, next } = buildKeys();

    // Casos de auditoría: una clave corrupta y una duplicada (se detectan al escanear).
    const dupSource = keys.find((k) => k.productId === 'p08');
    keys.push(mkKey(next, 'p08', '0000-0000-0000-0000', { enc: dupSource.enc, hash: dupSource.hash }));
    keys.push(mkKey(next + 1, 'p19', 'ZZZZ-ZZZZ-ZZZZ-ZZZZ', { enc: 'AES256$%%corrupta%%', hash: hashHex('corrupta') }));

    // Claves ya vendidas en pedidos semilla
    const keyP04 = keys.find((k) => k.productId === 'p04' && k.status === 'disponible');
    Object.assign(keyP04, { status: 'asignada', orderId: 'PG-100231', assignedTo: 'camila.rojas@demo.cl', assignedAt: now - 20 * DAY });

    const products = PRODUCTS.map((p) => ({ ...p, stock: { ...p.stock } }));

    const orders = [
        {
            id: 'PG-100231', folio: 100231, userId: 'u1', ts: now - 20 * DAY, channel: 'web',
            items: [
                { productId: 'p13', qty: 1, price: 54990, format: 'fisico' },
                { productId: 'p04', qty: 1, price: 34990, format: 'digital' },
            ],
            total: 54990 + 34990 + 2990, shipping: 2990,
            delivery: { mode: 'domicilio', address: 'Av. Providencia 1234, Depto 56', comuna: 'Providencia', courier: 'starken' },
            payment: { gateway: 'Webpay', method: 'Crédito', status: 'Pagado', auth: 'A83F21' },
            status: 'Entregado', stage: 3,
            tracking: {
                id: 'STK-77120934', courier: 'starken',
                events: [
                    { ts: now - 20 * DAY + HOUR, stage: 0, text: 'Pedido recibido y en preparación en bodega' },
                    { ts: now - 19 * DAY, stage: 1, text: 'Entregado a Starken — en camino' },
                    { ts: now - 18 * DAY, stage: 2, text: 'En reparto hacia Providencia' },
                    { ts: now - 18 * DAY + 5 * HOUR, stage: 3, text: 'Entregado al cliente' },
                ],
            },
            keyIds: [keyP04.id],
        },
        {
            id: 'PG-100289', folio: 100289, userId: 'u1', ts: now - 3 * DAY, channel: 'web',
            items: [{ productId: 'p12', qty: 1, price: 59990, format: 'fisico' }],
            total: 59990 + 3440, shipping: 3440,
            delivery: { mode: 'domicilio', address: 'Av. Providencia 1234, Depto 56', comuna: 'Providencia', courier: 'chilexpress' },
            payment: { gateway: 'MercadoPago', method: 'Débito', status: 'Pagado', auth: 'MP5521' },
            status: 'En camino', stage: 1,
            tracking: {
                id: 'CHX-5521983', courier: 'chilexpress',
                events: [
                    { ts: now - 3 * DAY + HOUR, stage: 0, text: 'Pedido recibido y en preparación en bodega' },
                    { ts: now - 2 * DAY, stage: 1, text: 'Entregado a Chilexpress — en camino' },
                ],
            },
            keyIds: [],
        },
    ];

    const emails = [
        { id: 'm1', ts: now - 3 * DAY, to: 'camila.rojas@demo.cl', kind: 'Boleta', subject: 'Boleta electrónica PG-100289', body: 'Gracias por tu compra en Pixel Gamers. Adjuntamos tu boleta electrónica (PDF/XML). Total pagado: $63.430.' },
    ];

    let prev = '0'.repeat(14);
    const auditSeed = [
        ['u4', 'Administrador de Negocio', 'Usuarios', 'Alta de usuario', 'Alta de cuenta administrativa Vendedor — Diego Fuentes Vera', 40],
        ['u3', 'Supervisor Logístico', 'Claves', 'Carga masiva de claves', 'Lote de 24 claves cargado y cifrado (AES-256 simulado)', 30],
        ['u4', 'Administrador de Negocio', 'Permisos', 'Cambio de permisos', 'Rol Vendedor: inventario → solo lectura', 22],
        ['u2', 'Vendedor de Tienda', 'Cierre de caja', 'Cierre de turno', 'Cierre de caja Sucursal 1 — descuadre $0', 6],
        ['u3', 'Supervisor Logístico', 'Ajuste de stock', 'Merma registrada', 'PG-P11 Starfield −1 unidad (daño) — código INV-0041', 3],
    ].map(([uidv, actor, module, action, detail, daysAgo], i) => {
        const ts = now - daysAgo * DAY;
        const hash = hashHex(prev + module + action + detail + ts);
        const e = { id: `a${i + 1}`, ts, userId: uidv, actor, module, action, detail, ip: `190.45.${10 + i}.${20 + i * 7}`, prevHash: prev, hash };
        prev = hash;
        return e;
    });

    return {
        v: 1,
        seq: 500,
        session: null,
        users: USERS.map((u) => ({ ...u })),
        products,
        keys,
        orders,
        cart: { items: [], reservedAt: null, delivery: { mode: 'domicilio', comuna: 'Providencia', courier: 'starken', branchId: 's1' } },
        reviews: [
            { id: 'r1', productId: 'p04', userId: 'u1', userName: 'Camila R.', rating: 5, text: 'Gráficos increíbles, la clave llegó al instante y funcionó a la primera.', ts: now - 15 * DAY, verified: true },
            { id: 'r2', productId: 'p13', userId: 'u1', userName: 'Camila R.', rating: 4, text: 'Muy divertido para jugar en familia. El embalaje llegó perfecto.', ts: now - 14 * DAY, verified: true },
            { id: 'r3', productId: 'p01', userId: 'x1', userName: 'Matías G.', rating: 5, text: 'Obra maestra. Retiro en tienda súper rápido.', ts: now - 40 * DAY, verified: true },
            { id: 'r4', productId: 'p01', userId: 'x2', userName: 'Fernanda L.', rating: 4, text: 'Historia muy buena, combate un poco repetitivo al final.', ts: now - 33 * DAY, verified: true },
        ],
        waitlist: [],
        subscribers: [
            ['camila.rojas@demo.cl', 's2', true], ['pablo.m@demo.cl', 's1', true], ['andrea.v@demo.cl', 's1', true], ['jose.t@demo.cl', 's1', false],
            ['marta.s@demo.cl', 's2', true], ['felipe.q@demo.cl', 's2', true], ['natalia.o@demo.cl', 's3', true], ['ricardo.p@demo.cl', 's3', false],
            ['cata.l@demo.cl', 's3', true], ['ignacio.r@demo.cl', 's1', true], ['daniela.f@demo.cl', 's2', true], ['tomas.h@demo.cl', 's3', true],
        ].map(([email, branchId, subscribed]) => ({ email, branchId, subscribed })),
        campaigns: [
            { id: 'c1', name: 'Liquidación Switch', subject: '🔥 Hasta 30% en juegos Switch', template: 'Oferta local', branchId: 's1', status: 'Enviada', scheduledAt: now - 8 * DAY, sentAt: now - 8 * DAY, sent: 4, opens: 3, clicks: 2, createdBy: 'Diego Fuentes' },
            { id: 'c2', name: 'Preventa próximo lanzamiento', subject: 'Reserva tu copia antes que se agote', template: 'Lanzamiento', branchId: 'all', status: 'Programada', scheduledAt: now + 2 * DAY, sentAt: null, sent: 0, opens: 0, clicks: 0, createdBy: 'Andrés Contreras' },
        ],
        audit: auditSeed,
        transfers: [
            { id: 't1', ts: now - 6 * HOUR, fromBranch: 's2', toBranch: 's1', productId: 'p02', qty: 2, status: 'Solicitado', requestedBy: 'Diego Fuentes Vera', guide: null },
        ],
        posSales: [],
        offline: false,
        emails,
        replenish: [],
        stockLog: [],
        adjustments: [],
        importReports: [],
        lastKeyAudit: null,
        couriers: [
            { id: 'starken', name: 'Starken', active: true, latency: 420, success: 99.2, fails: 0, rate: 1 },
            { id: 'chilexpress', name: 'Chilexpress', active: true, latency: 510, success: 98.7, fails: 0, rate: 1.15 },
            { id: 'bluex', name: 'Blue Express', active: true, latency: 460, success: 98.9, fails: 0, rate: 1.05 },
        ],
        primaryCourier: 'starken',
        services: [
            { id: 'db', name: 'Base de datos (PostgreSQL)', latency: 18, success: 99.99, down: false, fails: 0 },
            { id: 'smtp', name: 'Servidor SMTP', latency: 240, success: 99.85, down: false, fails: 0 },
            { id: 'webpay', name: 'Pasarela Webpay', latency: 680, success: 99.4, down: false, fails: 0 },
            { id: 'mercadopago', name: 'Pasarela MercadoPago', latency: 590, success: 99.5, down: false, fails: 0 },
        ],
        healthCheckedAt: now,
        infra: {
            cpu: 34, mem: 52, instances: 2, maxInstances: 6, cpuThreshold: 70, dailyBudget: 120000, spendToday: 41500,
            uptime: 99.94, history: [28, 31, 30, 35, 33, 38, 34, 36, 34], peak: false,
            drp: { lastBackup: now - 6 * HOUR, rtoHours: 2, rpoMin: 15, status: 'Operativo', restores: 0 },
        },
        salesHistory: [18, 14, 22, 19, 27, 31, 24].map((m, i) => ({ day: now - (7 - i) * DAY, web: m * 100000, pos: Math.round(m * 62000) })),
        rbac: JSON.parse(JSON.stringify(DEFAULT_RBAC)),
        loginStats: { ok: 128, failed: 7, injection: 3 },
        policies: { minPassword: 12, twoFa: true, expireDays: 90 },
    };
};
