import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Loader from "../Loader/Loader";

const AdminRoute = () => {
  const { loading, user } = useAuth();

  if (loading) return <Loader />;

  const isAdmin = user?.role?.toLowerCase() === "admin" || user?.role === "ADMIN";

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default AdminRoute;

