import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Layout, Menu, Button, Avatar, Dropdown, theme } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { userStore } from "../../store";
import { routes } from "../../config/routes";
import styles from "./styles.module.css";

const { Header, Sider, Content } = Layout;

const AdminLayout = observer(({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pageName = routes.find(
    (item) => item.path === location.pathname
  )?.label;
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 处理退出登录
  const handleLogout = () => {
    userStore.logout();
    navigate("/login");
  };

  // 用户菜单配置
  const userMenuItems = [
    {
      key: "logout",
      label: (
        <span onClick={handleLogout}>
          <LogoutOutlined /> 退出登录
        </span>
      ),
    },
  ];

  // 侧边栏菜单配置
  const menuItems = routes.map((item) => ({
    key: item.path,
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.path),
  }));

  return (
    <Layout className={styles["admin-layout"]}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={styles["logo"]}>
          {collapsed ? "系统" : "铁路巡检系统"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          className={styles["admin-header"]}
          style={{ background: colorBgContainer }}
        >
          <div className={styles["header-left"]}>
            <Button
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <div className={styles["page-name"]}>{pageName}</div>
          </div>
          <div className={styles["header-right"]}>
            <Dropdown menu={{ items: userMenuItems }}>
              <div className={styles["user-info"]}>
                <Avatar icon={<UserOutlined />} />
                <span className={styles["username"]}>
                  {userStore.userInfo?.name || "管理员"}
                </span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles["admin-content"]}>
          <div
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
            className={styles["content-wrapper"]}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
});

export default AdminLayout;
