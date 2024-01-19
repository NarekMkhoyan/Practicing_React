import {
  HomeOutlined,
  ProfileOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/app-store";

const SideMenu = () => {
  const user = useSelector((state: RootState) => state.user);
  // TODO: highlight the current tab on route navigation with url (*case | login with new user, no highligh on profile/information)

  const menuItems: MenuProps["items"] = [
    {
      label: (
        <>
          {user.hasCompletedInitialSettings ? (
            <Link to="/">Home</Link>
          ) : (
            <>Home</>
          )}
        </>
      ),
      key: "/",
      icon: <HomeOutlined />,
      disabled: !user.hasCompletedInitialSettings,
    },
    {
      label: "Users",
      key: "users",
      icon: <UserOutlined />,
      disabled: !user.hasCompletedInitialSettings,
      children: [
        // TODO: add child routes
      ],
    },
    {
      label: "Profile",
      key: "profile",
      icon: <ProfileOutlined />,
      children: [
        {
          label: (
            <>
              {user.hasCompletedInitialSettings ? (
                <Link to={`/profile/${user.id}`}>Profile</Link>
              ) : (
                <>Profile</>
              )}
            </>
          ),
          key: `/profile`,
          icon: <ProfileOutlined />,
          disabled: !user.hasCompletedInitialSettings,
        },
        {
          label: <Link to={`/profile/${user.id}/information`}>Settings</Link>,
          key: `/profile/information`,
          icon: <SettingOutlined />,
        },
      ],
    },
  ];

  return (
    <Menu
      items={menuItems}
      theme="dark"
      mode="inline"
      defaultSelectedKeys={["/"]}
      style={{ flex: 1, minWidth: 0, width: 256, height: "100%" }}
    />
  );
};

export default SideMenu;
