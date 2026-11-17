import { useState } from "react";
import { Link } from "wouter";
import "../styles/shop.scss";
import { Page, Panel, Badge, Alert, Stars, Field } from "../components/ui/Ui";
import Cover from "../components/ui/Cover";
import ProductCard from "../components/product_card/product_card";
import { useStore } from "../store/StoreContext";
import { BRANCHES, FORMATS } from "../store/mockData";
import { getProduct, hasPurchased, isDigital, productRating, stockLevel, totalStock, usableKeys } from "../store/selectors";
import { clp, fmtDate } from "../store/utils";

const BAD_WORDS = ['estafa', 'basura', 'idiota', 'mierda'];

const Product = ({ params }) => {
    const { state, api, user, notify } = useStore();
    const product = getProduct(state, params.id);
    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [email, setEmail] = useState(user?.email || '');

    if (!product) {
        return (
            <Page header="Producto" title="NO ENCONTRADO">
                <Panel><p>El producto solicitado no existe o fue desactivado.</p><Link className="px-btn" href="/">Volver al catálogo</Link></Panel>
            </Page>
        );
    }

    const level = stockLevel(state, product);
    const digital = isDigital(product);
    const rate = productRating(state, product.id);
    const reviews = state.reviews.filter((r) => r.productId === product.id);
    const out = level.key === 'out';
    const regionMismatch = user?.role === 'comprador' && digital && product.region !== 'Global' && user.region !== product.region;
    const canReview = user?.role === 'comprador' && hasPurchased(state, user.id, product.id);
    const alreadyReviewed = user && reviews.some((r) => r.userId === user.id);
    const related = state.products.filter((p) => p.id !== product.id && p.active && p.platforms.some((x) => product.platforms.includes(x)) && totalStock(state, p) > 0).slice(0, 4);
    const maxQty = digital ? Math.min(5, usableKeys(state, product.id).length) : Math.min(5, product.stock.web);

    const add = () => {
        api.addToCart(product.id, qty);
        notify(`${qty}× ${product.title} agregado al carrito`);
    };

    const submitReview = (e) => {
        e.preventDefault();
        if (BAD_WORDS.some((w) => text.toLowerCase().includes(w))) return notify('La reseña contiene lenguaje inapropiado y fue filtrada.', 'err');
        if (text.trim().length < 5) return notify('Escribe al menos 5 caracteres.', 'warn');
        api.addReview({ productId: product.id, userId: user.id, userName: `${user.name.split(' ')[0]} ${user.name.split(' ')[1]?.[0] || ''}.`, rating, text: text.trim() });
        setText('');
        notify('¡Gracias por tu reseña de Comprador Verificado!');
    };

    return (
        <Page header={product.platforms.join(' · ')} title={product.title.toUpperCase()} body={product.genre} wide>
            <div className="product">
                <div className="px-stack">
                    <div className="product__cover"><Cover product={product} /></div>
                </div>

                <div className="px-stack">
                    <Panel>
                        <div className="px-row">
                            <Badge tone="contrast">{FORMATS[product.format]}</Badge>
                            <Badge tone={level.tone}>{level.label}</Badge>
                            <Badge>Región {product.region}</Badge>
                            <Badge>{product.age}</Badge>
                        </div>
                        <div className="px-row">
                            <Stars value={rate.avg} />
                            <span className="px-muted">{rate.count ? `${rate.avg.toFixed(1)} (${rate.count} reseñas)` : 'Sin reseñas aún'}</span>
                        </div>
                        <div className="product__price">{clp(product.price)}</div>
                        <p>{product.description}</p>

                        {regionMismatch && (
                            <Alert tone="err">⚠ Este código es para la región <strong>{product.region}</strong> y tu cuenta es <strong>{user.region}</strong>. Podría no activarse en tu consola.</Alert>
                        )}

                        {out ? (
                            <div className="px-stack">
                                <Alert tone="warn">Producto agotado en todas las sucursales y en la tienda web.</Alert>
                                <div className="px-row">
                                    <input className="px-input" style={{ maxWidth: 280 }} type="email" placeholder="tu@correo.cl" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Correo para aviso" />
                                    <button className="px-btn px-btn--primary" onClick={() => { if (!email.includes('@')) return notify('Ingresa un correo válido', 'warn'); api.addWaitlist(product.id, email); notify('Te avisaremos por correo cuando vuelva el stock'); }}>
                                        Avisarme cuando haya stock
                                    </button>
                                </div>
                                {state.waitlist.some((w) => w.productId === product.id) && <span className="px-muted">{state.waitlist.filter((w) => w.productId === product.id).length} persona(s) en lista de espera.</span>}
                            </div>
                        ) : (
                            <div className="px-row">
                                <div className="product__qty">
                                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos">−</button>
                                    <span>{Math.min(qty, Math.max(maxQty, 1))}</span>
                                    <button onClick={() => setQty((q) => Math.min(maxQty, q + 1))} aria-label="Más">+</button>
                                </div>
                                <button className="px-btn px-btn--primary px-btn--lg" onClick={add} disabled={maxQty < 1}>Agregar al carrito</button>
                                <Link className="px-btn px-btn--lg" href="/cart">Ver carrito</Link>
                            </div>
                        )}
                    </Panel>

                    <Panel title="Disponibilidad omnicanal" note="Existencias en tiempo real por sucursal física y bodega web (sincronizadas en < 5 s).">
                        {digital ? (
                            <div className="stock-matrix">
                                <div className={`stock-matrix__cell stock-matrix__cell--${level.tone}`}><strong>{usableKeys(state, product.id).length}</strong><span>Claves digitales disponibles</span></div>
                                <div className="stock-matrix__cell"><strong>⚡</strong><span>Entrega inmediata por correo y en tu bóveda</span></div>
                            </div>
                        ) : (
                            <div className="stock-matrix">
                                {BRANCHES.map((b) => {
                                    const n = product.stock[b.id];
                                    return (
                                        <div key={b.id} className={`stock-matrix__cell stock-matrix__cell--${n === 0 ? 'err' : n <= product.critical ? 'warn' : 'ok'}`}>
                                            <strong>{n}</strong><span>{b.short} · {b.name}</span>
                                        </div>
                                    );
                                })}
                                <div className={`stock-matrix__cell stock-matrix__cell--${product.stock.web === 0 ? 'err' : product.stock.web <= 5 ? 'warn' : 'ok'}`}>
                                    <strong>{product.stock.web}</strong><span>Bodega e-commerce</span>
                                </div>
                            </div>
                        )}
                    </Panel>

                    <Panel title="Ficha técnica">
                        <dl className="px-kv">
                            <dt>SKU</dt><dd className="px-mono">{product.sku}</dd>
                            <dt>Plataformas</dt><dd>{product.platforms.join(', ')}</dd>
                            <dt>Formato</dt><dd>{FORMATS[product.format]}</dd>
                            <dt>Género</dt><dd>{product.genre}</dd>
                            <dt>Clasificación</dt><dd>{product.age}</dd>
                            <dt>Voces</dt><dd>{product.voices}</dd>
                            <dt>Subtítulos</dt><dd>{product.subtitles}</dd>
                            <dt>Región</dt><dd>{product.region}</dd>
                            <dt>Tráiler</dt><dd><a className="px-link" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(product.title + ' trailer')}`} target="_blank" rel="noopener noreferrer">Ver tráiler en YouTube ↗</a></dd>
                        </dl>
                    </Panel>
                </div>
            </div>

            <Panel title={`Reseñas (${reviews.length})`}>
                {reviews.length === 0 && <p className="px-muted">Sé el primero en reseñar este juego tras comprarlo.</p>}
                {reviews.map((r) => (
                    <div key={r.id} className="review">
                        <div className="px-row"><Stars value={r.rating} /><strong>{r.userName}</strong>{r.verified && <Badge tone="ok">Comprador verificado</Badge>}<span className="px-muted">{fmtDate(r.ts)}</span></div>
                        <p>{r.text}</p>
                    </div>
                ))}
                {canReview && !alreadyReviewed && (
                    <form className="px-stack" onSubmit={submitReview}>
                        <span className="px-field__label">Tu reseña</span>
                        <div className="star-input" role="radiogroup" aria-label="Calificación">
                            {[1, 2, 3, 4, 5].map((n) => <button type="button" key={n} className={n <= rating ? 'on' : ''} onClick={() => setRating(n)} aria-label={`${n} estrellas`}>★</button>)}
                        </div>
                        <Field><textarea className="px-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Cuéntale a la comunidad gamer…" /></Field>
                        <div><button className="px-btn px-btn--primary">Publicar reseña</button></div>
                    </form>
                )}
                {!canReview && <p className="px-muted">Solo compradores con una orden confirmada de este juego pueden reseñarlo.</p>}
            </Panel>

            {related.length > 0 && (
                <Panel title="También te puede interesar">
                    <div className="catalog__grid">{related.map((p) => <ProductCard key={p.id} product={p} />)}</div>
                </Panel>
            )}
        </Page>
    );
};

export default Product;
