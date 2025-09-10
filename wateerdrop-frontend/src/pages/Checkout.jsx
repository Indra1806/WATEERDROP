import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

// A simple spinner SVG component for the loading state
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate total price using useMemo to avoid recalculating on every render
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const products = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity
      }));
      await createOrder({ products });
      clearCart();
      // Redirect to orders page on success
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Empty Cart View ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="mt-2 text-gray-600">You have no items in your cart to check out.</p>
        <Link
          to="/"
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // --- Main Checkout View ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Checkout Summary</h2>
        
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* --- Left side: Cart Items --- */}
          <section className="lg:col-span-7">
            <ul className="border-t border-b border-gray-200 divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item._id} className="flex py-6">
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                    {/* Image placeholder */}
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">[Image]</div>
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name} — {item.sizeLiters}L</h3>
                        <p className="ml-4">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Price: ₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* --- Right side: Order Summary --- */}
          <section className="lg:col-span-5 mt-10 lg:mt-0 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Order summary</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>₹{totalPrice.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at next step.</p>
            </div>
            {error && (
              <div className="mt-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                <span className="font-medium">Error:</span> {error}
              </div>
            )}
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading && <Spinner />}
                {loading ? 'Placing Order...' : `Place Order (₹${totalPrice.toFixed(2)})`}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}