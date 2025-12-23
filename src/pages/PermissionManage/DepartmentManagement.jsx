import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Select,
  Popconfirm,
  Space,
  Flex,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { usePagination } from "ahooks";
import { userStore } from "../../store";
import { ROLE_ID } from "../../constants/role";
import { getDepartments, addDepartment, deleteDepartment } from "../../service";
import { getTenants } from "../../service/tenantService";

const { Option } = Select;

const DepartmentManagement = observer(() => {
  const [tenants, setTenants] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { pagination, data, loading, refresh } = usePagination(
    async ({ current, pageSize }) => {
      let total = 0;
      let list = [];
      try {
        const params = {
          page: current,
          pageSize,
        };

        const response = await getDepartments(params);

        if (response.code === 200) {
          list = response.data.list;
          total = response.data.total;
        }
      } catch (error) {
        console.error("获取部门列表失败:", error);
      }
      return {
        list,
        total,
      };
    }
  );

  // 获取租户列表（仅超级管理员需要）
  const fetchTenants = async () => {
    try {
      const response = await getTenants(1, 100);
      if (response.code === 200) {
        setTenants(response.data.list);
      }
    } catch (error) {
      console.error("获取租户列表失败:", error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    // 只有超级管理员需要获取租户列表
    if (userStore.userInfo?.role_id === ROLE_ID.SUPER_ADMIN) {
      fetchTenants();
    }
  }, []);

  // 显示添加部门模态框
  const showAddModal = () => {
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 添加部门
  const handleAddDepartment = async (values) => {
    try {
      const response = await addDepartment(values);

      if (response.code === 200) {
        message.success("部门添加成功");
        setIsModalVisible(false);
        form.resetFields();
        refresh();
      }
    } catch (error) {
      console.error("添加部门失败:", error);
    }
  };

  // 删除部门
  const handleDeleteDepartment = async (id) => {
    try {
      const response = await deleteDepartment(id);

      if (response.code === 200) {
        message.success("部门删除成功");
        refresh();
      }
    } catch (error) {
      console.error("删除部门失败:", error);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: "部门名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "所属租户",
      dataIndex: "tenant_name",
      key: "tenant_name",
      render: (tenant_name) => tenant_name || "-",
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
        <>
          <Popconfirm
            title="确定要删除这个部门吗？"
            onConfirm={() => handleDeleteDepartment(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Flex justify="flex-end">
        <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
          添加部门
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={data?.list || []}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
      />

      {/* 添加部门模态框 */}
      <Modal
        title="添加部门"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddDepartment}>
          {/* 只有超级管理员需要选择租户 */}
          {userStore.userInfo?.role_id === ROLE_ID.SUPER_ADMIN && (
            <Form.Item
              name="tenant_id"
              label="所属租户"
              rules={[{ required: true, message: "请选择所属租户" }]}
            >
              <Select placeholder="请选择所属租户">
                {tenants.map((tenant) => (
                  <Option key={tenant._id} value={tenant._id}>
                    {tenant.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="name"
            label="部门名称"
            rules={[{ required: true, message: "请输入部门名称" }]}
          >
            <Input placeholder="请输入部门名称" />
          </Form.Item>

          <Form.Item name="status" label="状态" initialValue={true}>
            <Select placeholder="请选择状态">
              <Option value={true}>启用</Option>
              <Option value={false}>禁用</Option>
            </Select>
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

export default DepartmentManagement;
