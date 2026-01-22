import { Form } from "antd";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";

const AddProjectModal = ({ trigger, initialValues, onFinish }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    onFinish?.(values);
  };

  return (
    <ModalForm
      title="新建项目"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      onOpenChange={(open) => open && form.setFieldsValue(initialValues)}
      modalProps={{
        destroyOnClose: true,
        width: 500,
      }}
      onFinish={handleFinish}
    >
      <ProFormText
        name="projectName"
        label="项目名称"
        rules={[{ required: true, message: "请输入项目名称" }]}
      />

      <ProFormSelect
        name="specialty"
        label="专业"
        rules={[{ required: true, message: "请选择专业" }]}
        options={[
          { label: "工务", value: "specialty1" },
          { label: "电务", value: "specialty2" },
          { label: "供电", value: "specialty3" },
        ]}
      />
      <ProFormSelect
        name="line"
        label="线路"
        rules={[{ required: true, message: "请选择线路" }]}
        options={[
          { label: "k100-k200", value: "line1" },
          { label: "k200-k300", value: "line2" },
          { label: "k300-k400", value: "line3" },
        ]}
      />
    </ModalForm>
  );
};

export default AddProjectModal;
