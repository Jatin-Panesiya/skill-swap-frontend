import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import ManageProfile from "./pages/manage-profile/ManageProfile";
import Users from "./pages/users/Users";
import Profile from "./pages/profile/Profile";
import AdminPanel from "./pages/admin/AdminPanel";
import Matches from "./pages/matches/Matches";
import Chat from "./pages/chat/Chat";
import Bookings from "./pages/bookings/Bookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ManageProfile />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user-profile/:id" element={<Profile />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/bookings" element={<Bookings />} />
          
          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
