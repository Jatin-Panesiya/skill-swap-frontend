import Button from "../../components/Button/Button";
import InputField from "../../components/InputField/InputField";
import { Link, useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { loginSchema } from "./LoginSchema";
import { useState } from "react";
import { loginUser } from "../../api/api";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { FaExchangeAlt } from "react-icons/fa";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      await loginUser(formData);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response.data.message || error.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ backgroundColor: '#F9FAFB' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" style={{ backgroundColor: '#6366F1' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" style={{ backgroundColor: '#14B8A6' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" style={{ backgroundColor: '#6366F1' }}></div>
      </div>

      {/* Logo/Brand */}
      <div className="absolute top-6 left-6 cursor-pointer z-10 group">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#6366F1' }}>
            <FaExchangeAlt className="text-white text-xl" />
          </div>
          <span className="text-2xl font-bold" style={{ color: '#6366F1' }}>
            Skill Swap
          </span>
        </div>
      </div>

      <div className="w-full max-w-md z-10 relative">
        <div className="p-8 rounded-2xl transform transition-all duration-300 card" style={{ backgroundColor: '#FFFFFF', boxShadow: 'rgba(0, 0, 0, 0.04) 0 3px 6px' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-h1 font-bold mb-2" style={{ color: '#6366F1' }}>
              Welcome Back
            </h1>
            <p className="text-sm" style={{ color: '#475569' }}>
              Sign in to continue to your account
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" style={{ color: '#94A3B8' }}>
                  <HiOutlineMail className="text-xl" />
                </div>
                <div className="pl-11">
                  <InputField
                    name="email"
                    control={control}
                    placeholder="Email address"
                    type="text"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" style={{ color: '#94A3B8' }}>
                  <HiOutlineLockClosed className="text-xl" />
                </div>
                <div className="pl-11">
                  <InputField
                    name="password"
                    control={control}
                    placeholder="Password"
                    type="password"
                  />
                </div>
              </div>

              <Button
                variant="primary"
                loading={loading}
                fullWidth
                type="submit"
                size="md"
              >
                Sign In
              </Button>
            </form>

            <div className="flex items-center justify-center gap-2 pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
              <span className="text-sm" style={{ color: '#475569' }}>Don't have an account?</span>
              <Link 
                to="/register" 
                className="text-sm font-semibold transition-all duration-300"
                style={{ color: '#6366F1' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
