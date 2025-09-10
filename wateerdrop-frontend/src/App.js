import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminProducts from './pages/AdminProducts';
import Cart from './pages/Cart';
import RequireAdmin from './components/RequireAdmin';
import Checkout from './pages/Checkout';
import Home from './pages/Home';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Simple reload to clear state
  };

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', gap: '1rem' }}>
      <Link to="/">Products</Link>
      <Link to="/cart">Cart</Link>
      {token ? (
        <>
          <Link to="/orders">My Orders</Link>
          {role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
          <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
