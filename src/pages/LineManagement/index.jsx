import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, Modal } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { getColumns } from "./columns";
import AddLineModal from "./AddLineModal";

const LineManagement = observer(() => {
  const actionRef = useRef();

  const getLine = async () => {
    return [
      {
        id: 1,
        name: "K100-K200",
        createdAt: "2026-01-01",
      },
    ];
  };

  // 删除线路
  const handleDeleteLine = async (id) => {
    Modal.confirm({
      title: "确认删除该线路吗？",
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
    handleDeleteLine,
    reload: handleReload,
  });

  return (
    <PageContainer
      header={{
        title: "线路管理",
        ghost: true,
        breadcrumb: {
          items: [
            {
              title: "线路管理",
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
          return getLine({
            page: current,
            ...rest,
          }).then((res) => ({
            data: res,
            page: 1,
            total: 1,
          }));
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <AddLineModal
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                添加线路
              </Button>
            }
            onFinish={() => actionRef.current?.reload?.()}
          />,
        ]}
      />
    </PageContainer>
  );
});

export default LineManagement;
