import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/app-store";
import { Spin } from "antd";

const Profile = lazy(
  () => import("../../components/UserProfile/Profile/Profile")
);
const ProfileInformation = lazy(
  () => import("../../components/UserProfile/Information/ProfileInformation")
);

const UserProfilePage = () => {
  const auth = useSelector((store: RootState) => store.auth);
  const user = useSelector((store: RootState) => store.user);

  return (
    <Suspense
      fallback={
        <Spin tip="Loading">
          <div className="content" />
        </Spin>
      }
    >
      <Routes>
        <Route path="" element={<Navigate to={`./${user.id}`} />}></Route>
        {auth.isLoggedIn && user.hasCompletedInitialSettings && (
          <Route path=":userId" element={<Profile />}></Route>
        )}
        {auth.isLoggedIn && (
          <Route
            path=":userId/information"
            element={<ProfileInformation />}
          ></Route>
        )}
      </Routes>
    </Suspense>
  );
};

export default UserProfilePage;
