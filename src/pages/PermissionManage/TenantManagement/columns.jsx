import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import AddTenantModal from "./AddTenantModal";

export const getColumns = ({ handleDeleteTenant, reload }) => {
  return [
    {
      title: "租户名称",
      dataIndex: "name",
      key: "name",
      width: 500,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 400,
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
          <AddTenantModal
            onFinish={reload}
            id={record._id}
            initialValues={record}
            trigger={
              <Button variant="text" color="primary" icon={<FormOutlined />}>
                编辑
              </Button>
            }
          />
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
