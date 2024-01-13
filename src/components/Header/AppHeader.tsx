import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import classes from "./AppHeader.module.scss";

const AppHeader = () => {
  return (
    <Header style={{ display: "flex", alignItems: "center" }}>
      <h1 className={classes.title}>TestBook</h1>
      {/* <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items1}
        style={{ flex: 1, minWidth: 0 }}
      /> */}
    </Header>
  );
};

export default AppHeader;
