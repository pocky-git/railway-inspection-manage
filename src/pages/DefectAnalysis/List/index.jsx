import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message, Modal } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import dayjs from "dayjs";
import { getColumns } from "./columns";
import AddAnalysisModal from "./AddAnalysisModal";

const DefectAnalysisOverview = observer(() => {
  const actionRef = useRef();
  const navigate = useNavigate();

  const getMockData = async () => [
    {
      name: "测试项目1",
      modelName: "病害识别模型1",
      timeRange: [dayjs().add(-7, "d"), dayjs()],
      createdAt: dayjs(),
      id: 1,
      status: 1,
    },
    {
      name: "测试项目2",
      modelName: "病害识别模型1",
      timeRange: [dayjs().add(-7, "d"), dayjs()],
      createdAt: dayjs(),
      id: 2,
      status: 2,
    },
    {
      name: "测试项目3",
      modelName: "病害识别模型1",
      timeRange: [dayjs().add(-7, "d"), dayjs()],
      createdAt: dayjs(),
      id: 3,
      status: 3,
    },
  ];

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
          const { current, ...rest } = params;
          return getMockData({
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
          <AddAnalysisModal
            trigger={<Button type="primary">启动分析</Button>}
            onFinish={() => actionRef.current?.reload?.()}
          />,
        ]}
      />
    </PageContainer>
  );
});

export default DefectAnalysisOverview;
