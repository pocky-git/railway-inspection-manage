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
        name="title"
        label="项目名称"
        rules={[{ required: true, message: "请输入项目名称" }]}
      />
      {!isEdit && (
        <ProFormSelect
          name="directory"
          label="选择目录"
          rules={[{ required: true, message: "请选择目录" }]}
          params={{ page: 1, pageSize: 999 }}
          mode="multiple"
          request={async (params) => {
            return [
              {
                label: "隧道1",
                value: 1,
              },
              {
                label: "隧道2",
                value: 2,
              },
            ];
          }}
        />
      )}
    </ModalForm>
  );
};

export default AddProjectModal;
