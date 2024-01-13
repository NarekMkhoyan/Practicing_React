import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUser, User } from "../../../interfaces/user.interface";
import axios from "axios";
import { firebaseDbUrl } from "../../../constants/api-urls.constat";
import { ISignInResponse } from "../../../interfaces/auth-response.interface";
import { LocalStorageItemsEnum } from "../../../constants/localStorage-items.enum";

const inititalUserState: IUser = {
  email: "",
  id: "",
  hasCompletedInitialSettings: false,
  firstName: "",
  lastName: "",
  age: -5000,
  avatar: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: inititalUserState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<IUser>>) => {
      localStorage.setItem(
        LocalStorageItemsEnum.USER_ID,
        action.payload.id || ""
      );
      const newUser = new User(action.payload);
      return { ...newUser };
    },
  },
});

export const getCurrentUserFromDb = createAsyncThunk<
  Partial<IUser>,
  Partial<ISignInResponse>
>("user/getUserFromDb", (signInResponse, { dispatch }) => {
  const getUsersFromDb = async () => {
    const allUsersResponse = await axios.get<{ [key: string]: IUser }>(
      `${firebaseDbUrl}/users.json`
    );
    const allUsers = allUsersResponse.data;

    let currentUser: Partial<IUser> = {
      id: signInResponse.localId,
    };

    for (const user in allUsers) {
      if (Object.prototype.hasOwnProperty.call(allUsers, user)) {
        if (allUsers[user].id === signInResponse.localId) {
          currentUser = allUsers[user];
          break;
        }
      }
    }

    return currentUser;
  };

  return getUsersFromDb();
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
