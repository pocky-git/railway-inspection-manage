import {
  ModalForm,
  ProFormDateRangePicker,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Form } from "antd";

const AddAnalysisModal = ({ onFinish, trigger, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="启动分析"
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
      <ProFormSelect
        name="name"
        label="选择项目"
        rules={[{ required: true, message: "请选择项目" }]}
        params={{ page: 1, pageSize: 999 }}
        request={async (params) => {
          return [
            {
              label: "项目1",
              value: "project1",
            },
          ];
        }}
      />
      <ProFormSelect
        name="modelName"
        label="选择模型"
        rules={[{ required: true, message: "请选择模型" }]}
        params={{ page: 1, pageSize: 999 }}
        request={async (params) => {
          return [
            {
              label: "工务模型",
              value: "workModel",
            },
            {
              label: "电务模型",
              value: "electricalModel",
            },
            {
              label: "供电模型",
              value: "supplyModel",
            },
          ];
        }}
      />
      <ProFormDateRangePicker
        width="100%"
        name="dateRange"
        label="时间范围"
        rules={[{ required: true, message: "请选择时间范围" }]}
      />
    </ModalForm>
  );
};

export default AddAnalysisModal;
