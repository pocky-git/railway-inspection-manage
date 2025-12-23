import { lazy } from "react";
import {
  DatabaseOutlined,
  EditOutlined,
  OpenAIOutlined,
  BugOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ROLE_ID } from "../constants/role";
import { Outlet } from "react-router-dom";

const ProjectManage = lazy(() => import("../pages/ProjectManage"));
const DiseaseMark = lazy(() => import("../pages/DiseaseMark"));
const ModelTraining = lazy(() => import("../pages/ModelTraining"));
const DefectAnalysis = lazy(() => import("../pages/DefectAnalysis"));
const TenantManagement = lazy(() =>
  import("../pages/PermissionManage/TenantManagement")
);
const DepartmentManagement = lazy(() =>
  import("../pages/PermissionManage/DepartmentManagement")
);
const UserManagement = lazy(() =>
  import("../pages/PermissionManage/UserManagement")
);

export const routes = [
  {
    key: "/data-manage",
    path: "/data-manage",
    element: <ProjectManage />,
    icon: <DatabaseOutlined />,
    label: "项目管理",
  },
  {
    key: "/disease-mark",
    path: "/disease-mark",
    element: <DiseaseMark />,
    icon: <EditOutlined />,
    label: "病害标注",
  },
  {
    key: "/model-training",
    path: "/model-training",
    element: <ModelTraining />,
    icon: <OpenAIOutlined />,
    label: "模型训练",
  },
  {
    key: "/defect-analysis",
    path: "/defect-analysis",
    element: <DefectAnalysis />,
    icon: <BugOutlined />,
    label: "缺陷（病害）分析",
  },
  {
    key: "/permission-manage",
    path: "/permission-manage",
    element: <Outlet />,
    icon: <SettingOutlined />,
    label: "权限管理",
    // 需要角色ID 1, 2, 3才能访问（超级管理员、租户管理员、部门管理员）
    roles: [
      ROLE_ID.SUPER_ADMIN,
      ROLE_ID.TENANT_ADMIN,
      ROLE_ID.DEPARTMENT_ADMIN,
    ],
    children: [
      {
        key: "/permission-manage/tenant-manage",
        path: "/permission-manage/tenant-manage",
        element: <TenantManagement />,
        label: "租户管理",
        roles: [ROLE_ID.SUPER_ADMIN],
      },
      {
        key: "/permission-manage/department-manage",
        path: "/permission-manage/department-manage",
        element: <DepartmentManagement />,
        label: "部门管理",
        roles: [ROLE_ID.SUPER_ADMIN, ROLE_ID.TENANT_ADMIN],
      },
      {
        key: "/permission-manage/user-manage",
        path: "/permission-manage/user-manage",
        element: <UserManagement />,
        label: "用户管理",
        roles: [
          ROLE_ID.SUPER_ADMIN,
          ROLE_ID.TENANT_ADMIN,
          ROLE_ID.DEPARTMENT_ADMIN,
        ],
      },
    ],
  },
];

// 根据用户角色过滤路由
export const getRoutesByRole = (roleId) => {
  const transform = (routes) => {
    return routes
      .map((route) => {
        if (route.roles && !route.roles.includes(roleId)) return null;
        return {
          ...route,
          children: route.children?.length ? transform(route.children) : null,
        };
      })
      .filter(Boolean);
  };
  const routesByRole = transform(routes);
  return routesByRole;
};
