import { lazy } from "react";
import {
  DatabaseOutlined,
  EditOutlined,
  OpenAIOutlined,
  BugOutlined,
  SettingOutlined,
  BranchesOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";

const ProjectManage = lazy(() => import("../pages/ProjectManage"));
const DiseaseMark = lazy(() => import("../pages/DiseaseMark"));
const ModelTraining = lazy(() => import("../pages/ModelTraining"));
const DefectAnalysisOverview = lazy(
  () => import("../pages/DefectAnalysis/Overview"),
);
const DefectAnalysisDashboard = lazy(
  () => import("../pages/DefectAnalysis/Dashboard"),
);
const TenantManagement = lazy(
  () => import("../pages/PermissionManage/TenantManagement"),
);
const UserManagement = lazy(
  () => import("../pages/PermissionManage/UserManagement"),
);
const LineManagement = lazy(() => import("../pages/LineManagement"));

export const routes = [
  {
    key: "/data-manage",
    path: "/data-manage",
    component: <ProjectManage />,
    icon: <DatabaseOutlined />,
    name: "项目管理",
  },
  {
    key: "/disease-mark",
    path: "/disease-mark",
    component: <DiseaseMark />,
    icon: <EditOutlined />,
    name: "病害标注",
  },
  {
    key: "/model-training",
    path: "/model-training",
    component: <ModelTraining />,
    icon: <OpenAIOutlined />,
    name: "模型训练",
  },
  {
    key: "/defect-analysis/overview",
    path: "/defect-analysis/overview",
    component: <DefectAnalysisOverview />,
    icon: <BugOutlined />,
    name: "缺陷（病害）分析",
  },
  {
    key: "/defect-analysis/dashboard/:id",
    path: "/defect-analysis/dashboard/:id",
    component: <DefectAnalysisDashboard />,
    icon: <BugOutlined />,
    name: "缺陷（病害）分析仪表盘",
    hideInMenu: true,
  },
  {
    key: "/line-manage",
    path: "/line-manage",
    component: <LineManagement />,
    icon: <BranchesOutlined />,
    name: "线路管理",
  },
  {
    key: "/permission-manage",
    path: "/permission-manage",
    component: <Outlet />,
    icon: <SettingOutlined />,
    name: "权限管理",
    routes: [
      {
        key: "/permission-manage/tenant-manage",
        path: "/permission-manage/tenant-manage",
        component: <TenantManagement />,
        name: "租户管理",
      },
      {
        key: "/permission-manage/user-manage",
        path: "/permission-manage/user-manage",
        component: <UserManagement />,
        name: "用户管理",
      },
    ],
  },
];

// 根据用户角色过滤路由
export const getRoutes = () => {
  return routes;
};
