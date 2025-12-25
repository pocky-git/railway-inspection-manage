import {
  ModalForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Form, message } from "antd";
import { useMemo } from "react";
import { addUser, updateUser } from "../../../service/userService";
import { getTenants } from "../../../service/tenantService";
import { getDepartments } from "../../../service/departmentService";
import userStore from "../../../store/userStore";
import { ROLE_ID, ROLE_NAME_MAP } from "../../../constants/role";

const AddUserModal = ({ onFinish, trigger, id, initialValues }) => {
  const [form] = Form.useForm();
  const roles = useMemo(() => {
    const currentRole = userStore.userInfo?.role_id;
    const roles = [];

    // 超级管理员可以创建所有角色
    if (currentRole === ROLE_ID.SUPER_ADMIN) {
      roles.push(
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
    // 部门管理员只能创建普通用户
    else if (currentRole === ROLE_ID.DEPARTMENT_ADMIN) {
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

    return roles;
  }, [userStore.userInfo?.role_id]);

  return (
    <ModalForm
      title={id ? "编辑用户" : "添加用户"}
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      onOpenChange={(open) => open && form.setFieldsValue(initialValues)}
      modalProps={{
        destroyOnClose: true,
        width: 500,
      }}
      onFinish={async (values) => {
        try {
          const response = await (id
            ? updateUser(id, values)
            : addUser(values));

          if (response.code === 200) {
            message.success("保存成功");
            onFinish?.();
            return true;
          }
        } catch (error) {
          console.error("保存失败:", error);
        }
        return false;
      }}
    >
      <ProFormText
        name="real_name"
        label="真实姓名"
        rules={[{ required: true, message: "请输入真实姓名" }]}
      />
      <ProFormText
        name="username"
        label="用户名称"
        rules={[{ required: true, message: "请输入用户名称" }]}
      />
      <ProFormText.Password
        name="password"
        label="密码"
        rules={[{ required: true, message: "请输入密码" }]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: "请输入邮箱" },
          { type: "email", message: "请输入有效的邮箱地址" },
        ]}
      />
      <ProFormText
        name="phone"
        label="手机号"
        rules={[{ required: true, message: "请输入手机号" }]}
      />
      {userStore.userInfo?.role_id === ROLE_ID.SUPER_ADMIN && (
        <ProFormSelect
          name="tenant_id"
          label="所属租户"
          rules={[{ required: true, message: "请选择所属租户" }]}
          params={{ page: 1, pageSize: 999 }}
          request={async (params) => {
            return getTenants(params).then(
              (res) =>
                res.data?.list?.map?.((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []
            );
          }}
        />
      )}
      {userStore.userInfo?.role_id <= ROLE_ID.TENANT_ADMIN && (
        <ProFormDependency name={["tenant_id", "role_id"]}>
          {({ tenant_id, role_id }) => {
            if (role_id <= ROLE_ID.TENANT_ADMIN) return null;
            form.resetFields(["department_id"]);
            return (
              <ProFormSelect
                name="department_id"
                label="所属部门"
                rules={[{ required: true, message: "请选择所属部门" }]}
                params={{ tenant_id, page: 1, pageSize: 999 }}
                request={async (params) => {
                  return getDepartments(params).then(
                    (res) =>
                      res.data?.list?.map?.((item) => ({
                        label: item.name,
                        value: item._id,
                      })) || []
                  );
                }}
              />
            );
          }}
        </ProFormDependency>
      )}
      <ProFormSelect
        name="role_id"
        label="角色"
        rules={[{ required: true, message: "请选择角色" }]}
        options={roles}
      />
    </ModalForm>
  );
};

export default AddUserModal;
