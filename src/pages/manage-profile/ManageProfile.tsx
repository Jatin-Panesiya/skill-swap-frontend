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
import { Link, useNavigate } from "react-router";
import { skills } from "../../utils/constants";

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
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-3 mb-5">
        <div className="font-bold text-2xl ">Edit Profile</div>
        <Link
          to={`/user-profile/${user?._id}`}
          className="text-primary text-sm"
        >
          View Public Profile
        </Link>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
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
          label="Skills you can teach"
          placeholder="Pick value"
          data={skills}
        />

        <MultiSelectField
          name="learnSkills"
          control={control}
          label="Skills you want to learn"
          placeholder="Pick value"
          data={skills}
        />
      </div>

      <div className="flex gap-5 justify-end mt-5">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          Back To Home
        </Button>
        <Button loading={isLoading} disabled={loading} type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ManageProfile;
