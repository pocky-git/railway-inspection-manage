import {
  ModalForm,
  ProFormDateRangePicker,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Form } from "antd";

const SelectProjectModal = ({ onFinish, trigger }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="选择项目"
      trigger={trigger}
      form={form}
      autoFocusFirstInput
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
    </ModalForm>
  );
};

export default SelectProjectModal;
