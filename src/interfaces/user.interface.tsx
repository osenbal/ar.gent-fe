import { E164Number } from 'libphonenumber-js';

export enum EGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IAddress {
  street: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
}

export interface IEducation {
  school: string;
  degree: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  currentEducation: boolean;
}

export interface IExperience {
  company: string;
  position: string;
  isPresent: boolean;
  startDate: Date;
  endDate: Date | null;
  description: string;
  location: string;
}

/// user interface
export interface IUserType {
  _id: string;
  about: string;
  avatar: string;
  banner: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  gender: EGender;
  birthday: string;
  verified: boolean;
  role: string;
}

export default interface IUserRegister {
  avatar: File;
  username: string;
  fullName: string;
  phoneNumber: E164Number;
  gender: string;
  birthday: string;
  email: string;
  password: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserUpdate {
  fullName: string;
  gender: EGender;
  phoneNumber: string;
  birthday: Date;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IUser {
  _id: string;
  avatar: string;
  banner: string;
  username: string;
  about: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  address: IAddress;
  cv: string;
  portfolioUrl: string[];
  experience: IExperience[];
  education: IEducation[];
  skill: string[];
  birthday: Date;
  gender: EGender;
  role: ERole;
  verified: boolean;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}
