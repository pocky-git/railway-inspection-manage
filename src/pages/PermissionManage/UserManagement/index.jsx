import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, Modal } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { getColumns } from "./columns";
import AddUserModal from "./AddUserModal";

const UserManagement = observer(() => {
  const actionRef = useRef();

  const getUsers = async () => {
    return [
      {
        id: "1",
        real_name: "张三",
        username: "user1",
        phone: "13800000000",
        email: "zhangsan@example.com",
        role_id: "admin",
        specialty: "workforce",
        tenant_name: "广州铁路局",
        line_labels: "K100-K200",
        createAt: "2026-01-01",
      },
      {
        id: "2",
        real_name: "李四",
        username: "user2",
        phone: "13800000000",
        email: "lisi@example.com",
        role_id: "regular_user",
        specialty: "workforce",
        tenant_name: "广州铁路局",
        line_labels: "K200-K300",
        createAt: "2026-01-02",
      },
    ];
  };

  // 删除用户
  const handleDeleteUser = async (id) => {
    Modal.confirm({
      title: "确定要删除这个用户吗？",
      okText: "确定",
      okType: "danger",
      onOk: async () => {},
    });
  };

  const handleReload = () => {
    actionRef.current?.reload?.();
  };

  const columns = getColumns({
    handleDeleteUser,
    reload: handleReload,
  });

  return (
    <PageContainer
      header={{
        title: "用户管理",
        ghost: true,
        breadcrumb: {
          items: [
            {
              path: "",
              title: "用户管理",
            },
            {
              path: "",
              title: "列表",
            },
          ],
        },
      }}
    >
      <ProTable
        options={false}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const { current, ...rest } = params;
          return getUsers({
            page: current,
            ...rest,
          }).then((res) => ({
            data: res,
            page: 1,
            total: 1,
          }));
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <AddUserModal
            onFinish={() => actionRef.current?.reload?.()}
            trigger={
              <Button key="button" icon={<PlusOutlined />} type="primary">
                添加用户
              </Button>
            }
          />,
        ]}
      />
    </PageContainer>
  );
});

export default UserManagement;
