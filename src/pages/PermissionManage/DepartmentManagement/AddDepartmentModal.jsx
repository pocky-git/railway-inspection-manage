import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProFormSelect,
  ProFormText,
} from "@ant-design/pro-components";
import { Button, Form, message } from "antd";
import { addDepartment } from "../../../service/departmentService";
import { getTenants } from "../../../service/tenantService";
import userStore from "../../../store/userStore";
import { ROLE_ID } from "../../../constants/role";

const AddDepartmentModal = ({ onFinish }) => {
  const [form] = Form.useForm();

  return (
    <ModalForm
      title="添加部门"
      trigger={
        <Button key="button" icon={<PlusOutlined />} type="primary">
          添加部门
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        try {
          const response = await addDepartment(values);
          if (response.code === 200) {
            message.success("部门添加成功");
            onFinish?.();
            return true;
          }
        } catch (error) {
          console.error("添加部门失败:", error);
        }
        return false;
      }}
    >
      {userStore.userInfo?.role_id === ROLE_ID.SUPER_ADMIN && (
        <ProFormSelect
          name="tenant_id"
          label="所属租户"
          rules={[{ required: true, message: "请选择所属租户" }]}
          params={{ page: 1, pageSize: 999 }}
          request={async (params) => {
            return getTenants(params).then(
              (res) =>
                res.data?.list?.map?.((item) => ({
                  label: item.name,
                  value: item._id,
                })) || []
            );
          }}
        />
      )}
      <ProFormText
        name="name"
        label="部门名称"
        rules={[{ required: true, message: "请输入部门名称" }]}
      />
    </ModalForm>
  );
};

export default AddDepartmentModal;
