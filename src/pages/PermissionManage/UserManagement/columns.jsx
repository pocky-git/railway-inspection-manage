import { Space, Popconfirm } from "antd";
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
      title: "负责线路",
      dataIndex: "line_labels",
      key: "line_labels",
      valueType: "select",
      fieldProps: {
        showSearch: true,
        mode: "multiple",
      },
      request: async () => {
        return [
          {
            label: "K100-K200",
            value: "K100-K200",
          },
          {
            label: "K200-K300",
            value: "K200-K300",
          },
        ];
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
      title: "创建时间",
      dataIndex: "createAt",
      key: "createAt",
      search: false,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      render: (_, record) => (
        <Space>
          <a
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDeleteUser(record._id)}
          >
            删除
          </a>
          <AddUserModal
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
