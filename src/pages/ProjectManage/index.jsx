import { useMemo } from "react";
import {
  ProList,
  PageContainer,
  StatisticCard,
} from "@ant-design/pro-components";
import { Button, Tag, Space, Modal } from "antd";
import AddProjectModal from "./AddProjectModal";
import NiceModal from "@ebay/nice-modal-react";

const { Divider } = StatisticCard;

const ProjectManage = () => {
  const handleDelete = (id) => {
    Modal.confirm({
      title: "确认删除该项目吗？",
      okText: "确认",
      okType: "danger",
      onOk: () => {
        console.log(id);
      },
    });
  };

  const data = useMemo(
    () =>
      new Array(10).fill({}).map(() => ({
        title: "项目名称",
        subTitle: (
          <Space>
            <Tag color="#FF9900">工务</Tag>
            <Tag color="#5BD8A6">K100-K200</Tag>
          </Space>
        ),
        actions: [
          <a style={{ color: "#ff4d4f" }} onClick={handleDelete}>
            删除
          </a>,
          <AddProjectModal
            isEdit
            trigger={<a style={{ color: "#1677ff" }}>编辑</a>}
          />,
        ],
        avatar:
          "https://gw.alipayobjects.com/zos/antfincdn/UCSiy1j6jx/xingzhuang.svg",
        content: (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: "总数量",
                value: 100,
                status: "processing",
              }}
            />
            <Divider />
            <StatisticCard
              statistic={{
                title: "标签数",
                value: 100,
                status: "default",
              }}
            />
            <StatisticCard
              statistic={{
                title: "已标注",
                value: 100,
                status: "success",
              }}
            />
            <StatisticCard
              statistic={{
                title: "未标注",
                value: 100,
                status: "error",
              }}
            />
          </StatisticCard.Group>
        ),
      })),
    [],
  );

  return (
    <NiceModal.Provider>
      <PageContainer
        header={{
          title: "项目管理",
          ghost: true,
          breadcrumb: {
            items: [
              {
                title: "项目管理",
              },
              {
                title: "列表",
              },
            ],
          },
        }}
        extra={[
          <AddProjectModal
            trigger={
              <Button key="0" type="primary">
                新增项目
              </Button>
            }
          />,
        ]}
      >
        <ProList
          ghost={true}
          pagination
          grid={{ gutter: 16, column: 2 }}
          onItem={(record) => {
            return {
              onClick: () => {
                console.log(record);
              },
            };
          }}
          search={{}}
          request={async (params = {}) => {
            console.log(params);
          }}
          metas={{
            title: {
              dataIndex: "title",
              title: "项目名称",
            },
            subTitle: {
              search: false,
            },
            content: {
              search: false,
            },
            actions: {
              cardActionProps: "extra",
            },
            specialty: {
              title: "专业",
              valueEnum: {
                1: "工务",
                2: "电务",
                3: "供电",
              },
            },
            line: {
              title: "线路",
              valueType: "select",
              fieldProps: {
                showSearch: true,
                mode: "multiple",
              },
              request: async () => {
                return [
                  {
                    label: "K100-K200",
                    value: "K100-K200",
                  },
                  {
                    label: "K200-K300",
                    value: "K200-K300",
                  },
                ];
              },
            },
          }}
          dataSource={data}
        />
      </PageContainer>
    </NiceModal.Provider>
  );
};

export default ProjectManage;
