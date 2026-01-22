import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import AddModelTrainingModal from "./AddModelTrainingModal";
import { getColumns } from "./columns";

const ModelTraining = observer(() => {
  const actionRef = useRef();

  // 模拟获取模型训练列表
  const getModelTrainings = async (params) => {
    // 这里应该调用实际的API，现在返回模拟数据
    return {
      data: [],
      page: params.page || 1,
      total: 0,
    };
  };

  // 删除模型训练
  const handleDeleteModelTraining = async (id) => {
    // 这里应该调用实际的API，现在模拟删除
    message.success("模型训练已删除");
    actionRef.current?.reload?.();
  };

  // 获取模型训练列表列配置
  const columns = getColumns({ handleDeleteModelTraining });

  return (
    <PageContainer
      header={{
        title: "模型训练",
        ghost: true,
        breadcrumb: {
          items: [
            {
              path: "",
              title: "模型训练",
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
          return getModelTrainings({
            page: current,
            ...rest,
          }).then((res) => ({
            data: res?.data || [],
            page: res?.page || 1,
            total: res?.total || 0,
          }));
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <AddModelTrainingModal
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                训练模型
              </Button>
            }
            onFinish={() => actionRef.current?.reload?.()}
          />,
        ]}
      />
    </PageContainer>
  );
});

export default ModelTraining;
