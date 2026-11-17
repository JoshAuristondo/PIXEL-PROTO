import { Link } from "wouter";
import "../../styles/shop.scss";
import Cover from "../ui/Cover";
import { Badge } from "../ui/Ui";
import { useStore } from "../../store/StoreContext";
import { stockLevel } from "../../store/selectors";
import { FORMATS } from "../../store/mockData";
import { clp } from "../../store/utils";

const ProductCard = ({ product }) => {
    const { state, api, notify } = useStore();
    const level = stockLevel(state, product);
    const out = level.key === 'out';

    const add = () => {
        api.addToCart(product.id, 1);
        notify(`${product.title} agregado al carrito`);
    };

    return (
        <article className={`pcard ${out ? 'pcard--out' : ''}`}>
            <Link className="pcard__media" href={`/product/${product.id}`}>
                <Cover product={product} />
            </Link>
            <div className="pcard__body">
                <Link className="pcard__title" href={`/product/${product.id}`}>{product.title}</Link>
                <div className="pcard__meta">
                    <Badge tone="contrast">{FORMATS[product.format]}</Badge>
                    <Badge tone={level.tone}>{level.label}</Badge>
                </div>
                <div className="pcard__price">{clp(product.price)}</div>
                {out ? (
                    <Link className="px-btn px-btn--sm" href={`/product/${product.id}`}>Avisarme cuando haya stock</Link>
                ) : (
                    <button className="px-btn px-btn--sm px-btn--primary" onClick={add}>+ Agregar al carrito</button>
                )}
            </div>
        </article>
    );
};

export default ProductCard;
