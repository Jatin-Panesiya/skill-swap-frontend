import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";

const AuthRoute = () => {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default AuthRoute;
