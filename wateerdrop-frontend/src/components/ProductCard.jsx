import { useState } from 'react';
import { useCart } from '../context/CartContext';

// --- Helper Icons ---
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.97 0l12.158-.002a1 1 0 00.97-1.222l-1.222-4.89A1 1 0 0017.53 7H4.78l-.397-1.588A1 1 0 003.42 4H2a1 1 0 000 2h.38l.792 3.166a1 1 0 00.97.834h10.298a1 1 0 00.97-.834l.792-3.166H18a1 1 0 000-2h-1.22l-.305-1.222a.997.997 0 00-.97 0l-12.158.002A1 1 0 002.47 3H3z" />
    <path d="M3 1a1 1 0 00-1 1v1h1V2H3zm14 0h-1v1h1V1zM3 16a1 1 0 100 2 1 1 0 000-2zm14 0a1 1 0 100 2 1 1 0 000-2z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform hover:scale-105">
      {/* Image Placeholder */}
      <div className="bg-gray-200 h-48 flex items-center justify-center">
        <span className="text-gray-500">

[Image of a water bottle]
</span>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800">{product.name} — {product.sizeLiters}L</h3>
        <p className="text-sm text-gray-500 mt-1">Available: {product.stock} units</p>
        
        <div className="mt-4 flex-grow">
          <p className="text-2xl font-extrabold text-gray-900">₹{product.price.toFixed(2)}</p>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdded}
          className={`w-full mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white transition-colors
            ${isAdded
              ? 'bg-green-500 cursor-default'
              : isOutOfStock
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {isAdded ? <CheckIcon /> : <ShoppingCartIcon />}
          {isAdded ? 'Added!' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}