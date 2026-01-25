import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message, Modal } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import dayjs from "dayjs";
import AddModelModal from "./AddModelModal";
import { getColumns } from "./columns";

const ModelTraining = observer(() => {
  const actionRef = useRef();

  // 模拟获取模型训练列表
  const getModelTrainings = async (params) => {
    // 这里应该调用实际的API，现在返回模拟数据
    return {
      data: [
        {
          id: 1,
          modelName: "工务模型",
          modelType: "YOLO",
          createdAt: dayjs(),
          status: 1,
        },
        {
          id: 2,
          modelName: "电务模型",
          modelType: "YOLO",
          createdAt: dayjs(),
          status: 2,
        },
        {
          id: 3,
          modelName: "供电模型",
          modelType: "YOLO",
          createdAt: dayjs(),
          status: 3,
        },
        {
          id: 4,
          modelName: "供电模型",
          modelType: "YOLO",
          createdAt: dayjs(),
          status: 4,
        },
      ],
      page: params.page || 1,
      total: 1,
    };
  };

  // 删除模型训练
  const handleDeleteModelTraining = async (id) => {
    Modal.confirm({
      title: "确认删除该模型吗？",
      okText: "确认",
      okType: "danger",
      onOk: () => {
        // 这里应该调用实际的API，现在模拟删除
        message.success("模型已删除");
        actionRef.current?.reload?.();
      },
    });
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
              title: "模型训练",
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
          return getModelTrainings({
            page: current,
            ...rest,
          }).then((res) => ({
            data: res?.data || [],
            page: res?.page || 1,
            total: res?.total || 0,
          }));
        }}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <AddModelModal
            trigger={
              <Button type="primary" icon={<PlusOutlined />}>
                新建模型
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
