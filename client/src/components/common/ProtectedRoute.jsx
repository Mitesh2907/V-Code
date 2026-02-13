import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // jab auth check ho raha ho
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // agar login nahi hai
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // agar login hai
  return children;
};

export default ProtectedRoute;
