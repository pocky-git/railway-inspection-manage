import { Form } from "antd";
import {
  ModalForm,
  ProFormSelect,
  ProFormDigit,
  ProFormCheckbox,
} from "@ant-design/pro-components";

// 数据增强选项
const dataAugmentationOptions = [
  { label: "随机翻转", value: "random_flip" },
  { label: "旋转±15度", value: "rotation" },
  { label: "色彩抖动", value: "color_jitter" },
  { label: "高斯噪声", value: "gaussian_noise" },
  { label: "mosaic增强", value: "mosaic" },
  { label: "随机裁剪", value: "random_crop" },
];

const AddModelTrainingModal = ({ trigger, initialValues, onFinish }) => {
  const [form] = Form.useForm();

  // 提交表单
  const handleFinish = async (values) => {
    onFinish?.();
  };

  return (
    <ModalForm
      title="开始训练"
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
      <ProFormSelect
        name="project"
        label="项目选择"
        rules={[{ required: true, message: "请选择项目" }]}
        params={{ page: 1, pageSize: 999 }}
        request={async (params) => {
          return [];
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
        options={dataAugmentationOptions}
      />
    </ModalForm>
  );
};

export default AddModelTrainingModal;
