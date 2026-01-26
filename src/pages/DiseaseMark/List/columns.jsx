import { Space, Popconfirm } from "antd";
import AddMarkModal from "./AddMarkModal";

export const getColumns = ({ handleDeleteMark, handleStartMark, reload }) => {
  return [
    {
      title: "数据集名称",
      dataIndex: "name",
      key: "name",
      width: 600,
    },
    {
      title: "创建时间",
      dataIndex: "createAt",
      key: "createAt",
      search: false,
      width: 600,
    },
    {
      title: "操作",
      valueType: "option",
      key: "option",
      width: 180,
      render: (_, record) => (
        <Space>
          <a
            style={{ color: "#ff4d4f" }}
            onClick={() => handleDeleteMark(record.id)}
          >
            删除
          </a>
          <AddMarkModal
            onFinish={reload}
            isEdit
            initialValues={record}
            trigger={<a style={{ color: "#1677ff" }}>编辑</a>}
          />
          <a
            style={{ color: "#1677ff" }}
            onClick={() => handleStartMark(record.id)}
          >
            开始标注
          </a>
        </Space>
      ),
    },
  ];
};
