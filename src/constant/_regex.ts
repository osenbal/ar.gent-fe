export const USERNAME_REGEX = /^\S*$/;
export const PHONE_NUMBER_REGEX = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
export const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number:
