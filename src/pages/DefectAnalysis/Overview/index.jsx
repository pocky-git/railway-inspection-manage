import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message, Modal } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { getColumns } from "./columns";
import AddAnalysisModal from "./AddAnalysisModal";

const TenantManagement = observer(() => {
  const actionRef = useRef();
  const navigate = useNavigate();

  // 删除分析
  const handleDeleteAnalysis = async (id) => {
    Modal.confirm({
      title: "确认删除吗？",
      okText: "确认",
      okType: "danger",
      onOk: async () => {
        // await deleteTenant(id);
        message.success("删除成功");
        actionRef.current?.reload?.();
      },
    });
  };

  const handleGoDashboard = (id) => {
    navigate(`/defect-analysis/dashboard/${id}`);
  };

  const columns = getColumns({
    handleDeleteAnalysis,
    handleGoDashboard,
  });

  return (
    <PageContainer
      header={{
        title: "缺陷（病害）分析",
        ghost: true,
        breadcrumb: {
          items: [
            {
              title: "缺陷（病害）分析",
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
          // const { current, ...rest } = params;
          // return getTenants({
          //   page: current,
          //   ...rest,
          // }).then((res) => ({
          //   data: res?.data?.list || [],
          //   page: res?.data?.page || 1,
          //   total: res?.data?.total || 0,
          // }));
          return Promise.resolve({
            data: [
              {
                name: "K100-K200",
                modelName: "工务模型",
                timeRange: [dayjs().add(-7, "d"), dayjs()],
                id: "1",
              },
            ],
            page: 1,
            total: 1,
          });
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <AddAnalysisModal
            trigger={<Button type="primary">启动分析</Button>}
            onFinish={() => actionRef.current?.reload?.()}
          />,
        ]}
      />
    </PageContainer>
  );
});

export default TenantManagement;
