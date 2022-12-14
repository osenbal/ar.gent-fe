import { ICity, ICountry, IState } from 'country-state-city';

export default interface IJob {
  _id: string;
  userId: string;
  title: string;
  description: string;
  location: ILocation_Job;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface IReturn_Jobs {
  _id: string;
  title: string;
  location: ILocation_Job;
  salary: number;
  createdAt: Date;
  user: {
    _id: string;
    username: string;
    fullName: string;
  };
  offset: number;
  page: number;
  limit: number;
  totalRows: number;
  totalPage: number;
}

export interface IReturn_JobDetails {
  _id: string;
  userId: string;
  title: string;
  description: string;
  location: ILocation_Job;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  totalAppliciants: number;
  isClosed: boolean;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar: string;
  };
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface IReturn_GET_JobById {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  city: string;
  state: string;
  country: string;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  totalAppliciants: number;
  avatarUser: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface IReturn_GET_Jobs {
  _id: never;
  title: string;
  salary: number;
  description: string;
  isClosed: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  user: {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    phoneNumber: string;
  };
}

export interface INew_ObjectJob {
  title: string;
  description: string;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  country: ICountry;
  state: IState;
  city: ICity;
  salary: number;
}

export interface IState_NewJob {
  title: string;
  description: string;
  country: string;
  state: string;
  city: string;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
}

export interface ILocation_Job {
  country: ICountry;
  state: IState;
  city: ICity;
}

export enum EJobType {
  INTERNSHIP = 'internship',
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
}

export enum EJobLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
}

export enum EJobWorkPlace {
  REMOTE = 'remote',
  OFFICE = 'office',
  HYBRID = 'hybrid',
}
