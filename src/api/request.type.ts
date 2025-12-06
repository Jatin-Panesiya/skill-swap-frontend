export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role?: "USER" | "ADMIN";
  teachSkills: string[];
  learnSkills: string[];
}

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  gender: string;
  teachSkills: string[];
  learnSkills: string[];
  role?: "USER" | "ADMIN";
  color?:string
}

export interface IMatch {
  _id: string;
  requester: IUser;
  recipient: IUser;
  status: "pending" | "accepted" | "rejected" | "mutual";
  isMutual?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMessage {
  _id: string;
  sender: IUser;
  receiver: IUser;
  content: string;
  read: boolean;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBooking {
  _id: string;
  requester: IUser;
  provider: IUser;
  skill: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
