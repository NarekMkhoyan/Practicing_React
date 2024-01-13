import { Navigate, Route, Routes } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage";
import NotFoundPage from "./pages/Not Found/NotFound";
import classes from "./App.module.scss";
import { Layout } from "antd";
import AppHeader from "./components/Header/AppHeader";
import Notification from "./components/Notification/Notification";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store/app-store";
import HomePage from "./pages/Home/HomePage";
import { useEffect } from "react";
import { LocalStorageItemsEnum } from "./constants/localStorage-items.enum";
import { useDispatch } from "react-redux";
import {
  getCurrentUserFromDb,
  setUser,
} from "./store/reducers/user/user-reducer";
import { IUser } from "./interfaces/user.interface";
import { setUserLoggedIn } from "./store/reducers/auth/auth-reducer";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  // TODO: use asyncLoader on paths (case | open a profile link )
  // TODO: apply autosignOut on session timeout
  // TODO: Limit navigation to profile/information if signed in but no data is filled in

  useEffect(() => {
    const currentUserSession = localStorage.getItem(
      LocalStorageItemsEnum.USER_TIMEOUT
    );
    const currentUserId =
      localStorage.getItem(LocalStorageItemsEnum.USER_ID) || "";

    if (currentUserSession && Number(currentUserSession) > 0) {
      console.log("here");
      dispatch(
        getCurrentUserFromDb({
          localId: currentUserId,
        })
      ).then(async (response) => {
        const currentUser: Partial<IUser> = response.payload as Partial<IUser>;

        dispatch(setUser(currentUser));
        dispatch(setUserLoggedIn(Number(currentUserSession)));
      });
    }
  }, [dispatch]);

  return (
    <div className={classes["app-body"]}>
      <Layout className={classes["app-layout"]}>
        <AppHeader></AppHeader>
        <Notification></Notification>
        <Routes>
          <Route
            path="/"
            element={
              !auth.isLoggedIn ? (
                <Navigate to="/auth/signin" replace />
              ) : (
                <HomePage />
              )
            }
          ></Route>
          <Route
            path="/auth/*"
            element={
              auth.isLoggedIn ? <Navigate to="/" replace /> : <AuthPage />
            }
          ></Route>
          <Route
            path="/profile/*"
            element={
              !auth.isLoggedIn ? (
                <Navigate to="/auth/signin" replace />
              ) : (
                <UserProfilePage />
              )
            }
          ></Route>
          <Route path="*" element={<NotFoundPage />}></Route>
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
