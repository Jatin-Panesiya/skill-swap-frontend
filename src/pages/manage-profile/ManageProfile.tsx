import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { profileSchema } from "./ProfileSchema";
import InputField from "../../components/InputField/InputField";
import Button from "../../components/Button/Button";
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
  const { handleSubmit, control, reset, watch } = useForm({
    resolver: yupResolver(profileSchema),
  });

  const { loading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [teachSkills, setTeachSkills] = useState<string[]>(skills);
  const [learnSkills, setLearnSkills] = useState<string[]>(skills);

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

  useEffect(() => {
    const data = watch("teachSkills");
    const filteredData = skills.filter((skill) => !data?.includes(skill));
    setLearnSkills(filteredData);
  }, [watch("teachSkills")]);

  useEffect(() => {
    const data = watch("learnSkills");
    const filteredData = skills.filter((skill) => !data?.includes(skill));
    setTeachSkills(filteredData);
  }, [watch("learnSkills")]);

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-h1 font-bold" style={{ color: '#6366F1' }}>
            Edit Profile
          </h1>
          <Link
            to={`/user-profile/${user?._id}`}
            className="text-sm font-semibold transition-all duration-300"
            style={{ color: '#6366F1' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}
          >
            View Public Profile →
          </Link>
        </div>
        <p className="text-sm" style={{ color: '#475569' }}>Update your profile information and skills</p>
      </div>
      
      <div className="card mb-6">
        <div className="grid md:grid-cols-2 gap-6">
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
          data={teachSkills}
        />

        <MultiSelectField
          name="learnSkills"
          control={control}
          label="Skills you want to learn"
          placeholder="Pick value"
          data={learnSkills}
        />
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button 
          variant="secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back To Home
        </Button>
        <Button 
          variant="primary"
          loading={isLoading}
          disabled={loading}
          type="submit"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ManageProfile;
