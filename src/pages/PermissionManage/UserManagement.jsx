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
import { ROLE_ID, ROLE_NAME_MAP } from "../../constants/role";
import { getUsers, addUser, deleteUser } from "../../service/userService";
import { getTenants } from "../../service/tenantService";
import { getDepartments } from "../../service/departmentService";

const { Option } = Select;

const UserManagement = observer(() => {
  const [tenants, setTenants] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // 获取用户列表
  const { pagination, data, loading, refresh } = usePagination(
    async ({ current, pageSize }) => {
      let total = 0;
      let list = [];
      try {
        const params = {
          page: current,
          pageSize,
        };

        const response = await getUsers(params);

        if (response.code === 200) {
          total = response.data.total;
          list = response.data.list;
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
      }

      return {
        total,
        list,
      };
    }
  );

  // 获取租户列表
  const fetchTenants = async () => {
    try {
      const params = { page: 1, pageSize: 100 };

      const response = await getTenants(params.page, params.pageSize, params);
      if (response.code === 200) {
        setTenants(response.data.list);
      }
    } catch (error) {
      console.error("获取租户列表失败:", error);
    }
  };

  // 获取部门列表
  const fetchDepartments = async (tenantId) => {
    try {
      const params = {
        page: 1,
        pageSize: 100,
      };

      if (tenantId) {
        // 如果是超级管理员选择了租户，获取该租户的部门
        params.tenant_id = tenantId;
      }

      const response = await getDepartments(params);
      if (response.code === 200) {
        setDepartments(response.data.list);
      }
    } catch (error) {
      console.error("获取部门列表失败:", error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (userStore.userInfo?.role_id === ROLE_ID.SUPER_ADMIN) {
      fetchTenants();
    }
  }, []);

  // 当租户变化时，更新部门列表
  const handleTenantChange = (tenantId) => {
    fetchDepartments(tenantId);
  };

  // 显示添加用户模态框
  const showAddModal = () => {
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // 添加用户
  const handleAddUser = async (values) => {
    try {
      const response = await addUser(values);

      if (response.code === 200) {
        message.success("用户添加成功");
        setIsModalVisible(false);
        form.resetFields();
        refresh();
      }
    } catch (error) {
      console.error("添加用户失败:", error);
    }
  };

  // 删除用户
  const handleDeleteUser = async (id) => {
    try {
      const response = await deleteUser(id);

      if (response.code === 200) {
        message.success("用户删除成功");
        refresh();
      }
    } catch (error) {
      console.error("删除用户失败:", error);
    }
  };

  // 根据当前用户角色获取可用的角色选项
  const getAvailableRoles = () => {
    const currentRole = userStore.userInfo?.role_id;
    const roles = [];

    // 超级管理员可以创建所有角色
    if (currentRole === ROLE_ID.SUPER_ADMIN) {
      roles.push(
        {
          value: ROLE_ID.SUPER_ADMIN,
          label: ROLE_NAME_MAP[ROLE_ID.SUPER_ADMIN],
        },
        {
          value: ROLE_ID.TENANT_ADMIN,
          label: ROLE_NAME_MAP[ROLE_ID.TENANT_ADMIN],
        },
        {
          value: ROLE_ID.DEPARTMENT_ADMIN,
          label: ROLE_NAME_MAP[ROLE_ID.DEPARTMENT_ADMIN],
        },
        {
          value: ROLE_ID.REGULAR_USER,
          label: ROLE_NAME_MAP[ROLE_ID.REGULAR_USER],
        }
      );
    }
    // 租户管理员可以创建部门管理员和普通用户
    else if (currentRole === ROLE_ID.TENANT_ADMIN) {
      roles.push(
        {
          value: ROLE_ID.DEPARTMENT_ADMIN,
          label: ROLE_NAME_MAP[ROLE_ID.DEPARTMENT_ADMIN],
        },
        {
          value: ROLE_ID.REGULAR_USER,
          label: ROLE_NAME_MAP[ROLE_ID.REGULAR_USER],
        }
      );
    }
    // 部门管理员只能创建普通用户
    else if (currentRole === ROLE_ID.DEPARTMENT_ADMIN) {
      roles.push({
        value: ROLE_ID.REGULAR_USER,
        label: ROLE_NAME_MAP[ROLE_ID.REGULAR_USER],
      });
    }

    return roles;
  };

  // 表格列配置
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "真实姓名",
      dataIndex: "real_name",
      key: "real_name",
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
      title: "所属租户",
      dataIndex: "tenant_name",
      key: "tenant_name",
      render: (tenant_name) => tenant_name || "-",
    },
    {
      title: "所属部门",
      dataIndex: "department_name",
      key: "department_name",
      render: (department_name) => department_name || "-",
    },
    {
      title: "角色",
      dataIndex: "role_id",
      key: "role_id",
      render: (roleId) => {
        return ROLE_NAME_MAP[roleId] || "未知";
      },
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
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDeleteUser(record._id)}
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
          添加用户
        </Button>
      </Flex>

      <Table
        columns={columns}
        dataSource={data?.list || []}
        rowKey="_id"
        loading={loading}
        pagination={pagination}
      />

      {/* 添加用户模态框 */}
      <Modal
        title="添加用户"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          {/* 用户名 */}
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          {/* 真实姓名 */}
          <Form.Item
            name="real_name"
            label="真实姓名"
            rules={[{ required: true, message: "请输入真实姓名" }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          {/* 密码 */}
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          {/* 邮箱 */}
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          {/* 手机号 */}
          <Form.Item
            name="phone"
            label="手机号"
            rules={[{ required: true, message: "请输入手机号" }]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          {/* 所属租户 */}
          {userStore.userInfo?.role_id === ROLE_ID.SUPER_ADMIN && (
            <Form.Item
              name="tenant_id"
              label="所属租户"
              rules={[{ required: true, message: "请选择所属租户" }]}
            >
              <Select
                placeholder="请选择所属租户"
                onChange={handleTenantChange}
              >
                {tenants.map((tenant) => (
                  <Option key={tenant._id} value={tenant._id}>
                    {tenant.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* 所属部门 */}
          {userStore.userInfo?.role_id !== ROLE_ID.DEPARTMENT_ADMIN && (
            <Form.Item
              name="department_id"
              label="所属部门"
              rules={[{ required: true, message: "请选择所属部门" }]}
            >
              <Select placeholder="请选择所属部门">
                {departments.map((department) => (
                  <Option key={department._id} value={department._id}>
                    {department.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* 角色 */}
          <Form.Item
            name="role_id"
            label="角色"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select placeholder="请选择角色">
              {getAvailableRoles().map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* 状态 */}
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

export default UserManagement;
