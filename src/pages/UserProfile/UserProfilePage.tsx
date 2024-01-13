import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { lazy } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/app-store";

const Profile = lazy(
  () => import("../../components/UserProfile/Profile/Profile")
);
const ProfileInformation = lazy(
  () => import("../../components/UserProfile/Information/ProfileInformation")
);

const UserProfilePage = () => {
  const auth = useSelector((store: RootState) => store.auth);
  const user = useSelector((store: RootState) => store.user);
  const location = useLocation();

  return (
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
  );
};

export default UserProfilePage;
