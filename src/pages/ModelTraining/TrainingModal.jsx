import { Form } from "antd";
import {
  ModalForm,
  ProFormSelect,
  ProFormDigit,
  ProFormCheckbox,
} from "@ant-design/pro-components";

const AddModelTrainingModal = ({
  trigger,
  initialValues,
  onFinish,
  readonly,
}) => {
  const [form] = Form.useForm();

  // 提交表单
  const handleFinish = async (values) => {
    onFinish?.();
  };

  return (
    <ModalForm
      title={readonly ? "查看参数" : "配置参数"}
      trigger={trigger}
      form={form}
      autoFocusFirstInput
      onOpenChange={(open) => open && form.setFieldsValue(initialValues)}
      modalProps={{
        destroyOnClose: true,
        width: 500,
      }}
      onFinish={handleFinish}
      readonly={readonly}
    >
      <ProFormSelect
        name="dataset"
        label="数据集"
        rules={[{ required: true, message: "请选择数据集" }]}
        mode="multiple"
        params={{ page: 1, pageSize: 999 }}
        request={async (params) => {
          return [
            {
              value: 1,
              label: "裂缝数据集",
            },
            {
              value: 2,
              label: "落石数据集",
            },
          ];
        }}
      />

      <ProFormDigit
        name="learningRate"
        label="学习率"
        rules={[{ required: true, message: "请输入学习率" }]}
        min={0}
      />

      <ProFormDigit
        name="batchSize"
        label="批次大小"
        rules={[{ required: true, message: "请输入批次大小" }]}
        min={0}
      />

      <ProFormDigit
        name="epochs"
        label="迭代次数"
        rules={[{ required: true, message: "请输入迭代次数" }]}
        min={0}
      />

      <ProFormCheckbox.Group
        name="dataAugmentation"
        label="数据增强"
        valueEnum={{
          random_flip: {
            text: "随机翻转",
          },
          rotation: {
            text: "旋转±15度",
          },
          color_jitter: {
            text: "色彩抖动",
          },
          gaussian_noise: {
            text: "高斯噪声",
          },
          mosaic: {
            text: "mosaic增强",
          },
          random_crop: {
            text: "随机裁剪",
          },
        }}
      />
    </ModalForm>
  );
};

export default AddModelTrainingModal;
