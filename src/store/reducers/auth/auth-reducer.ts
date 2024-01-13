import {
  PayloadAction,
  ThunkDispatch,
  UnknownAction,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import { IAuthSliceState } from "../../../interfaces/auth-slice-state.interface";
import axios, { AxiosError } from "axios";
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

const initialAuthState: IAuthSliceState = {
  isLoggedIn: false,
  sessionTimeout: 0,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    setUserLoggedIn: (state, action: PayloadAction<number>) => {
      localStorage.setItem(
        LocalStorageItemsEnum.USER_TIMEOUT,
        String(action.payload)
      );
      return {
        isLoggedIn: true,
        sessionTimeout: action.payload,
      };
    },
    logoutUser: (state) => {
      localStorage.removeItem(LocalStorageItemsEnum.USER_TIMEOUT);
      localStorage.removeItem(LocalStorageItemsEnum.USER_ID);
      return {
        isLoggedIn: false,
        sessionTimeout: 0,
      };
    },
  },
});

export const signUp = createAsyncThunk<
  string | null,
  { email: string; password: string }
>("auth/signUp", async (userData, { dispatch }) => {
  const signUpNewUser: () => Promise<string | null> = async () => {
    return await axios
      .post<ISignUpResponse>(firebaseAuthSignUpUrl, {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true,
      })
      .then((response) => {
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
    return await axios
      .post<ISignInResponse>(firebaseAuthSignInUrl, {
        email: userData.email,
        password: userData.password,
        returnSecureToken: true,
      })
      .then(async (response) => {
        const action = await dispatch(getCurrentUserFromDb(response.data));
        const currentUser: Partial<IUser> = action.payload as Partial<IUser>;

        dispatch(setUser(currentUser));
        dispatch(setUserLoggedIn(+response.data.expiresIn));

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

  axios
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

export const { setUserLoggedIn } = authSlice.actions;

export default authSlice.reducer;
