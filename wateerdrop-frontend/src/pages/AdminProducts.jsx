import { useEffect, useState } from 'react';
import axios from 'axios';
import TableSkeleton from '../components/skeletons/TableSkeleton';

// --- Helper Components & Icons ---
const Spinner = ({ className = 'h-5 w-5' }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const initialFormState = { name: '', price: '', stock: '', sizeLiters: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  
  // State management for UI feedback
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('http://localhost:8080/products?limit=100'); // Fetch all products
      setProducts(data.products);
    } catch (err) {
      setError('Failed to load products. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      if (editingId) {
        await axios.patch(`http://localhost:8080/products/${editingId}`, form, authHeader);
      } else {
        await axios.post('http://localhost:8080/products', form, authHeader);
      }
      handleResetForm();
      fetchProducts(); // Refresh data after submission
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setForm({ name: product.name, price: product.price, stock: product.stock, sizeLiters: product.sizeLiters });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form for better UX
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    setDeletingId(id);
    setError('');
    try {
      await axios.delete(`http://localhost:8080/products/${id}`, authHeader);
      fetchProducts(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product.');
    } finally {
      setDeletingId(null);
    }
  };
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want this to run once on mount.
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">Admin — Manage Products</h2>
        
        {/* --- Add/Edit Form --- */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          {error && <p className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <InputField label="Name" name="name" value={form.name} onChange={setForm} form={form} />
            <InputField label="Size (Liters)" name="sizeLiters" type="number" value={form.sizeLiters} onChange={setForm} form={form} />
            <InputField label="Price (₹)" name="price" type="number" value={form.price} onChange={setForm} form={form} />
            <InputField label="Stock" name="stock" type="number" value={form.stock} onChange={setForm} form={form} />
            
            <div className="flex space-x-2 md:col-span-2 lg:col-span-1">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                {isSubmitting ? <Spinner className="h-5 w-5 text-white" /> : (editingId ? 'Update' : 'Add')}
              </button>
              {editingId && (
                <button type="button" onClick={handleResetForm} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- Products Table --- */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? <TableSkeleton columns={5} /> : products.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.sizeLiters}L</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{p.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                      <button onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="text-red-600 hover:text-red-900 disabled:text-gray-400">
                        {deletingId === p._id ? <Spinner className="h-4 w-4 text-red-600"/> : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for form inputs to reduce repetition
const InputField = ({ label, name, type = 'text', value, onChange, form }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      placeholder={label}
      value={value}
      onChange={(e) => onChange({ ...form, [name]: e.target.value })}
      required
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
    />
  </div>
);