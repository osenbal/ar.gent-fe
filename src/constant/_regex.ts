export const USERNAME_REGEX = /^\S*$/;
export const PHONE_NUMBER_REGEX =
  /^(\()?(\+62|62|0|\+\d{1,4})?[ .-]?(\d{1,4})?\)?[ .-]?\d{2,4}[ .-]?\d{2,4}[ .-]?\d{2,4}$/;
export const EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number:
