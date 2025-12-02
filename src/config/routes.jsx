import { lazy } from "react";
import {
  DatabaseOutlined,
  EditOutlined,
  OpenAIOutlined,
  BugOutlined,
} from "@ant-design/icons";

const ProjectManage = lazy(() => import("../pages/ProjectManage"));
const DiseaseMark = lazy(() => import("../pages/DiseaseMark"));
const ModelTraining = lazy(() => import("../pages/ModelTraining"));
const DefectAnalysis = lazy(() => import("../pages/DefectAnalysis"));

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
];
