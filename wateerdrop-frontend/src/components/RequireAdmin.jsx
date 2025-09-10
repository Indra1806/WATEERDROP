import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }) {
  const role = localStorage.getItem('role');
  return (
    role === 'admin' ? children : <Navigate to="/" />
  );
}