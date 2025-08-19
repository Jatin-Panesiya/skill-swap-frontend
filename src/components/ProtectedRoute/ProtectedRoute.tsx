import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth/useAuth";
import Header from "../header/Header";

const ProtectedRoute = () => {
  const { loading, user } = useAuth();

  if (loading) return <div>Loading...</div>;

  return user ? (
    <div className="bg-slate-100 min-h-[calc(100vh-76px)]">
      <div className="container mx-auto">
        <Header />
        <div className="mt-[76px]">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
