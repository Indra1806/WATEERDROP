import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCardSkeleton from '../components/skeletons/ProductCardSkeleton';

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


export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addedId, setAddedId] = useState(null); // To track which product was just added
  const { addToCart } = useCart();

  // We memoize fetchProducts to prevent re-creation on re-renders, but it's optional here.
  const fetchProducts = async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getProducts({ page: pageNum, limit: 6 }); // Fetch 6 for better grid layout
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedId(product._id);
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedId(null);
    }, 2000);
  };
  
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want to refetch when the page state changes.
  useEffect(() => {
    fetchProducts(page);
  }, [page]);
  
  const renderProductGrid = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => <ProductCardSkeleton key={index} />)}
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

    if (!products || products.length === 0) {
      return (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700">No Products Found</h3>
          <p className="text-gray-500 mt-2">Please try adjusting your filters or check back later.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((p) => {
          const isAdded = addedId === p._id;
          const isOutOfStock = p.stock === 0;
          return (
            <div key={p._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {/* Placeholder for a product image */}
                
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800">{p.name} — {p.sizeLiters}L</h3>
                <p className="text-sm text-gray-500 mt-1">Available: {p.stock} units</p>
                <div className="mt-4 flex-grow">
                  <p className="text-2xl font-extrabold text-gray-900">₹{p.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => handleAddToCart(p)}
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
        })}
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Products</h2>
        
        {renderProductGrid()}

        {/* --- Pagination --- */}
        {!loading && !error && products.length > 0 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page <= 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}