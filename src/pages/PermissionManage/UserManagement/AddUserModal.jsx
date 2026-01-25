import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Form, message } from "antd";
import { addUser, updateUser } from "../../../service/userService";

const AddUserModal = ({ onFinish, trigger, isEdit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={isEdit ? "编辑用户" : "添加用户"}
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      onOpenChange={(open) => open && form.setFieldsValue(initialValues)}
      modalProps={{
        destroyOnClose: true,
        width: 500,
      }}
      onFinish={async (values) => {
        // try {
        //   const response = await (id
        //     ? updateUser(id, values)
        //     : addUser(values));
        //   if (response.code === 200) {
        //     message.success("保存成功");
        //     onFinish?.();
        //     return true;
        //   }
        // } catch (error) {
        //   console.error("保存失败:", error);
        // }
        // return false;
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
      {!isEdit && (
        <>
          <ProFormText.Password
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
            hasFeedback
          />
          <ProFormText.Password
            dependencies={["password"]}
            name="confirmPassword"
            label="确认密码"
            rules={[
              { required: true, message: "请再次输入密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致!"));
                },
              }),
            ]}
            hasFeedback
          />
        </>
      )}
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
      <ProFormSelect
        name="specialty"
        label="专业"
        rules={[{ required: true, message: "请选择专业" }]}
        options={[
          { label: "工务", value: "workforce" },
          { label: "电务", value: "electrical" },
          { label: "供电", value: "power" },
        ]}
      />
      <ProFormSelect
        name="line_ids"
        label="负责线路"
        rules={[{ required: true, message: "请选择负责线路" }]}
        mode="multiple"
        params={{ page: 1, pageSize: 999 }}
        request={async (params) => {
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
        }}
      />
      <ProFormSelect
        name="role_id"
        label="角色"
        rules={[{ required: true, message: "请选择角色" }]}
        options={[
          { label: "管理员", value: "admin" },
          { label: "普通用户", value: "user" },
        ]}
      />
      <ProFormSelect
        name="tenant_id"
        label="所属租户"
        rules={[{ required: true, message: "请选择所属租户" }]}
        params={{ page: 1, pageSize: 999 }}
        request={async (params) => {
          return [
            {
              label: "广州铁路局",
              value: "guangzhou",
            },
            {
              label: "成都铁路局",
              value: "chengdu",
            },
          ];
        }}
      />
    </ModalForm>
  );
};

export default AddUserModal;
