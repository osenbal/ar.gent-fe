export default interface IJob {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  location: string;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface IJobDetails {
  _id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  location: string;
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

export interface ICreateJob {
  title: string;
  description: string;
  location: string;
  salary: number;
  type: EJobType | string;
  level: EJobLevel | string;
  workPlace: EJobWorkPlace | string;
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
