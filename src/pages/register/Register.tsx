import { Button } from "@mantine/core";
import { toast } from "react-toastify";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../../components/InputField/InputField";
import { registerSchema } from "./RegisterSchema";
import { useState } from "react";
import { registerUser } from "../../api/api";

export default function Register() {
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      setLoading(true);
      await registerUser(formData);
      toast.success("Registration successful");
      reset({
        email: "",
        confirmPassword: "",
        name: "",
        password: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
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
          <div className="font-semibold text-3xl text-center">Sign Up</div>
          <div className="text-center text-gray-700 my-2">
            Sign Up to continue
          </div>

          <div className="space-y-4">
            <form onSubmit={onSubmit} className="space-y-4">
              <InputField
                name="name"
                control={control}
                placeholder="Name"
                type="text"
              />

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

              <InputField
                name="confirmPassword"
                control={control}
                placeholder="Confirm Password"
                type="password"
              />

              <Button
                loading={loading}
                disabled={loading}
                fullWidth
                type="submit"
              >
                Sign Up
              </Button>
            </form>

            <div className="flex items-center justify-end gap-2">
              <div className="text-sm">Already have an account?</div>
              <Link to="/login" className="underline text-blue-600 text-sm">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
