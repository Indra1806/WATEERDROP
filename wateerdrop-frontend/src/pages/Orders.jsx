import { useEffect, useState } from 'react';
import { getMyOrders, cancelOrder } from '../services/api';
import OrderCardSkeleton from '../components/skeletons/OrderCardSkeleton';

// Helper to determine badge color based on order status
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// A simple spinner for the cancel button
const ButtonSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null); // Tracks which order is being cancelled

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getMyOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    setCancellingId(id);
    try {
      await cancelOrder(id);
      // Refresh the list to show the updated status
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel the order. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        // Show 3 skeleton cards while loading
        Array.from({ length: 3 }).map((_, index) => <OrderCardSkeleton key={index} />)
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center text-red-700 bg-red-100 rounded-lg" role="alert">
          <p className="font-bold">An error occurred</p>
          <p>{error}</p>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">No Orders Found</h3>
          <p className="text-gray-500 mt-2">Looks like you haven't placed any orders yet.</p>
        </div>
      );
    }

    return orders.map((order) => (
      <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <div>
              <p className="text-sm text-gray-500">Order ID: {order._id}</p>
              <p className="text-lg font-bold text-gray-800">Total: ₹{order.totalAmount.toFixed(2)}</p>
            </div>
            <span className={`mt-2 sm:mt-0 text-sm font-medium mr-2 px-3 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}>
              {order.status}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Products</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {order.products.map((p, idx) => (
                <li key={idx}>
                  {p.product?.name} — <span className="text-sm">{p.quantity} × ₹{p.product?.price}</span>
                </li>
              ))}
            </ul>
          </div>

          {order.status === 'pending' && (
            <div className="border-t border-gray-200 mt-4 pt-4 text-right">
              <button
                onClick={() => handleCancel(order._id)}
                disabled={cancellingId === order._id}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed"
              >
                {cancellingId === order._id && <ButtonSpinner />}
                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">My Orders</h2>
        {renderContent()}
      </div>
    </div>
  );
}