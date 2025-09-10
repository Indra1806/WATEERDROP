import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import ParallaxSection from '../components/ParallaxSection';
import ErrorBoundary from '../components/ErrorBoundary';
import FeatureCardSkeleton from '../components/skeletons/FeatureCardSkeleton';

// Mock API call to simulate fetching data
const fetchFeatures = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: 'Fast Delivery', description: 'Slot-based delivery across major cities with live status updates.' },
        { title: 'Secure Checkout', description: 'Protected payments, saved cards, and instant order confirmations.' },
        { title: 'Smart Reorders', description: 'Reorder your usual bottles and sizes in just two taps.' },
      ]);
    }, 1500); // Simulate a 1.5-second network delay
  });
};

export default function Home() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchFeatures();
        setFeatures(data);
      } catch (err) {
        setError('Failed to load features. Please try refreshing the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <ErrorBoundary>
      <main className="bg-white">
        {/* Layered hero */}
        <ParallaxSection
          speed={0.4}
 height="90vh"
 image="path/to/your/image.jpg"
 overlay="linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))"
          className="flex flex-col items-center justify-center text-center text-white p-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md">Pure water, delivered</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-200 drop-shadow">2L · 5L · 10L · 20L · 30L — scheduled and seamless</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105" to="/">Shop products</Link>
            <Link className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors" to="/orders">My orders</Link>
          </div>
        </ParallaxSection>

        {/* Feature band */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {loading && (
                <>
                  <FeatureCardSkeleton />
                  <FeatureCardSkeleton />
                  <FeatureCardSkeleton />
                </>
              )}
              {error && <p className="text-red-500 md:col-span-3 text-center">{error}</p>}
              {!loading && !error && features.map((feature) => (
                <div key={feature.title} className="bg-white p-8 rounded-xl shadow-md text-center">
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product tease parallax */}
        <ParallaxSection
          speed={0.25}
          height="70vh"
          image="https://images.unsplash.com/photo-1512100356356-de1b84283e18?q=80&w=1600&fit=crop"
          overlay="rgba(0,0,0,0.25)"
          className="flex flex-col items-center justify-center text-center text-white p-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold drop-shadow-md">Choose your size</h2>
          <p className="mt-3 text-lg text-gray-200 drop-shadow">From 2L to 30L — always fresh, always ready.</p>
          <Link className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-transform hover:scale-105" to="/">Browse products</Link>
        </ParallaxSection>

        {/* Content section (non-parallax) */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why WATEERDROP</h2>
            <ul className="mt-8 space-y-4 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">✓</span>
                <span><strong>Quality:</strong> Trusted sources and rigorous checks.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">✓</span>
                <span><strong>Convenience:</strong> Book, track, and manage orders in one place.</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">✓</span>
                <span><strong>Value:</strong> Transparent pricing and periodic discounts.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Final CTA parallax */}
        <ParallaxSection
          speed={0.3}
          height="60vh"
          image="https://images.unsplash.com/photo-1521207418485-99c705420785?q=80&w=1600&fit=crop"
          overlay="linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.5))"
          className="flex flex-col items-center justify-center text-center text-white p-4"
        >
          <h2 className="text-3xl md:text-5xl font-bold drop-shadow-md">Ready to hydrate smarter?</h2>
          <Link className="mt-8 px-10 py-4 bg-teal-500 text-white font-bold text-lg rounded-lg shadow-xl hover:bg-teal-600 transition-transform hover:scale-105" to="/">Start shopping</Link>
        </ParallaxSection>
      </main>
    </ErrorBoundary>
  );
}