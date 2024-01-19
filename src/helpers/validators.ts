export const passwordValidator: (value: string) => string = (value: string) => {
  return value.length >= 6
    ? ""
    : "Password must be at least 6 characters long.";
};

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const emailValidator: (value: string) => string = (value: string) => {
  return emailRegex.test(value) ? "" : "Invalid email address!";
};

export const nameValidator: (value: string) => string = (value: string) => {
  const nameRegexp = /^[A-Za-z]+$/;
  return nameRegexp.test(value) ? "" : "Invalid name";
};
