import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Form, message } from "antd";
import { addTenant, updateTenant } from "../../../service/tenantService";

const AddTenantModal = ({ onFinish, trigger, isEdit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={isEdit ? "编辑租户" : "添加租户"}
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
        //     ? updateTenant(id, values)
        //     : addTenant(values));
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
        name="name"
        label="租户名称"
        rules={[{ required: true, message: "请输入租户名称" }]}
      />
    </ModalForm>
  );
};

export default AddTenantModal;
