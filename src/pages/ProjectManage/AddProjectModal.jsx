import { Form } from "antd";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";

const AddProjectModal = ({ trigger, initialValues, isEdit, onFinish }) => {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    onFinish?.(values);
  };

  return (
    <ModalForm
      title={isEdit ? "编辑项目" : "新建项目"}
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
      {!isEdit && (
        <>
          <ProFormSelect
            name="specialty"
            label="选择专业"
            rules={[{ required: true, message: "请选择专业" }]}
            options={[
              { label: "工务", value: "specialty1" },
              { label: "电务", value: "specialty2" },
              { label: "供电", value: "specialty3" },
            ]}
          />
          <ProFormSelect
            name="line"
            label="选择线路"
            rules={[{ required: true, message: "请选择线路" }]}
            params={{ page: 1, pageSize: 999 }}
            mode="multiple"
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
        </>
      )}
    </ModalForm>
  );
};

export default AddProjectModal;
