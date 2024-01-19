import { Header } from "antd/es/layout/layout";
import classes from "./AppHeader.module.scss";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store/app-store";
import { signOutUser } from "../../store/reducers/auth/auth-reducer";
import { useSelector } from "react-redux";

const AppHeader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const hadnleLogout = () => {
    dispatch(signOutUser());
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className={classes["dropdown-item"]} onClick={hadnleLogout}>
          <LogoutOutlined />
          Log out
        </div>
      ),
    },
  ];

  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <div className={classes.header}>
        <h1 className={classes.title}>TestBook</h1>
        {auth.isLoggedIn && (
          <Dropdown menu={{ items }}>
            <Space>
              <Avatar
                style={{ backgroundColor: "#0075e7" }}
                icon={<UserOutlined />}
              />
            </Space>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
