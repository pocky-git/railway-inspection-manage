import { Form } from "antd";
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";

const AddModelModal = ({ trigger, initialValues, isEdit, onFinish }) => {
  const [form] = Form.useForm();

  // 提交表单
  const handleFinish = async (values) => {
    onFinish?.();
  };

  return (
    <ModalForm
      title={isEdit ? "编辑模型" : "新建模型"}
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
        name="modelName"
        label="模型名称"
        rules={[{ required: true, message: "请输入模型名称" }]}
      />
      {!isEdit && (
        <ProFormSelect
          name="modelType"
          label="模型类型"
          rules={[{ required: true, message: "请选择模型类型" }]}
          valueEnum={{
            1: {
              text: "YOLO",
            },
            2: {
              text: "SAM",
            },
            3: {
              text: "MMSeg",
            },
          }}
        />
      )}
    </ModalForm>
  );
};

export default AddModelModal;
