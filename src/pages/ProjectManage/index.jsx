import { useMemo, useState } from "react";
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
  const [data, setData] = useState([
    {
      id: 1,
      title: "测试项目1",
      specialty: 1,
      directoryName: "隧道1",
      totalCount: 100,
      labelCount: 100,
      annotatedCount: 50,
      unannotatedCount: 50,
    },
    {
      id: 2,
      title: "测试项目2",
      specialty: 2,
      directoryName: "隧道2",
      totalCount: 100,
      labelCount: 100,
      annotatedCount: 50,
      unannotatedCount: 50,
    },
  ]);

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

  const dataSource = useMemo(
    () =>
      data.map((item) => ({
        title: item.title,
        subTitle: (
          <Space>
            <Tag color="blue" variant="outlined">
              {item.directoryName}
            </Tag>
          </Space>
        ),
        actions: [
          <a style={{ color: "#ff4d4f" }} onClick={() => handleDelete(item.id)}>
            删除
          </a>,
          <AddProjectModal
            isEdit
            initialValues={item}
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
                value: item.totalCount,
                status: "processing",
              }}
            />
            <Divider />
            <StatisticCard
              statistic={{
                title: "标签数",
                value: item.labelCount,
                status: "default",
              }}
            />
            <StatisticCard
              statistic={{
                title: "已标注",
                value: item.annotatedCount,
                status: "success",
              }}
            />
            <StatisticCard
              statistic={{
                title: "未标注",
                value: item.unannotatedCount,
                status: "error",
              }}
            />
          </StatisticCard.Group>
        ),
      })),
    [data],
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
          }}
          dataSource={dataSource}
        />
      </PageContainer>
    </NiceModal.Provider>
  );
};

export default ProjectManage;
