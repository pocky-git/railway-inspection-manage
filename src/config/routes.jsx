import { lazy } from "react";
import { DashboardOutlined, DatabaseOutlined } from "@ant-design/icons";

const DataManage = lazy(() => import("../pages/DataManage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

export const routes = [
  {
    path: "/data-manage",
    element: <DataManage />,
    icon: <DatabaseOutlined />,
    label: "数据管理",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    icon: <DashboardOutlined />,
    label: "数据概览",
  },
];
