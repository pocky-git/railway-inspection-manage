import {
  ModalForm,
  ProFormText,
  ProFormDigitRange,
} from "@ant-design/pro-components";
import { Form, message } from "antd";

const AddLineModal = ({ onFinish, trigger, id, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={id ? "编辑线路" : "添加线路"}
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
        label="线路名称"
        rules={[{ required: true, message: "请输入线路名称" }]}
      />
      <ProFormDigitRange
        label="经度"
        name="longitude"
        separator="-"
        placeholder={["经度最小值", "经度最大值"]}
        separatorWidth={60}
        width="100%"
        rules={[{ required: true, message: "请输入经度" }]}
      />
      <ProFormDigitRange
        label="纬度"
        name="latitude"
        separator="-"
        placeholder={["纬度最小值", "纬度最大值"]}
        separatorWidth={60}
        rules={[{ required: true, message: "请输入纬度" }]}
      />
    </ModalForm>
  );
};

export default AddLineModal;
