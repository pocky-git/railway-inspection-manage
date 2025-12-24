import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { getTenants, deleteTenant } from "../../../service/tenantService";
import { getColumns } from "./columns";
import AddTenantModal from "./AddTenantModal";

const TenantManagement = observer(() => {
  const actionRef = useRef();

  // 删除租户
  const handleDeleteTenant = async (id) => {
    try {
      const response = await deleteTenant(id);

      if (response.code === 200) {
        message.success("租户删除成功");
        actionRef.current?.reload?.();
      }
    } catch (error) {
      console.error("删除租户失败:", error);
    }
  };

  const handleReload = () => {
    actionRef.current?.reload?.();
  };

  const columns = getColumns({
    handleDeleteTenant,
    reload: handleReload,
  });

  return (
    <PageContainer
      header={{
        title: "租户管理",
        ghost: true,
        breadcrumb: {
          items: [
            {
              path: "",
              title: "租户管理",
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
          return getTenants({
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
          <AddTenantModal
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                添加租户
              </Button>
            }
            onFinish={() => actionRef.current?.reload?.()}
          />,
        ]}
      />
    </PageContainer>
  );
});

export default TenantManagement;
