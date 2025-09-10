import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import StatCardSkeleton from '../components/skeletons/StatCardSkeleton';

// --- Helper Icon Components ---
const iconProps = { className: "h-8 w-8 text-white" };
const Icons = {
  TotalOrders: () => <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  PendingOrders: () => <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  DeliveredOrders: () => <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  TotalProducts: () => <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  LowStock: () => <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  TotalUsers: () => <svg {...iconProps} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" /></svg>,
};


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axios.get('http://localhost:8080/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard stats. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => <StatCardSkeleton key={index} />)}
        </div>
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

    const statCards = [
      { title: 'Total Orders', value: stats.totalOrders, icon: <Icons.TotalOrders />, color: 'bg-blue-500' },
      { title: 'Pending Orders', value: stats.pendingOrders, icon: <Icons.PendingOrders />, color: 'bg-yellow-500' },
      { title: 'Delivered Orders', value: stats.deliveredOrders, icon: <Icons.DeliveredOrders />, color: 'bg-green-500' },
      { title: 'Total Products', value: stats.totalProducts, icon: <Icons.TotalProducts />, color: 'bg-purple-500' },
      { title: 'Low Stock Items', value: stats.lowStock, icon: <Icons.LowStock />, color: 'bg-red-500' },
      { title: 'Total Users', value: stats.totalUsers, icon: <Icons.TotalUsers />, color: 'bg-indigo-500' },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map(card => (
          <div key={card.title} className="bg-white rounded-lg shadow-md p-6 flex items-center">
            <div className={`p-4 rounded-full ${card.color} mr-4`}>{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <p className="text-3xl font-extrabold text-gray-900">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600 mb-8">Welcome back! Here's a summary of your store.</p>
        
        {renderContent()}

        <div className="mt-12">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/admin/orders" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center font-medium text-blue-600 hover:text-blue-800">
              Manage Orders
            </Link>
            <Link to="/admin/products" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center font-medium text-blue-600 hover:text-blue-800">
              Manage Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}