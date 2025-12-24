import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Form, message } from "antd";
import { addTenant } from "../../../service/tenantService";

const AddTenantModal = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="添加租户"
      trigger={
        <Button key="button" icon={<PlusOutlined />} type="primary">
          添加租户
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        try {
          const response = await addTenant(values);

          if (response.code === 200) {
            message.success("租户添加成功");
            onFinish?.();
            return true;
          }
        } catch (error) {
          console.error("添加租户失败:", error);
        }
        return false;
      }}
    >
      <ProFormText
        name="name"
        label="租户名"
        rules={[{ required: true, message: "请输入租户名" }]}
      />
      <ProFormText
        name="username"
        label="租户账号"
        rules={[{ required: true, message: "请输入租户账号" }]}
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
    </ModalForm>
  );
};

export default AddTenantModal;
