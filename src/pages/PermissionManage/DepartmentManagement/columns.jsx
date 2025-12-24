import { DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm } from "antd";
import { ROLE_ID } from "../../../constants/role";
import { getTenants } from "../../../service/tenantService";

export const getColumns = ({ handleDeleteDepartment, role_id }) => {
  return [
    {
      title: "部门名称",
      dataIndex: "name",
      key: "name",
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
            title="确定要删除这个部门吗？"
            onConfirm={() => {
              handleDeleteDepartment(record._id);
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
