import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function ProtectedUserRoute({ children }) {
  const { isAuthenticated, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 to-golden-50">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 border-8 border-cream-300 border-t-rust-500 rounded-full animate-spin"></div>
            <span className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🧶</span>
          </div>
          <p className="text-xl text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/user-login" replace />;
  }

  return children;
}

export default ProtectedUserRoute;
