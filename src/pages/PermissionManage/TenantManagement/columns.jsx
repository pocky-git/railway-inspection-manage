import { Space, Popconfirm } from "antd";
import AddTenantModal from "./AddTenantModal";

export const getColumns = ({ handleDeleteTenant, reload }) => {
  return [
    {
      title: "租户名称",
      dataIndex: "name",
      key: "name",
      width: 600,
    },
    {
      title: "创建时间",
      dataIndex: "createAt",
      key: "createAt",
      search: false,
      width: 600,
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
            onClick={() => handleDeleteTenant(record._id)}
          >
            删除
          </a>
          <AddTenantModal
            onFinish={reload}
            isEdit
            initialValues={record}
            trigger={<a style={{ color: "#1677ff" }}>编辑</a>}
          />
        </Space>
      ),
    },
  ];
};
