export interface ISignUpResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

export interface ISignUpFailedResponse {
  code: number;
  errors: [
    { message: FirebaseSignUpErrorTypes; domain: string; reason: string }
  ];
  message: string;
}

export type FirebaseSignUpErrorTypes =
  | "EMAIL_EXISTS"
  | "WEAK_PASSWORD"
  | "INVALID_EMAIL"
  | "DEFAULT";

export interface ISignInResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

export interface ISignInFailedResponse {
  code: number;
  errors: [
    { message: FirebaseSignInErrorType; domain: string; reason: string }
  ];
  message: string;
}

export type FirebaseSignInErrorType = "INVALID_LOGIN_CREDENTIALS" | "DEFAULT";
