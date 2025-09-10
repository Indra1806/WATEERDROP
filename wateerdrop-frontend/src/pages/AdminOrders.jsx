import { useCallback, useEffect, useState } from 'react';
import { updateOrderStatus } from '../services/api';
import axios from 'axios';
import AdminOrderCardSkeleton from '../components/skeletons/AdminOrderCardSkeleton';

// --- Helper Components & Icons ---
const Spinner = ({ className = 'h-5 w-5' }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Granular state management
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async (currentPage, filter) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:8080/orders/all', {
        params: { page: currentPage, limit: 5, status: filter || undefined },
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    setError('');
    try {
      await updateOrderStatus(id, newStatus);
      // Optimistic UI update: change status locally for instant feedback
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };
  
  // Reset page to 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);
  
  // Fetch orders when page or filter changes
  useEffect(() => {
    fetchOrders(page, statusFilter);
  }, [page, statusFilter, fetchOrders]);

  const renderContent = () => {
    if (loading) {
      return Array.from({ length: 3 }).map((_, index) => <AdminOrderCardSkeleton key={index} />);
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
          <p className="text-gray-500 mt-2">No orders match the current filter.</p>
        </div>
      );
    }

    return orders.map((order) => (
      <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
            <div>
              <p className="text-sm text-gray-600 font-medium">User: <span className="font-normal">{order.user?.email || 'N/A'}</span></p>
              <p className="text-sm text-gray-600">Order ID: <span className="font-mono text-xs">{order._id}</span></p>
            </div>
            <span className={`mt-2 sm:mt-0 text-sm font-medium capitalize px-3 py-1 rounded-full ${statusColors[order.status]}`}>
              {order.status}
            </span>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">Order Details</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {order.products.map((p, idx) => (
                <li key={idx}>
                  <span className="font-medium">{p.product?.name || '[Product Deleted]'}</span> — {p.quantity} × ₹{p.product?.price}
                </li>
              ))}
            </ul>
            <p className="font-bold text-gray-800 mt-2">Total: ₹{order.totalAmount.toFixed(2)}</p>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 flex items-center gap-4">
            <label htmlFor={`status-${order._id}`} className="text-sm font-medium text-gray-700">Update Status:</label>
            <div className="relative">
              <select
                id={`status-${order._id}`}
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                disabled={updatingId === order._id}
                className="pl-3 pr-8 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-gray-100"
              >
                {statusOptions.map(opt => <option key={opt} value={opt} className="capitalize">{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
              </select>
              {updatingId === order._id && <Spinner className="h-4 w-4 text-blue-600 absolute right-2 top-1/2 -translate-y-1/2" />}
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Admin — Manage Orders</h2>
        
        {/* --- Filters --- */}
        <div className="mb-6">
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">Filter by status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All</option>
            {statusOptions.map(opt => <option key={opt} value={opt} className="capitalize">{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>)}
          </select>
        </div>
        
        {renderContent()}

        {/* --- Pagination --- */}
        {!loading && !error && orders.length > 0 && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}