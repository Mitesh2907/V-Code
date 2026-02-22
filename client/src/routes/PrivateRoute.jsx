import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // token check
  const token = localStorage.getItem("token");

  if (!token) {
    // agar login nahi hai → auth page pe bhejo
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
