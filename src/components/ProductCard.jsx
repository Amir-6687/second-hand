import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border p-4 rounded">
      <h3>{product.name}</h3>
      <p>{product.price} €</p>
      <button onClick={() => addToCart(product)}>Zum Warenkorb</button>
    </div>
  );
};

export default ProductCard;
