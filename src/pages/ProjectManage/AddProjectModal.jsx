import { useState } from "react";
import { Modal, Form, Upload, Input } from "antd";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { PlusOutlined } from "@ant-design/icons";

const AddProjectModal = NiceModal.create(({ onConfirm }) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirm?.(values);
      modal.hide();
    }, 1000);
  };

  return (
    <Modal
      title="新建项目"
      open={modal.visible}
      okButtonProps={{ autoFocus: true, htmlType: "submit" }}
      onCancel={() => modal.hide()}
      bodyStyle={{ paddingTop: 24 }}
      destroyOnHidden={true}
      confirmLoading={loading}
      modalRender={(dom) => (
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          clearOnDestroy
          onFinish={(values) => handleSubmit(values)}
        >
          {dom}
        </Form>
      )}
    >
      <Form.Item
        rules={[{ required: true, message: "请输入项目名称" }]}
        label="项目名称"
        name="title"
      >
        <Input placeholder="请输入项目名称" style={{ width: "100%" }} />
      </Form.Item>
    </Modal>
  );
});

export default AddProjectModal;
