import { useNavigate, useLocation } from "react-router-dom";
import { ProLayout } from "@ant-design/pro-components";
import { LogoutOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { getRoutes } from "../../config/routes";

const AdminLayout = ({ children }) => {
  const routes = getRoutes();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <ProLayout
        logo={false}
        title="铁路巡检系统"
        bgLayoutImgList={[
          {
            src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
            left: 85,
            bottom: 100,
            height: "303px",
          },
          {
            src: "https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png",
            bottom: -68,
            right: -45,
            height: "303px",
          },
          {
            src: "https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png",
            bottom: 0,
            left: 0,
            width: "331px",
          },
        ]}
        route={{
          path: "/",
          routes,
        }}
        location={location}
        appList={[]}
        avatarProps={{
          src: "https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",
          size: "small",
          title: "超级管理员",
          render: (props, dom) => {
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "logout",
                      icon: <LogoutOutlined />,
                      label: "退出登录",
                    },
                  ],
                }}
              >
                {dom}
              </Dropdown>
            );
          },
        }}
        menuItemRender={(item, dom) => (
          <div onClick={() => navigate(item.path)}>{dom}</div>
        )}
        // layout="mix"
        contentStyle={
          location.pathname === "/disease-mark"
            ? {
                padding: 0,
              }
            : null
        }
      >
        {children}
      </ProLayout>
    </div>
  );
};

export default AdminLayout;
