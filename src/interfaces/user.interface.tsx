import { E164Number } from 'libphonenumber-js';
import { ICity, IState, ICountry } from 'country-state-city';

export interface IAddress_User {
  street: string;
  country: ICountry;
  state: IState;
  city: ICity;
  zipCode: string;
}

export interface IEducation_User {
  school: string;
  degree: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  currentEducation: boolean;
}

export interface IExperience_User {
  company: string;
  position: string;
  isPresent: boolean;
  startDate: Date;
  endDate: Date | null;
  description: string;
  location: string;
}

export interface IRegister_User {
  avatar: File;
  username: string;
  fullName: string;
  phoneNumber: E164Number;
  gender: string;
  birthday: string;
  email: string;
  password: string;
}

export interface ILogin_User {
  email: string;
  password: string;
}

export interface IEdited_User {
  fullName: string;
  gender: EGender;
  phoneNumber: string;
  birthday: Date;
  street: string;
  city: ICity | null;
  state: IState | null;
  country: ICountry | null;
  zipCode: string;
}

export default interface IUser {
  _id: string;
  avatar: string;
  banner: string;
  username: string;
  about: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  cv: string;
  portfolioUrl: string[];
  skill: string[];
  verified: boolean;
  status: boolean;
  address: IAddress_User;
  experience: IExperience_User[];
  education: IEducation_User[];
  birthday: Date;
  gender: EGender;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export enum EGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
