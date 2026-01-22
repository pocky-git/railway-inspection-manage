import { Button } from "antd";

export const getColumns = ({ handleDeleteModelTraining }) => {
  return [
    {
      title: "模型名称",
      dataIndex: "modelName",
      key: "modelName",
    },
    {
      title: "模型类型",
      dataIndex: "modelType",
      key: "modelType",
      valueType: "select",
    },
    {
      title: "项目",
      dataIndex: "projectName",
      key: "projectName",
      valueType: "select",
      fieldProps: {
        showSearch: true,
      },
      request: async () => {
        return [];
      },
    },
    {
      title: "学习率",
      dataIndex: "learningRate",
      key: "learningRate",
      search: false,
    },
    {
      title: "批次大小",
      dataIndex: "batchSize",
      key: "batchSize",
      search: false,
    },
    {
      title: "迭代次数",
      dataIndex: "epochs",
      key: "epochs",
      search: false,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      search: false,
    },
    {
      title: "操作",
      key: "action",
      valueType: "option",
      render: (_, record) => [
        <Button
          type="link"
          danger
          onClick={() => handleDeleteModelTraining(record._id)}
        >
          删除
        </Button>,
      ],
    },
  ];
};
