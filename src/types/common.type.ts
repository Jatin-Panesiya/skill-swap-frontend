export type Gender = "male" | "female" | "other";
export type UserRole = "user" | "admin";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  name: string;
  gender: Gender;
  teachSkills: string[];
  learnSkills: string[];
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type Skill = "React" | "Angular" | "Svelte" | "Vue" | "Android";
