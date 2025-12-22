import { lazy } from "react";
import {
  DatabaseOutlined,
  EditOutlined,
  OpenAIOutlined,
  BugOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ROLE_ID } from "../constants/role";

const ProjectManage = lazy(() => import("../pages/ProjectManage"));
const DiseaseMark = lazy(() => import("../pages/DiseaseMark"));
const ModelTraining = lazy(() => import("../pages/ModelTraining"));
const DefectAnalysis = lazy(() => import("../pages/DefectAnalysis"));
const PermissionManage = lazy(() => import("../pages/PermissionManage"));

export const routes = [
  {
    path: "/data-manage",
    element: <ProjectManage />,
    icon: <DatabaseOutlined />,
    label: "项目管理",
  },
  {
    path: "/disease-mark",
    element: <DiseaseMark />,
    icon: <EditOutlined />,
    label: "病害标注",
  },
  {
    path: "/model-training",
    element: <ModelTraining />,
    icon: <OpenAIOutlined />,
    label: "模型训练",
  },
  {
    path: "/defect-analysis",
    element: <DefectAnalysis />,
    icon: <BugOutlined />,
    label: "缺陷（病害）分析",
  },
  {
    path: "/permission-manage",
    element: <PermissionManage />,
    icon: <SettingOutlined />,
    label: "权限管理",
    // 需要角色ID 1, 2, 3才能访问（超级管理员、租户管理员、部门管理员）
    roles: [
      ROLE_ID.SUPER_ADMIN,
      ROLE_ID.TENANT_ADMIN,
      ROLE_ID.DEPARTMENT_ADMIN,
    ],
  },
];

// 根据用户角色过滤路由
export const getRoutesByRole = (roleId) => {
  return routes.filter((route) => {
    // 如果路由没有配置roles属性，则所有角色都可以访问
    if (!route.roles) return true;
    // 如果路由配置了roles属性，则只有匹配的角色才能访问
    return route.roles.includes(roleId);
  });
};
