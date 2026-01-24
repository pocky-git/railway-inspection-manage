import { Space } from "antd";

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
        // return getTenants({
        //   page: 1,
        //   pageSize: 999,
        // }).then(
        //   (res) =>
        //     res.data?.list?.map?.((item) => ({
        //       label: item.name,
        //       value: item._id,
        //     })) || [],
        // );
      },
      width: 300,
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
        // return getTenants({
        //   page: 1,
        //   pageSize: 999,
        // }).then(
        //   (res) =>
        //     res.data?.list?.map?.((item) => ({
        //       label: item.name,
        //       value: item._id,
        //     })) || [],
        // );
      },
      width: 300,
    },
    {
      title: "时间范围",
      dataIndex: "timeRange",
      key: "timeRange",
      valueType: "dateRange",
      width: 300,
    },
    {
      title: "操作",
      key: "option",
      valueType: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <a
            style={{ color: "#1677ff" }}
            onClick={() => handleGoDashboard(record.id)}
          >
            仪表盘
          </a>
          <a
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDeleteAnalysis(record.id)}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];
};
