export default interface IAdmin {
  _id: string;
  avatar: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface IAdminRegister {}

export interface IAdminLogin {
  email: string;
  password: string;
}
