import * as yup from "yup";

export const profileSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Name is required"),
  gender: yup.string().required("Gender is required"),
  teachSkills: yup
    .array()
    .of(yup.string().required("Skill cannot be empty"))
    .min(1, "Select at least one skill")
    .required("Teach skills are required"),
  learnSkills: yup
    .array()
    .of(yup.string().required("Skill cannot be empty"))
    .min(1, "Select at least one skill")
    .required("Teach skills are required"),
});
