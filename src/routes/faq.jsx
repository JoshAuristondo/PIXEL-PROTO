import { useMemo, useState } from "react";
import { Link } from "wouter";
import "../styles/shop.scss";
import "../styles/info.scss";
import { Page, Panel } from "../components/ui/Ui";
import { FAQ } from "../store/policies";

const Faq = () => {
    const [q, setQ] = useState('');

    const groups = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return FAQ;
        return FAQ
            .map((g) => ({ ...g, items: g.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(term)) }))
            .filter((g) => g.items.length);
    }, [q]);

    return (
        <Page header="Ayuda" title="PREGUNTAS FRECUENTES" body="Respuestas rápidas sobre compras, juegos digitales, envíos, garantía y tu cuenta.">
            <input className="px-input" type="search" placeholder="Buscar en las preguntas…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar en preguntas frecuentes" />

            {groups.length === 0 && (
                <Panel><p>No encontramos resultados para “{q}”. <Link className="faq__link" href="/contact">Escríbenos</Link> y te ayudamos.</p></Panel>
            )}

            {groups.map((g) => (
                <Panel key={g.group} title={g.group}>
                    <div className="faq">
                        {g.items.map((i) => (
                            <details key={i.q} className="faq__item">
                                <summary className="faq__q">{i.q}</summary>
                                <p className="faq__a">{i.a}</p>
                            </details>
                        ))}
                    </div>
                </Panel>
            ))}

            <Panel>
                <p>¿No encontraste lo que buscabas? <Link className="faq__link" href="/contact">Contáctanos</Link> o revisa nuestras <Link className="faq__link" href="/policy">políticas</Link>.</p>
            </Panel>
        </Page>
    );
};

export default Faq;
