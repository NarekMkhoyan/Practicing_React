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
import {
  setUserLoggedIn,
  signOutUser,
} from "./store/reducers/auth/auth-reducer";
import SideMenu from "./components/Menu/SiedMenu";
import { SESSION_TIMEOUT } from "./constants/auth.contants";

let initialBoot = true;

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.user);

  // TODO: use asyncLoader on paths (*case | open a profile link )

  useEffect(() => {
    if (initialBoot) {
      const userLoggedInTime = localStorage.getItem(
        LocalStorageItemsEnum.USER_LOGIN_DATE
      );
      if (!userLoggedInTime) return;
      const activeSession =
        Date.now() - new Date(userLoggedInTime).getTime() >
        SESSION_TIMEOUT / 1000;
      const currentUserId =
        localStorage.getItem(LocalStorageItemsEnum.USER_ID) || "";

      if (activeSession) {
        dispatch(
          getCurrentUserFromDb({
            localId: currentUserId,
            idToken: localStorage.getItem("token")!,
          })
        ).then(async (response) => {
          const currentUser: Partial<IUser> =
            response.payload as Partial<IUser>;
          dispatch(setUser(currentUser));
          dispatch(setUserLoggedIn());
        });
      } else {
        dispatch(signOutUser());
      }
    }
    initialBoot = false;
  }, [dispatch]);

  return (
    <div className={classes["app-body"]}>
      <Layout className={classes["app-layout"]}>
        <AppHeader></AppHeader>
        <Notification></Notification>
        <div className={classes.container}>
          {auth.isLoggedIn && (
            <div className={classes.navigation}>
              <SideMenu></SideMenu>
            </div>
          )}
          <div className={classes.content}>
            <Routes>
              <Route
                path="/"
                element={
                  !auth.isLoggedIn ? (
                    <Navigate to="/auth/signin" replace />
                  ) : user.hasCompletedInitialSettings ? (
                    <HomePage />
                  ) : (
                    <Navigate to={`/profile/${user.id}/information`} replace />
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
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default App;
