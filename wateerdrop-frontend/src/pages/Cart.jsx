import { useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

// --- Helper Icon ---
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Calculate total price
  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  // --- Empty Cart View ---
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h2 className="text-2xl font-bold text-gray-800">Your Shopping Cart is Empty</h2>
        <p className="mt-2 text-gray-600">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  // --- Main Cart View ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h2>
        
        <div className="mt-8 lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start">
          {/* --- Left side: Cart Items --- */}
          <section className="lg:col-span-8">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item._id} className="flex py-6">
                  <div className="flex-shrink-0 w-24 h-24 border border-gray-200 bg-white rounded-md overflow-hidden">
                    {/* Image placeholder */}
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">[Image]</div>
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <h3>{item.name} — {item.sizeLiters}L</h3>
                        <p className="ml-4 font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">Unit Price: ₹{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-gray-500">Qty {item.quantity}</p>
                      <div className="flex">
                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                        >
                          <TrashIcon /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* --- Right side: Order Summary & Actions --- */}
          <section className="lg:col-span-4 mt-10 lg:mt-0 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">Order summary</h3>
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-4">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Proceed to Checkout
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={handleClearCart}
                className="text-sm font-medium text-gray-600 hover:text-red-500"
              >
                Clear Cart
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}