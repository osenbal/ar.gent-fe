import { ICity, ICountry, IState } from 'country-state-city';

export default interface IJob {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  location: ILocation_Job;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface IReturnJobDetails {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  location: ILocation_Job;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  totalApplicants: number;
  avatarUser: string;
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
