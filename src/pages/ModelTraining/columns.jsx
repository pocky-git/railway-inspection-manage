import { Space, Tooltip } from "antd";
import AddProjectModal from "./AddModelModal";
import TrainingModal from "./TrainingModal";

export const getColumns = ({ handleDeleteModelTraining, reload }) => {
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
      valueEnum: {
        1: {
          text: "YOLO",
        },
        2: {
          text: "SAM",
        },
        3: {
          text: "MMSeg",
        },
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueType: "select",
      valueEnum: {
        1: { text: "训练完成", status: "Success" },
        2: { text: "训练中", status: "Processing" },
        3: {
          text: <Tooltip title="失败原因：数据集格式错误">训练失败</Tooltip>,
          status: "Error",
        },
        4: { text: "训练未开始", status: "Default" },
      },
      width: 300,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "date",
      width: 300,
      search: false,
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
                {record.status === 4
                  ? "开始训练"
                  : record.status === 3
                    ? "重新开始"
                    : "查看参数"}
              </a>
            }
            onFinish={reload}
            initialValues={record}
            readonly={[1, 2].includes(record.status)}
          />
        </Space>
      ),
    },
  ];
};
