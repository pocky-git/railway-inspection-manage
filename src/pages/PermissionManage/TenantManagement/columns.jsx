import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";

export const getColumns = ({ handleDeleteTenant }) => {
  return [
    {
      title: "租户名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "租户账号",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      search: false,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      search: false,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      valueEnum: {
        true: {
          text: "启用",
          status: "Success",
        },
        false: {
          text: "禁用",
          status: "Error",
        },
      },
      search: false,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_, record) => (
        <>
          <Popconfirm
            title="确定要删除这个租户吗？"
            onConfirm={() => {
              handleDeleteTenant(record._id);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];
};
