import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { profileSchema } from "./ProfileSchema";
import InputField from "../../components/InputField/InputField";
import { Button } from "@mantine/core";
import useAuth from "../../hooks/useAuth/useAuth";
import { useEffect, useState } from "react";
import SelectField from "../../components/SelectField/SelectField";
import MultiSelectField from "../../components/MultiSelectField/MultiSelectField";
import { updateUser } from "../../api/api";
import { toast } from "react-toastify";
import { setLocalStorage } from "../../utils/common";
import { useNavigate } from "react-router";

const ManageProfile = () => {
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const { loading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !user) return;
    reset(user);
  }, [loading, user]);

  const onSubmit = handleSubmit(async (formData) => {
    if (!user?._id) return;
    try {
      setIsLoading(true);
      const response = await updateUser(user?._id, formData);
      setLocalStorage("user", response.data.user);
      toast.success("Update successful");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div>
      <form onSubmit={onSubmit} className="p-5 mx-auto max-w-[900px]">
        <div className="py-5 font-bold text-2xl">Edit Profile</div>
        <div className="space-y-4 h-[calc(100vh-230px)] overflow-auto">
          <InputField
            name="email"
            label="Email Address"
            control={control}
            disabled
            placeholder="Email address"
            type="text"
          />

          <InputField
            name="role"
            label="Role"
            control={control}
            disabled
            type="text"
          />

          <InputField
            name="name"
            label="Name"
            control={control}
            placeholder="Name"
            type="text"
          />

          <SelectField
            label="Gender"
            placeholder="Gender"
            control={control}
            name="gender"
            data={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
          />

          <MultiSelectField
            name="teachSkills"
            control={control}
            label="Skills You Know"
            placeholder="Pick value"
            data={["React", "Angular", "Vue", "Svelte"]}
          />

          <MultiSelectField
            name="learnSkills"
            control={control}
            label="Skills You Want To Learn"
            placeholder="Pick value"
            data={["React", "Angular", "Vue", "Svelte"]}
          />
        </div>

        <div className="flex gap-5 justify-end">
          <Button variant="light" onClick={() => navigate("/dashboard")}>
            Back To Home
          </Button>
          <Button loading={isLoading} disabled={loading} type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageProfile;
