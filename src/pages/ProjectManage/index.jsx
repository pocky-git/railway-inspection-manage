import React, { useState, useEffect } from "react";
import { Row, Col, Card, Statistic, Button, Modal } from "antd";
import { DeleteOutlined, CopyOutlined, PlusOutlined } from "@ant-design/icons";
import AddProjectModal from "./AddProjectModal";
import NiceModal from "@ebay/nice-modal-react";
import uniqueId from "lodash/uniqueId";
import dayjs from "dayjs";
import { getData } from "./mockData";
import styles from "./styles.module.css";

const ProjectManage = () => {
  const [data, setData] = useState([]);

  const handleAddProject = () => {
    NiceModal.show(AddProjectModal, {
      onConfirm: (values) => {
        setData([
          {
            ...values,
            createTime: dayjs().format("YYYY-MM-DD"),
            totalQuantity: 1200,
            labelCategory: 1,
            labelCount: 300,
            annotated: 300,
            unannotated: 300,
            id: uniqueId(),
          },
          ...data,
        ]);
      },
    });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "确认删除吗？",
      okText: "确认",
      okType: "danger",
      onOk: () => {
        setData(data.filter((item) => item.id !== id));
      },
    });
  };

  const handleCopy = (item) => {
    Modal.confirm({
      title: "确认复制吗？",
      okText: "确认",
      okType: "default",
      onOk: () => {
        setData([
          {
            ...item,
            id: uniqueId(),
          },
          ...data,
        ]);
      },
    });
  };

  useEffect(() => {
    setData(getData());
  }, []);

  return (
    <NiceModal.Provider>
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <div onClick={handleAddProject} className={styles["add-project"]}>
            <PlusOutlined className={styles["add-project-icon"]} />
            <span className={styles["add-project-text"]}>新建项目</span>
          </div>
        </Col>
        {data.map((item) => (
          <Col span={8} key={item.id}>
            <Card
              title={
                <>
                  <div className={styles["card-title"]}>{item.title}</div>
                  <div className={styles["card-description"]}>
                    创建时间：{item.createTime}
                  </div>
                </>
              }
              extra={
                <>
                  <Button
                    onClick={() => handleCopy(item)}
                    color="default"
                    variant="link"
                    size="small"
                  >
                    <CopyOutlined style={{ fontSize: 16 }} />
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    color="danger"
                    variant="link"
                    size="small"
                  >
                    <DeleteOutlined style={{ fontSize: 16 }} />
                  </Button>
                </>
              }
              headStyle={{ padding: "16px" }}
              bodyStyle={{ padding: "16px" }}
            >
              <Row gutter={12}>
                <Col span={12}>
                  <div className={styles["statistic-left-item"]}>
                    <Statistic
                      title="总数量"
                      value={item.totalQuantity}
                      valueStyle={{
                        fontSize: "24px",
                        fontWeight: "600",
                        color: "#1890ff",
                      }}
                    />
                  </div>
                </Col>
                <Col span={12}>
                  <div className={styles["statistic-right-item"]}>
                    <Statistic
                      title="标签类别"
                      value={item.labelCategory}
                      valueStyle={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#595959",
                      }}
                    />
                    <Statistic
                      title="标签数"
                      value={item.labelCount}
                      valueStyle={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#595959",
                      }}
                    />
                  </div>
                  <div className={styles["statistic-right-item"]}>
                    <Statistic
                      title="已标注"
                      value={item.annotated}
                      valueStyle={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#3f8600",
                      }}
                    />
                    <Statistic
                      title="未标注"
                      value={item.unannotated}
                      valueStyle={{
                        fontSize: "20px",
                        fontWeight: "500",
                        color: "#cf1322",
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </NiceModal.Provider>
  );
};

export default ProjectManage;
