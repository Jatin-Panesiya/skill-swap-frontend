import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Loader from "../Loader/Loader";

const AuthRoute = () => {
  const { loading, user } = useAuth();

  if (loading) return <Loader />;
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default AuthRoute;
