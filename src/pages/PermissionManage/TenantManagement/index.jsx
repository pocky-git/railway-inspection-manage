import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, Modal } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { getColumns } from "./columns";
import AddTenantModal from "./AddTenantModal";

const TenantManagement = observer(() => {
  const actionRef = useRef();

  const getTenants = async () => {
    return [
      {
        id: 1,
        name: "租户1",
        createAt: "2026-01-01",
      },
    ];
  };

  // 删除租户
  const handleDeleteTenant = async (id) => {
    Modal.confirm({
      title: "确认删除该租户吗？",
      okText: "确认",
      okType: "danger",
      onOk: async () => {
        handleReload();
      },
    });
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
              title: "租户管理",
            },
            {
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
