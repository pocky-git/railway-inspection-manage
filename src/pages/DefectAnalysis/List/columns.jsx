import { Space, Tooltip } from "antd";

export const getColumns = ({ handleDeleteAnalysis, handleGoDashboard }) => {
  return [
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      valueType: "select",
      fieldProps: {
        showSearch: true,
      },
      request: async () => {
        return [
          {
            label: "测试项目1",
            value: 1,
          },
          {
            label: "测试项目2",
            value: 2,
          },
          {
            label: "测试项目3",
            value: 3,
          },
        ];
      },
      width: 200,
    },
    {
      title: "模型名称",
      dataIndex: "modelName",
      key: "modelName",
      valueType: "select",
      fieldProps: {
        showSearch: true,
      },
      request: async () => {
        return [
          {
            label: "裂缝识别模型",
            value: 1,
          },
          {
            label: "剥落识别模型",
            value: 2,
          },
          {
            label: "变形识别模型",
            value: 3,
          },
        ];
      },
      width: 200,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueType: "select",
      valueEnum: {
        1: { text: "分析完成", status: "Success" },
        2: { text: "分析中", status: "Processing" },
        3: {
          text: <Tooltip title="失败原因：分析失败">分析失败</Tooltip>,
          status: "Error",
        },
      },
      width: 200,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      valueType: "date",
      width: 200,
      search: false,
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <a
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDeleteAnalysis(record.id)}
          >
            删除
          </a>
          {record.status === 3 ? (
            <a style={{ color: "#1677ff" }}>重新启动</a>
          ) : (
            <a
              style={{ color: "#1677ff" }}
              onClick={() => handleGoDashboard(record.id)}
            >
              仪表盘
            </a>
          )}
        </Space>
      ),
    },
  ];
};
