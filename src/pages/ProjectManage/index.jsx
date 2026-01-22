import {
  ProList,
  PageContainer,
  StatisticCard,
} from "@ant-design/pro-components";
import { Button } from "antd";
import AddProjectModal from "./AddProjectModal";
import NiceModal from "@ebay/nice-modal-react";

const { Divider } = StatisticCard;

const data = new Array(10).fill({}).map(() => ({
  title: "项目名称",
  actions: [<a key="delete">删除</a>],
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
}));

const ProjectManage = () => {
  const handleAddProject = () => {
    NiceModal.show(AddProjectModal);
  };

  return (
    <NiceModal.Provider>
      <PageContainer
        header={{
          title: "项目管理",
          ghost: true,
          breadcrumb: {
            items: [
              {
                path: "",
                title: "项目管理",
              },
              {
                path: "",
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
            content: {
              search: false,
            },
            actions: {
              cardActionProps: "extra",
            },
          }}
          dataSource={data}
        />
      </PageContainer>
    </NiceModal.Provider>
  );
};

export default ProjectManage;
