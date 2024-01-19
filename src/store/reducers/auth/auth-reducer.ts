import {
  ThunkDispatch,
  UnknownAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { IAuthSliceState } from "../../../interfaces/auth-slice-state.interface";
import { AxiosError } from "axios";
import {
  ISignInFailedResponse,
  ISignInResponse,
  ISignUpFailedResponse,
  ISignUpResponse,
} from "../../../interfaces/auth-response.interface";
import { setNotification } from "../notifications/notification-reducer";
import { FirebaseSignUpErrorsEnum } from "../../../constants/firebase-signup-errors.enum";
import {
  firebaseAuthSignInUrl,
  firebaseAuthSignUpUrl,
  firebaseDbUrl,
} from "../../../constants/api-urls.constat";
import { getCurrentUserFromDb, setUser } from "../user/user-reducer";
import { IUser } from "../../../interfaces/user.interface";
import { FirebaseSignInErrorsEnum } from "../../../constants/firebase-signin-errors.enum";
import { LocalStorageItemsEnum } from "../../../constants/localStorage-items.enum";
import http from "./../../../helpers/http";

const initialAuthState: IAuthSliceState = {
  isLoggedIn: false,
  loggedInDate: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUserLoggedIn: () => {
      const now = new Date().toISOString();
      localStorage.setItem(LocalStorageItemsEnum.USER_LOGIN_DATE, now);
      return {
        isLoggedIn: true,
        loggedInDate: now,
      };
    },
    signOutUser: () => {
      localStorage.removeItem(LocalStorageItemsEnum.USER_LOGIN_DATE);
      localStorage.removeItem(LocalStorageItemsEnum.USER_ID);
      localStorage.removeItem(LocalStorageItemsEnum.TOKEN);
      return {
        isLoggedIn: false,
        loggedInDate: null,
      };
    },
  },
});

export const signUp = createAsyncThunk<
  string | null,
  { email: string; password: string }
>("auth/signUp", async (userData, { dispatch }) => {
  const signUpNewUser: () => Promise<string | null> = async () => {
    return await http
      .post<ISignUpResponse>(firebaseAuthSignUpUrl, {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true,
      })
      .then((response) => {
        localStorage.setItem(
          LocalStorageItemsEnum.TOKEN,
          response.data.idToken
        );
        localStorage.setItem(
          LocalStorageItemsEnum.USER_ID,
          response.data.localId
        );
        dispatch(setUserLoggedIn());
        saveNewUserInDb(userData.email, response.data, dispatch);
        return response.data.localId;
      })
      .catch((error: AxiosError<{ error: ISignUpFailedResponse }>) => {
        const errorType =
          error.response?.data.error.errors[0].message.split(" ")[0] ||
          "DEFAULT";
        dispatch(
          setNotification({
            title: "Error",
            message: (FirebaseSignUpErrorsEnum as any)[errorType],
            status: "error",
          })
        );
        return null;
      });
  };
  return signUpNewUser();
});

export const signIn = createAsyncThunk<
  Partial<IUser> | null,
  { email: string; password: string }
>("auth/signin", (userData, { dispatch }) => {
  const signInUser = async () => {
    return await http
      .post<ISignInResponse>(firebaseAuthSignInUrl, {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true,
      })
      .then(async (response) => {
        localStorage.setItem(
          LocalStorageItemsEnum.TOKEN,
          response.data.idToken
        );

        const action = await dispatch(getCurrentUserFromDb(response.data));
        const currentUser: Partial<IUser> = action.payload as Partial<IUser>;

        dispatch(setUser(currentUser));
        dispatch(setUserLoggedIn());

        return currentUser;
      })
      .catch((error: AxiosError<{ error: ISignInFailedResponse }>) => {
        const errorType =
          error.response?.data.error.errors[0].message.split(" ")[0] ||
          "DEFAULT";

        dispatch(
          setNotification({
            title: "Error",
            message: (FirebaseSignInErrorsEnum as any)[errorType],
            status: "error",
          })
        );
        return null;
      });
  };
  return signInUser();
});

const saveNewUserInDb = (
  email: string,
  response: ISignUpResponse,
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>
) => {
  const newUser: Partial<IUser> = {
    email,
    hasCompletedInitialSettings: false,
    id: response.localId,
  };

  http
    .post(`${firebaseDbUrl}users.json`, newUser)
    .then(() => {
      dispatch(setUser(newUser));
    })
    .catch(() => {
      dispatch(
        setNotification({
          title: "Error",
          message: "Database error",
          status: "error",
        })
      );
    });
};

export const { setUserLoggedIn, signOutUser } = authSlice.actions;

export default authSlice.reducer;
