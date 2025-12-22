import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Flex,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { usePagination } from "ahooks";
import { getTenants, addTenant, deleteTenant } from "../../service";

const TenantManagement = observer(() => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { pagination, data, loading, refresh } = usePagination(
    async ({ current, pageSize }) => {
      let total = 0;
      let list = [];
      try {
        const response = await getTenants(current, pageSize);

        if (response.code === 200) {
          list = response.data.list;
          total = response.data.total;
        }
      } catch (error) {
        console.error("获取租户列表失败:", error);
      }
      return {
        list,
        total,
      };
    }
  );

  // 显示添加租户模态框
  const showAddModal = () => {
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 添加租户
  const handleAddTenant = async (values) => {
    try {
      const response = await addTenant(values);

      if (response.code === 200) {
        message.success("租户添加成功");
        setIsModalVisible(false);
        form.resetFields();
        refresh();
      }
    } catch (error) {
      console.error("添加租户失败:", error);
    }
  };

  // 删除租户
  const handleDeleteTenant = async (id) => {
    try {
      const response = await deleteTenant(id);

      if (response.code === 200) {
        message.success("租户删除成功");
        refresh();
      }
    } catch (error) {
      console.error("删除租户失败:", error);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: "租户名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "租户账号",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => <span>{status ? "启用" : "禁用"}</span>,
    },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="确定要删除这个租户吗？"
          onConfirm={() => handleDeleteTenant(record._id)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="text" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Flex justify="flex-end">
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          添加租户
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={data?.list || []}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
      />

      {/* 添加租户模态框 */}
      <Modal
        title="添加租户"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTenant}>
          <Form.Item
            name="name"
            label="租户名称"
            rules={[{ required: true, message: "请输入租户名称" }]}
          >
            <Input placeholder="请输入租户名称" />
          </Form.Item>

          <Form.Item
            name="username"
            label="租户账号"
            rules={[{ required: true, message: "请输入租户账号" }]}
          >
            <Input placeholder="请输入租户账号" />
          </Form.Item>

          <Form.Item
            name="password"
            label="租户密码"
            rules={[{ required: true, message: "请输入租户密码" }]}
          >
            <Input.Password placeholder="请输入租户密码" />
          </Form.Item>

          <Form.Item
            name="email"
            label="租户邮箱"
            rules={[
              { required: true, message: "请输入租户邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input placeholder="请输入租户邮箱" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="租户手机号"
            rules={[{ required: true, message: "请输入租户手机号" }]}
          >
            <Input placeholder="请输入租户手机号" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              确定
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCancel}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
});

export default TenantManagement;
