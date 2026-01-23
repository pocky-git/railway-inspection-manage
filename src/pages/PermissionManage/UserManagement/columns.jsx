import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import AddUserModal from "./AddUserModal";

export const getColumns = ({ handleDeleteUser, reload }) => {
  return [
    {
      title: "真实姓名",
      dataIndex: "real_name",
      key: "real_name",
    },
    {
      title: "用户名称",
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
      title: "专业",
      dataIndex: "specialty",
      key: "specialty",
      valueType: "select",
      valueEnum: {
        workforce: {
          text: "工务",
        },
        electrical: {
          text: "电务",
        },
        power: {
          text: "供电",
        },
      },
    },
    {
      title: "角色",
      dataIndex: "role_id",
      key: "role_id",
      valueType: "select",
      valueEnum: {
        admin: {
          text: "管理员",
        },
        regular_user: {
          text: "普通用户",
        },
      },
    },
    {
      title: "所属租户",
      dataIndex: "tenant_name",
      key: "tenant_id",
      render: (tenant_name) => tenant_name || "-",
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
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_, record) => (
        <>
          <AddUserModal
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
            title="确定要删除这个用户吗？"
            onConfirm={() => {
              handleDeleteUser(record._id);
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
