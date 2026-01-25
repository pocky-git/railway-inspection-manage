import { Space } from "antd";
import AddLineModal from "./AddLineModal";

export const getColumns = ({ handleDeleteLine, reload }) => {
  return [
    {
      title: "线路名称",
      dataIndex: "name",
      key: "name",
      width: 600,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 600,
      search: false,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      width: 120,
      render: (_, record) => (
        <Space>
          <a
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDeleteLine(record._id)}
          >
            删除
          </a>
          <AddLineModal
            isEdit
            initialValues={record}
            trigger={<a style={{ color: "#1677ff" }}>编辑</a>}
            onFinish={reload}
          />
        </Space>
      ),
    },
  ];
};
