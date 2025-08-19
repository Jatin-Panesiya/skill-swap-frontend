import { Button } from "@mantine/core";
import InputField from "../../components/InputField/InputField";
import { Link, useNavigate } from "react-router";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { loginSchema } from "./LoginSchema";
import { useState } from "react";
import { loginUser } from "../../api/api";

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
      toast.error(error.response.data.message || "Login failed");
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute top-5 left-5 cursor-pointer text-2xl font-bold">
        Skill Swap
      </div>
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-white/20 border border-gray-300 p-5 rounded shadow-lg">
          <div className="font-semibold text-3xl text-center">Sign In</div>
          <div className="text-center text-gray-700 my-2">
            Sign In to continue
          </div>

          <div className="space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
              <InputField
                name="email"
                control={control}
                placeholder="Email address"
                type="text"
              />

              <InputField
                name="password"
                control={control}
                placeholder="Password"
                type="password"
              />

              <Button
                disabled={loading}
                loading={loading}
                fullWidth
                type="submit"
              >
                Sign In
              </Button>
            </form>

            <div className="flex items-center justify-end gap-2">
              <div className="text-sm">don't have an account?</div>
              <Link to="/register" className="underline text-blue-600 text-sm">
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
