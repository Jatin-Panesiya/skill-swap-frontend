export type Gender = "male" | "female" | "other";
export type UserRole = "USER" | "ADMIN";

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

export type Skill = 
  | "React" 
  | "Angular" 
  | "Vue" 
  | "Svelte" 
  | "Next.js"
  | "TypeScript"
  | "JavaScript"
  | "HTML/CSS"
  | "Tailwind CSS"
  | "Node.js"
  | "Python"
  | "Java"
  | "PHP"
  | "Ruby"
  | "Go"
  | "C#"
  | "React Native"
  | "Flutter"
  | "Android"
  | "iOS"
  | "Swift"
  | "MongoDB"
  | "PostgreSQL"
  | "MySQL"
  | "Firebase"
  | "Docker"
  | "Kubernetes"
  | "AWS"
  | "Azure"
  | "Figma"
  | "Adobe XD"
  | "UI/UX Design"
  | "Git"
  | "Linux"
  | "Machine Learning"
  | "Data Science";
