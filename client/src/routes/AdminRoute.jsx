import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" />;

  if (user.role !== "admin") return <NotFoundPage />;

  return children;
};

export default AdminRoute;