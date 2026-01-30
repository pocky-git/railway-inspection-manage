import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Form, message } from "antd";

const AddMarkModal = ({ onFinish, trigger, isEdit, initialValues }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title={isEdit ? "编辑数据集" : "添加数据集"}
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
        label="数据集名称"
        rules={[{ required: true, message: "请输入数据集名称" }]}
      />
      {!isEdit && (
        <>
          <ProFormSelect
            name="diseaseType"
            label="病害类型"
            rules={[{ required: true, message: "请选择病害类型" }]}
            params={{ page: 1, pageSize: 999 }}
            request={async (params) => {
              return [
                {
                  label: "裂缝",
                  value: 1,
                },
                {
                  label: "落石",
                  value: 2,
                },
                {
                  label: "变形",
                  value: 3,
                },
              ];
            }}
          />
          <ProFormSelect
            name="name"
            label="选择项目"
            rules={[{ required: true, message: "请选择项目" }]}
            params={{ page: 1, pageSize: 999 }}
            request={async (params) => {
              return [
                {
                  label: "测试项目1",
                  value: "testProject1",
                },
                {
                  label: "测试项目2",
                  value: "testProject2",
                },
                {
                  label: "测试项目3",
                  value: "testProject3",
                },
              ];
            }}
          />
        </>
      )}
    </ModalForm>
  );
};

export default AddMarkModal;
