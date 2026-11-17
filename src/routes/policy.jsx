import { Link } from "wouter";
import Loader from '../components/loader/loader';
import Hero from "../components/hero/hero";
import { POLICIES, POLICY_ORDER, POLICY_UPDATED } from "../store/policies";
import "../styles/policy.scss";

const fallback = {
    h1: "Políticas",
    hero_title: "POLÍTICAS Y TÉRMINOS",
    hero_body: "Selecciona una política para ver la información.",
};

const Policy = ({ params }) => {

    const currentType = params?.type;
    const policy = POLICIES[currentType];
    const content = policy || fallback;

    return (
        <>
            <div className="policy">
                <div className="policy__container policy__container--hero">
                    <Hero header={content.h1} title={content.hero_title} body={content.hero_body} />
                </div>

                <div className="policy__layout">

                    <nav className="policy__nav" aria-label="Políticas">
                        {POLICY_ORDER.map((key) => (
                            <Link key={key} href={`/policy/${key}`} className={`policy__nav-link ${key === currentType ? "policy__nav-link--active" : ""}`}>
                                {POLICIES[key].short}
                            </Link>
                        ))}
                        <Link href="/faq" className="policy__nav-link">Preguntas frecuentes</Link>
                        <Link href="/contact" className="policy__nav-link">Contacto</Link>
                    </nav>

                    <div className="policy__content">
                        {policy ? (
                            <>
                                <p className="policy__updated">Última actualización: {POLICY_UPDATED} · Texto demostrativo del prototipo</p>
                                {policy.sections.map((s) => (
                                    <section key={s.h} className="policy__section">
                                        <h2 className="policy__section-title">{s.h}</h2>
                                        {s.p?.map((t) => <p key={t} className="policy__text">{t}</p>)}
                                        {s.ul && (
                                            <ul className="policy__list">
                                                {s.ul.map((t) => <li key={t}>{t}</li>)}
                                            </ul>
                                        )}
                                    </section>
                                ))}
                                <p className="policy__text policy__text--foot">
                                    ¿Dudas sobre esta política? <Link href="/contact" className="policy__inline-link">Escríbenos</Link> o revisa las <Link href="/faq" className="policy__inline-link">preguntas frecuentes</Link>.
                                </p>
                            </>
                        ) : (
                            <div className="policy__index">
                                {POLICY_ORDER.map((key) => (
                                    <Link key={key} href={`/policy/${key}`} className="policy__card">
                                        <strong>{POLICIES[key].hero_title}</strong>
                                        <span>{POLICIES[key].hero_body}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>

            <Loader />
        </>
    );
}

export default Policy;
