export type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  password?: string;
  deleted?: boolean;
};
