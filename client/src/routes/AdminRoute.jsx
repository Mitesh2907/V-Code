import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {

  const adminToken = localStorage.getItem("admin-token");

  // 🔐 If no admin token → go to admin login
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminRoute;