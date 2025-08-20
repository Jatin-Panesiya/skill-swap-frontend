export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  gender: string;
  teachSkills: string[];
  learnSkills: string[];
}
