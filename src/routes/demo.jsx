import { useLocation } from "wouter";
import { Page, Panel, Badge, Alert } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { ROLE_LABELS } from "../store/mockData";

/* Guía del prototipo: cada fila corresponde a una figura de «HDU Pixel Gamers – Imágenes necesarias». */
const SCREENS = [
    ['Día 1', '1.1', 'Pantalla de Login Unificado y Autenticación POS', '/login', null],
    ['Día 2', '1.2', 'Panel de Administración de Usuarios y Matriz RBAC', '/admin/users', 'u4'],
    ['Día 3', '1.3', 'Módulo Logístico de Carga Masiva de Claves Digitales', '/admin/keys', 'u3'],
    ['Día 4', '1.4', 'Catálogo Web de Videojuegos con Filtros Inteligentes', '/', null],
    ['Día 5', '1.5', 'Ficha de Producto con Disponibilidad Omnicanal', '/product/p12', null],
    ['Día 6', '2.1', 'Terminal POS presencial con Escaneo de Código de Barras', '/admin/pos', 'u2', 's1'],
    ['Día 7', '2.2', 'Pantalla de Cobro POS y Boleta / Voucher Clave (agrega productos y pulsa «Cobrar»)', '/admin/pos', 'u2', 's1'],
    ['Día 8', '2.3', 'Carrito de Compras Unificado Web (Físicos + Licencias)', '/cart', 'u1', null, 'cart'],
    ['Día 9', '2.4', 'Checkout Web con Pasarela de Pago (Webpay / MercadoPago)', '/checkout', 'u1', null, 'cart'],
    ['Día 10', '2.5', 'Confirmación de Compra y Emisión de Boleta + Clave', '/confirmation/PG-100231', 'u1'],
    ['Día 11', '3.1', 'Consola Logística y Generador de Etiquetas de Despacho PDF', '/admin/logistics', 'u3'],
    ['Día 12', '3.2', 'Portal de Seguimiento de Envíos con Tracking ID', '/tracking?code=CHX-5521983', null],
    ['Día 13', '3.3', 'Módulo POS de Entrega de Retiro en Tienda (Click & Collect)', '/admin/pickup', 'u2', 's1'],
    ['Día 14', '3.4', 'Consola de Solicitud y Autorización de Traslados Inter-Sucursal', '/admin/transfers', 'u3'],
    ['Día 15', '3.5', 'Bóveda Digital del Cliente e Historial Transaccional', '/account', 'u1'],
    ['Día 16', '4.1', 'Gestor de Campañas de Marketing Local y Alertas POS', '/admin/marketing', 'u2', 's1'],
    ['Día 17', '4.2', 'Dashboard de Auditoría Inalterable de Eventos y Entregas', '/admin/audit', 'u4'],
    ['Día 18', '4.3', 'Terminal POS en Modo Offline (caché local)', '/admin/offline', 'u2', 's1'],
    ['Día 19', '4.4', 'Panel de Salud de Servicios (Healthcheck APIs) y Conmutación', '/admin/health', 'u5'],
    ['Día 20', '4.5', 'Dashboard Ejecutivo Cloud, DRP & Autoescalado', '/admin/dashboard', 'u4'],
];

const Demo = () => {
    const { state, api, user, notify } = useStore();
    const [, navigate] = useLocation();

    const open = ([, , , path, uid, branch, prep]) => {
        if (uid) {
            if (user?.id !== uid || (branch && state.session?.branchId !== branch)) api.login(uid, branch || null);
        } else if (user) api.logout();
        if (prep === 'cart' && state.cart.items.length === 0) {
            api.addToCart('p03', 1);
            api.addToCart('p12', 1);
        }
        navigate(path);
    };

    return (
        <Page header="Guía del prototipo" title="PANTALLAS DEL SPRINT" body="Cada figura de «Imágenes necesarias» abre su pantalla real con el rol correspondiente ya iniciado." wide>
            <Alert tone="info">Todo es simulado: usuarios, productos, claves, pedidos y auditoría viven en un contexto de React y se guardan en <strong>localStorage</strong>. «Reiniciar datos demo» vuelve a la semilla.</Alert>

            <Panel title="Figuras (20 pantallas · 4 sprints)">
                <div className="px-table-wrap">
                    <table className="px-table">
                        <thead><tr><th>Día</th><th>Fig.</th><th>Pantalla</th><th>Rol demo</th><th /></tr></thead>
                        <tbody>
                            {SCREENS.map((s) => (
                                <tr key={s[1]}>
                                    <td>{s[0]}</td><td className="mono">{s[1]}</td><td>{s[2]}</td>
                                    <td>{s[4] ? <Badge tone="contrast">{ROLE_LABELS[state.users.find((u) => u.id === s[4])?.role]}</Badge> : <Badge>Público</Badge>}</td>
                                    <td><button className="px-btn px-btn--sm px-btn--primary" onClick={() => open(s)}>Abrir →</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Panel>

            <Panel title="Datos de la demo">
                <p className="px-panel__note">Un usuario por rol (clave 2FA de roles administrativos: 123456). Credenciales visibles en /login.</p>
                <div className="px-row">
                    <button className="px-btn" onClick={() => navigate('/login')}>Ir al login</button>
                    <button className="px-btn px-btn--danger" onClick={() => { if (window.confirm('¿Reiniciar todos los datos demo?')) { api.resetDemo(); notify('Datos demo reiniciados'); } }}>Reiniciar datos demo</button>
                </div>
            </Panel>
        </Page>
    );
};

export default Demo;
