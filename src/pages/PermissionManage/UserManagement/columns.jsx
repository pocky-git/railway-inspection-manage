import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { ROLE_NAME_MAP, ROLE_ID } from "../../../constants/role";
import { getTenants } from "../../../service/tenantService";
import { getDepartments } from "../../../service/departmentService";
import AddUserModal from "./AddUserModal";

export const getColumns = ({ role_id, handleDeleteUser, reload }) => {
  return [
    {
      title: "用户名称",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "真实姓名",
      dataIndex: "real_name",
      key: "real_name",
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
      title: "所属租户",
      dataIndex: "tenant_name",
      key: "tenant_id",
      render: (tenant_name) => tenant_name || "-",
      valueType: "select",
      search: role_id === ROLE_ID.SUPER_ADMIN,
      request: async () => {
        if (role_id !== ROLE_ID.SUPER_ADMIN) {
          return [];
        }
        return getTenants({
          page: 1,
          pageSize: 999,
        }).then(
          (res) =>
            res.data?.list?.map?.((item) => ({
              label: item.name,
              value: item._id,
            })) || []
        );
      },
    },
    {
      title: "所属部门",
      dataIndex: "department_name",
      key: "department_id",
      render: (department_name) => department_name || "-",
      valueType: "select",
      search: role_id <= ROLE_ID.TENANT_ADMIN,
      request: async () => {
        if (role_id > ROLE_ID.TENANT_ADMIN) {
          return [];
        }
        return getDepartments({
          page: 1,
          pageSize: 999,
        }).then(
          (res) =>
            res.data?.list?.map?.((item) => ({
              label: item.name,
              value: item._id,
            })) || []
        );
      },
    },
    {
      title: "角色",
      dataIndex: "role_id",
      key: "role_id",
      valueType: "select",
      valueEnum: {
        [ROLE_ID.SUPER_ADMIN]: {
          text: ROLE_NAME_MAP[ROLE_ID.SUPER_ADMIN],
        },
        [ROLE_ID.TENANT_ADMIN]: {
          text: ROLE_NAME_MAP[ROLE_ID.TENANT_ADMIN],
        },
        [ROLE_ID.DEPARTMENT_ADMIN]: {
          text: ROLE_NAME_MAP[ROLE_ID.DEPARTMENT_ADMIN],
        },
        [ROLE_ID.REGULAR_USER]: {
          text: ROLE_NAME_MAP[ROLE_ID.REGULAR_USER],
        },
      },
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
