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
const DiseaseMarkList = lazy(() => import("../pages/DiseaseMark/List"));
const DiseaseMarkMark = lazy(() => import("../pages/DiseaseMark/Mark"));
const ModelTraining = lazy(() => import("../pages/ModelTraining"));
const DefectAnalysisList = lazy(() => import("../pages/DefectAnalysis/List"));
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
    key: "/disease-mark/list",
    path: "/disease-mark/list",
    component: <DiseaseMarkList />,
    icon: <EditOutlined />,
    name: "病害标注",
  },
  {
    key: "/disease-mark/mark/:id",
    path: "/disease-mark/mark/:id",
    component: <DiseaseMarkMark />,
    icon: <EditOutlined />,
    name: "病害标注标注页",
    hideInMenu: true,
  },
  {
    key: "/model-training",
    path: "/model-training",
    component: <ModelTraining />,
    icon: <OpenAIOutlined />,
    name: "模型训练",
  },
  {
    key: "/defect-analysis/list",
    path: "/defect-analysis/list",
    component: <DefectAnalysisList />,
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
  // {
  //   key: "/line-manage",
  //   path: "/line-manage",
  //   component: <LineManagement />,
  //   icon: <BranchesOutlined />,
  //   name: "线路管理",
  // },
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
        name: "路局管理",
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
