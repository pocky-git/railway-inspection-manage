import { Space } from "antd";
import AddProjectModal from "./AddModelModal";
import TrainingModal from "./TrainingModal";

export const getColumns = ({ handleDeleteModelTraining }) => {
  return [
    {
      title: "模型名称",
      dataIndex: "modelName",
      key: "modelName",
      width: 300,
    },
    {
      title: "模型类型",
      dataIndex: "modelType",
      key: "modelType",
      valueType: "select",
      width: 300,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "date",
      width: 300,
    },
    {
      title: "操作",
      key: "action",
      width: 180,
      valueType: "option",
      render: (_, record) => (
        <Space>
          <a
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDeleteModelTraining(record.id)}
          >
            删除
          </a>
          <AddProjectModal
            isEdit
            initialValues={record}
            trigger={
              <a style={{ color: "#1677ff" }} type="link">
                编辑
              </a>
            }
          />
          <TrainingModal
            trigger={
              <a style={{ color: "#1677ff" }} type="link">
                开始训练
              </a>
            }
          />
        </Space>
      ),
    },
  ];
};
