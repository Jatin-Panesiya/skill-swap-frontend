import * as yup from "yup";

export const basicInfoSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export const skillsSchema = yup.object().shape({
  teachSkills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one teaching skill is required")
    .required("Teaching skills are required"),
  learnSkills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one learning skill is required")
    .required("Learning skills are required"),
});

export const registerSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Name is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  teachSkills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one teaching skill is required")
    .required("Teaching skills are required"),
  learnSkills: yup
    .array()
    .of(yup.string())
    .min(1, "At least one learning skill is required")
    .required("Learning skills are required"),
});
