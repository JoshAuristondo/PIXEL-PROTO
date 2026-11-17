import { lazy, Suspense, useEffect } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import "../../styles/admin.scss";
import { Page, Panel, Badge } from "../../components/ui/Ui";
import { useStore } from "../../store/StoreContext";
import { MODULES, ROLE_LABELS } from "../../store/mockData";
import { can, getBranch } from "../../store/selectors";

const Dashboard = lazy(() => import("./dashboard"));
const Users = lazy(() => import("./users"));
const Pos = lazy(() => import("./pos"));
const Pickup = lazy(() => import("./pickup"));
const Transfers = lazy(() => import("./transfers"));
const Inventory = lazy(() => import("./inventory"));
const Keys = lazy(() => import("./keys"));
const Logistics = lazy(() => import("./logistics"));
const Marketing = lazy(() => import("./marketing"));
const Audit = lazy(() => import("./audit"));
const Health = lazy(() => import("./health"));

const SUBTITLES = {
    dashboard: 'Disponibilidad, recursos cloud, autoescalado y plan de recuperación ante desastres.',
    usuarios: 'Cuentas administrativas, sucursales asignadas y matriz de permisos CRUD (RBAC).',
    pos: 'Venta presencial con escáner de código de barras, cobro combinado y modo offline.',
    retiro: 'Click & Collect: valida la orden web, captura la firma y entrega el paquete.',
    traslados: 'Solicita y autoriza traspasos de mercadería entre sucursales.',
    inventario: 'Recepción de mercadería, umbrales críticos y mermas con aprobación.',
    claves: 'Carga masiva cifrada de licencias y auditoría de integridad.',
    logistica: 'Preparación de pedidos, etiquetas PDF y tracking con courier.',
    marketing: 'Campañas segmentadas por sucursal y alertas de stock crítico.',
    auditoria: 'Bitácora inalterable encadenada por hash de eventos y entregas de claves.',
    salud: 'Healthcheck de base de datos, SMTP, pasarelas y couriers con conmutación.',
};

const AdminRoot = () => {
    const { state, user } = useStore();
    const [location, navigate] = useLocation();

    const isStaff = user && user.role !== 'comprador';
    useEffect(() => {
        if (!user) navigate('/login');
        else if (!isStaff) navigate('/account');
    }, [user, isStaff, navigate]);

    if (!isStaff) return null;

    const visible = MODULES.filter((m) => can(state, m.id, 'r'));
    const current = MODULES.find((m) => location.startsWith(m.path)) || (location.startsWith('/admin/offline') ? MODULES.find((m) => m.id === 'pos') : null);
    const allowed = current ? can(state, current.id, 'r') : true;
    const branch = getBranch(state.session?.branchId);

    return (
        <Page header="Panel interno" title={(current?.label || 'INICIO').toUpperCase()} body={current ? SUBTITLES[current.id] : 'Selecciona un módulo.'} wide>
            <div className="admin">
                <nav className="admin__nav" aria-label="Módulos">
                    <div className="admin__who">
                        <strong>{user.name}</strong>
                        <Badge tone="contrast">{ROLE_LABELS[user.role]}</Badge>
                        {branch && <span className="px-muted">{branch.name}</span>}
                    </div>
                    {visible.map((m) => (
                        <Link key={m.id} href={m.path} className={`admin__link ${current?.id === m.id ? 'admin__link--active' : ''}`}>
                            <span>{m.label}</span>
                            <span>{current?.id === m.id ? '■' : '□'}</span>
                        </Link>
                    ))}
                    {state.offline && <Badge tone="warn">POS OFFLINE</Badge>}
                </nav>

                <main className="admin__main">
                    {!allowed ? (
                        <Panel title="Acceso denegado">
                            <p>Tu rol (<strong>{ROLE_LABELS[user.role]}</strong>) no tiene permiso de lectura sobre este módulo. Un administrador puede cambiarlo en <em>Usuarios y RBAC</em>.</p>
                        </Panel>
                    ) : (
                        <Suspense fallback={<Panel><span className="px-muted">Cargando módulo…</span></Panel>}>
                            <Switch>
                                <Route path="/admin/dashboard" component={Dashboard} />
                                <Route path="/admin/users" component={Users} />
                                <Route path="/admin/pos" component={Pos} />
                                <Route path="/admin/offline">{() => <Pos forceOffline />}</Route>
                                <Route path="/admin/pickup" component={Pickup} />
                                <Route path="/admin/transfers" component={Transfers} />
                                <Route path="/admin/inventory" component={Inventory} />
                                <Route path="/admin/keys" component={Keys} />
                                <Route path="/admin/logistics" component={Logistics} />
                                <Route path="/admin/marketing" component={Marketing} />
                                <Route path="/admin/audit" component={Audit} />
                                <Route path="/admin/health" component={Health} />
                                <Route>
                                    <Panel title="Bienvenido"><p>Elige un módulo del menú lateral.</p></Panel>
                                </Route>
                            </Switch>
                        </Suspense>
                    )}
                </main>
            </div>
        </Page>
    );
};

export default AdminRoot;
