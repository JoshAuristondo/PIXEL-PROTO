import { useState } from "react";
import "../styles/shop.scss";
import { Page, Panel, Badge, Tabs } from "../components/ui/Ui";
import { useStore } from "../store/StoreContext";
import { fmtDateTime } from "../store/utils";

/* Bandeja de correo simulada: muestra lo que el servidor SMTP enviaría (boletas, claves, despachos, campañas). */
const Outbox = () => {
    const { state, user } = useStore();
    const [scope, setScope] = useState(user?.role === 'comprador' ? 'mine' : 'all');
    const list = state.emails.filter((m) => scope === 'all' || (user && m.to === user.email));

    return (
        <Page header="Correo simulado" title="BANDEJA SMTP" body="Todo lo que el sistema enviaría por correo electrónico queda registrado aquí." narrow>
            <Panel title={`Mensajes (${list.length})`}>
                <Tabs value={scope} onChange={setScope} tabs={[{ id: 'mine', label: 'Mis correos' }, { id: 'all', label: 'Todos (servidor)' }]} />
                {list.length === 0 && <p className="px-muted">Sin correos.</p>}
                {list.map((m) => (
                    <div key={m.id} className="outbox">
                        <div className="px-row px-row--between"><strong>{m.subject}</strong><Badge tone="contrast">{m.kind}</Badge></div>
                        <span className="px-muted">Para: {m.to} · {fmtDateTime(m.ts)}</span>
                        <pre>{m.body}</pre>
                    </div>
                ))}
            </Panel>
        </Page>
    );
};

export default Outbox;
