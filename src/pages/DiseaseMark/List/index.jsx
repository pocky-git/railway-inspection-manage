import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, Modal } from "antd";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { getColumns } from "./columns";
import AddTenantModal from "./AddMarkModal";

const DiseaseMarkList = observer(() => {
  const actionRef = useRef();
  const navigate = useNavigate();

  const getMarks = async () => {
    return [
      {
        id: 1,
        name: "裂缝数据集",
        projectName: "测试项目1",
        createAt: "2026-01-01",
        markCount: 150,
        diseaseType: 1,
      },
      {
        id: 2,
        name: "落石数据集",
        projectName: "测试项目2",
        createAt: "2026-01-01",
        markCount: 100,
        diseaseType: 2,
      },
    ];
  };

  // 删除标注数据集
  const handleDeleteMark = async (id) => {
    Modal.confirm({
      title: "确认删除该数据集吗？",
      okText: "确认",
      okType: "danger",
      onOk: async () => {
        handleReload();
      },
    });
  };

  // 开始标注
  const handleStartMark = (id) => {
    navigate(`/disease-mark/mark/${id}`);
  };

  const handleReload = () => {
    actionRef.current?.reload?.();
  };

  const columns = getColumns({
    handleDeleteMark,
    handleStartMark,
    reload: handleReload,
  });

  return (
    <PageContainer
      header={{
        title: "病害标注",
        ghost: true,
        breadcrumb: {
          items: [
            {
              title: "病害标注",
            },
            {
              title: "数据集",
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
          return getMarks({
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
                添加数据集
              </Button>
            }
            onFinish={handleReload}
          />,
        ]}
      />
    </PageContainer>
  );
});

export default DiseaseMarkList;
