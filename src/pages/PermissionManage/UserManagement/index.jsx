import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { getUsers, deleteUser } from "../../../service/userService";
import { getColumns } from "./columns";
import userStore from "../../../store/userStore";
import AddUserModal from "./AddUserModal";

const UserManagement = observer(() => {
  const actionRef = useRef();

  // 删除用户
  const handleDeleteUser = async (id) => {
    try {
      const response = await deleteUser(id);

      if (response.code === 200) {
        message.success("用户删除成功");
        actionRef.current?.reload?.();
      }
    } catch (error) {
      console.error("删除用户失败:", error);
    }
  };

  const handleReload = () => {
    actionRef.current?.reload?.();
  };

  const columns = getColumns({
    role_id: userStore.userInfo?.role_id,
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
            data: res?.data?.list || [],
            page: res?.data?.page || 1,
            total: res?.data?.total || 0,
          }));
        }}
        rowKey="_id"
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
