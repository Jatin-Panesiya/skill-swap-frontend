import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputField from "../../components/InputField/InputField";
import MultiSelectField from "../../components/MultiSelectField/MultiSelectField";
import { basicInfoSchema, skillsSchema, registerSchema } from "./RegisterSchema";
import { useState, useEffect } from "react";
import { registerUser } from "../../api/api";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineCheckCircle } from "react-icons/hi";
import { FaExchangeAlt } from "react-icons/fa";
import { skills } from "../../utils/constants";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const { handleSubmit, control, watch, trigger, formState: { errors, touchedFields } } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched", // Only validate after user has interacted with fields
    reValidateMode: "onChange", // Re-validate on change after first touch
  });

  const [teachSkills, setTeachSkills] = useState<string[]>(skills);
  const [learnSkills, setLearnSkills] = useState<string[]>(skills);

  useEffect(() => {
    const selectedTeachSkills = watch("teachSkills");
    const filteredData = skills.filter((skill) => !selectedTeachSkills?.includes(skill));
    setLearnSkills(filteredData);
  }, [watch("teachSkills")]);

  useEffect(() => {
    const selectedLearnSkills = watch("learnSkills");
    const filteredData = skills.filter((skill) => !selectedLearnSkills?.includes(skill));
    setTeachSkills(filteredData);
  }, [watch("learnSkills")]);

  const handleNext = async () => {
    const isValid = await trigger(["name", "email", "password", "confirmPassword"], { shouldFocus: true });
    if (isValid) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  const onSubmit = handleSubmit(async (formData) => {
    const isSkillsValid = await trigger(["teachSkills", "learnSkills"], { shouldFocus: true });
    if (!isSkillsValid) {
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...registrationData } = formData;
      await registerUser(registrationData);
      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
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

      <div className="w-full max-w-lg z-10 relative">
        <div className="rounded-2xl transform transition-all duration-300 overflow-hidden flex flex-col max-h-[90vh] card" style={{ backgroundColor: '#FFFFFF', boxShadow: 'rgba(0, 0, 0, 0.04) 0 3px 6px' }}>
          {/* Header - Fixed */}
          <div className="text-center p-8 pb-6 flex-shrink-0" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <h1 className="text-h1 font-bold mb-2" style={{ color: '#6366F1' }}>
              Create Account
            </h1>
            <p className="text-sm" style={{ color: '#475569' }}>
              Sign up to get started with Skill Swap
            </p>
            
            {/* Progress Indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? '' : ''}`} style={{ color: currentStep >= 1 ? '#6366F1' : '#94A3B8' }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  currentStep >= 1 
                    ? 'text-white' 
                    : ''
                }`} style={{ backgroundColor: currentStep >= 1 ? '#6366F1' : '#E2E8F0', color: currentStep >= 1 ? '#FFFFFF' : '#94A3B8' }}>
                  {currentStep > 1 ? <HiOutlineCheckCircle className="text-lg" /> : '1'}
                </div>
                <span className="text-xs font-medium hidden sm:block">Basic Info</span>
              </div>
              <div className="w-12 h-0.5" style={{ backgroundColor: currentStep >= 2 ? '#6366F1' : '#E2E8F0' }}></div>
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? '' : ''}`} style={{ color: currentStep >= 2 ? '#6366F1' : '#94A3B8' }}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  currentStep >= 2 
                    ? 'text-white' 
                    : ''
                }`} style={{ backgroundColor: currentStep >= 2 ? '#6366F1' : '#E2E8F0', color: currentStep >= 2 ? '#FFFFFF' : '#94A3B8' }}>
                  2
                </div>
                <span className="text-xs font-medium hidden sm:block">Skills</span>
              </div>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto flex-1 px-8 py-6">
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="mb-4">
                    <h2 className="text-h3 font-semibold mb-1" style={{ color: '#0F172A' }}>Basic Information</h2>
                    <p className="text-sm" style={{ color: '#475569' }}>Enter your personal details to get started</p>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" style={{ color: '#94A3B8' }}>
                      <HiOutlineUser className="text-xl" />
                    </div>
                    <div className="pl-11">
                      <InputField
                        name="name"
                        control={control}
                        placeholder="Full Name"
                        type="text"
                      />
                    </div>
                  </div>

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

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none" style={{ color: '#94A3B8' }}>
                      <HiOutlineLockClosed className="text-xl" />
                    </div>
                    <div className="pl-11">
                      <InputField
                        name="confirmPassword"
                        control={control}
                        placeholder="Confirm Password"
                        type="password"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Skills */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="mb-4">
                    <h2 className="text-h3 font-semibold mb-1" style={{ color: '#0F172A' }}>Your Skills</h2>
                    <p className="text-sm" style={{ color: '#475569' }}>Select skills you can teach and want to learn</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2" style={{ color: '#0F172A' }}>
                      <HiOutlineAcademicCap className="text-lg" style={{ color: '#6366F1' }} />
                      <label className="text-sm font-semibold">
                        Skills you can teach <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                    </div>
                    <MultiSelectField
                      name="teachSkills"
                      control={control}
                      label=""
                      placeholder="Select at least one skill you can teach"
                      data={teachSkills}
                      withAsterisk={false}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2" style={{ color: '#0F172A' }}>
                      <HiOutlineBookOpen className="text-lg" style={{ color: '#14B8A6' }} />
                      <label className="text-sm font-semibold">
                        Skills you want to learn <span style={{ color: '#EF4444' }}>*</span>
                      </label>
                    </div>
                    <MultiSelectField
                      name="learnSkills"
                      control={control}
                      label=""
                      placeholder="Select at least one skill you want to learn"
                      data={learnSkills}
                      withAsterisk={false}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    fullWidth
                    size="md"
                  >
                    Back
                  </Button>
                )}
                {currentStep === 1 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                    fullWidth
                    size="md"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    loading={loading}
                    fullWidth
                    type="submit"
                    size="md"
                  >
                    Sign Up
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Footer - Fixed */}
          <div className="flex items-center justify-center gap-2 p-6 pt-4 flex-shrink-0" style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            <span className="text-sm" style={{ color: '#475569' }}>Already have an account?</span>
            <Link 
              to="/login" 
              className="text-sm font-semibold transition-all duration-300"
              style={{ color: '#6366F1' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4F46E5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#6366F1'}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
