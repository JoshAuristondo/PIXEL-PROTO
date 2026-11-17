import { useMemo, useState } from "react";
import "../styles/shop.scss";
import { Page, Panel, Field } from "../components/ui/Ui";
import ProductCard from "../components/product_card/product_card";
import { useStore } from "../store/StoreContext";
import { FORMATS, PLATFORMS, REGIONS } from "../store/mockData";
import { totalStock } from "../store/selectors";

const EMPTY = { q: '', platforms: [], formats: [], genre: '', min: '', max: '', region: '', lang: '', showOut: false, sort: 'popular' };

const toggle = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

const Catalog = () => {
    const { state } = useStore();
    const [f, setF] = useState(EMPTY);
    const set = (patch) => setF((prev) => ({ ...prev, ...patch }));

    const genres = useMemo(() => [...new Set(state.products.map((p) => p.genre))].sort(), [state.products]);

    const results = useMemo(() => {
        const q = f.q.trim().toLowerCase();
        const list = state.products.filter((p) => {
            if (!p.active) return false;
            if (!f.showOut && totalStock(state, p) <= 0) return false;
            if (q && !`${p.title} ${p.genre} ${p.sku} ${p.platforms.join(' ')}`.toLowerCase().includes(q)) return false;
            if (f.platforms.length && !p.platforms.some((x) => f.platforms.includes(x))) return false;
            if (f.formats.length && !f.formats.includes(p.format)) return false;
            if (f.genre && p.genre !== f.genre) return false;
            if (f.min !== '' && p.price < Number(f.min)) return false;
            if (f.max !== '' && p.price > Number(f.max)) return false;
            if (f.region && p.region !== f.region && p.region !== 'Global') return false;
            if (f.lang && !p.subtitles.toLowerCase().includes(f.lang)) return false;
            return true;
        });
        const sorters = {
            popular: (a, b) => Number(b.popular) - Number(a.popular) || a.title.localeCompare(b.title),
            asc: (a, b) => a.price - b.price,
            desc: (a, b) => b.price - a.price,
            az: (a, b) => a.title.localeCompare(b.title),
        };
        return list.sort(sorters[f.sort]);
    }, [f, state]);

    const filtersActive = JSON.stringify(f) !== JSON.stringify(EMPTY);
    const suggestions = state.products.filter((p) => p.popular && p.active && totalStock(state, p) > 0).slice(0, 4);

    return (
        <Page header="Catálogo" title="JUEGOS Y CÓDIGOS" body="Físicos, digitales y accesorios con stock sincronizado en las 3 sucursales y la tienda web." wide>
            <div className="catalog">
                <Panel title="Filtros" className="catalog__filters" actions={filtersActive && <button className="px-btn px-btn--sm" onClick={() => setF(EMPTY)}>Limpiar</button>}>
                    <Field label="Buscar">
                        <input className="px-input" placeholder="Título, género, SKU…" value={f.q} onChange={(e) => set({ q: e.target.value })} aria-label="Buscar" />
                    </Field>

                    <div className="px-field">
                        <span className="px-field__label">Plataforma</span>
                        <div className="catalog__chips">
                            {PLATFORMS.map((p) => (
                                <button key={p} className={`px-btn px-btn--sm ${f.platforms.includes(p) ? 'px-btn--active' : ''}`} onClick={() => set({ platforms: toggle(f.platforms, p) })}>{p}</button>
                            ))}
                        </div>
                    </div>

                    <div className="px-field">
                        <span className="px-field__label">Formato</span>
                        <div className="catalog__chips">
                            {Object.entries(FORMATS).map(([k, v]) => (
                                <button key={k} className={`px-btn px-btn--sm ${f.formats.includes(k) ? 'px-btn--active' : ''}`} onClick={() => set({ formats: toggle(f.formats, k) })}>{v}</button>
                            ))}
                        </div>
                    </div>

                    <Field label="Género">
                        <select className="px-select" value={f.genre} onChange={(e) => set({ genre: e.target.value })}>
                            <option value="">Todos</option>
                            {genres.map((g) => <option key={g}>{g}</option>)}
                        </select>
                    </Field>

                    <div className="px-field">
                        <span className="px-field__label">Rango de precio (CLP)</span>
                        <div className="catalog__range">
                            <input className="px-input" type="number" min="0" placeholder="Mín" value={f.min} onChange={(e) => set({ min: e.target.value })} aria-label="Precio mínimo" />
                            <input className="px-input" type="number" min="0" placeholder="Máx" value={f.max} onChange={(e) => set({ max: e.target.value })} aria-label="Precio máximo" />
                        </div>
                    </div>

                    <Field label="Región de activación">
                        <select className="px-select" value={f.region} onChange={(e) => set({ region: e.target.value })}>
                            <option value="">Todas</option>
                            {REGIONS.filter((r) => r !== 'Global').map((r) => <option key={r}>{r}</option>)}
                        </select>
                    </Field>

                    <Field label="Idioma de subtítulos">
                        <select className="px-select" value={f.lang} onChange={(e) => set({ lang: e.target.value })}>
                            <option value="">Cualquiera</option>
                            <option value="español">Español</option>
                            <option value="inglés">Inglés</option>
                        </select>
                    </Field>

                    <label className="px-check">
                        <input type="checkbox" checked={f.showOut} onChange={(e) => set({ showOut: e.target.checked })} />
                        Mostrar agotados
                    </label>
                </Panel>

                <div className="px-stack">
                    <div className="catalog__toolbar">
                        <strong className="px-mono" aria-live="polite">{results.length} resultado{results.length === 1 ? '' : 's'}</strong>
                        <select className="px-select" style={{ width: 'auto' }} value={f.sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Ordenar">
                            <option value="popular">Más populares</option>
                            <option value="asc">Precio: menor a mayor</option>
                            <option value="desc">Precio: mayor a menor</option>
                            <option value="az">Nombre A–Z</option>
                        </select>
                    </div>

                    {results.length ? (
                        <div className="catalog__grid">
                            {results.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <Panel title="Sin resultados">
                            <p>Ningún producto coincide con los filtros aplicados. Prueba con estos títulos populares:</p>
                            <div className="catalog__grid">
                                {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                            <div><button className="px-btn" onClick={() => setF(EMPTY)}>Limpiar todos los filtros</button></div>
                        </Panel>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default Catalog;
