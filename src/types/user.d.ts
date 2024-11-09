export type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
  client_id: number;
  password?: string;
  deleted?: boolean;
};
