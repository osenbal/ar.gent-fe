export enum EGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export default interface IUser {
  avatar: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  gender: string;
  birthDate: Date;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  email: string;
  password: string;
}
