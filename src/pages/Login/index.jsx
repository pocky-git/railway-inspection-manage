import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { userStore } from "../../store";
import styles from "./styles.module.css";

const Login = observer(() => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const result = await userStore.login(values.username, values.password);

    if (result.success) {
      message.success("登录成功");
      navigate("/");
    }
  };

  return (
    <div className={styles["login-container"]}>
      <Card className={styles["login-card"]}>
        <h1 className={styles["login-title"]}>铁路巡检系统</h1>
        <Form name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={
                <UserOutlined className={styles["site-form-item-icon"]} />
              }
              placeholder="请输入用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              prefix={
                <LockOutlined className={styles["site-form-item-icon"]} />
              }
              type="password"
              placeholder="请输入密码"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles["login-button"]}
              loading={userStore.isLoading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
});

export default Login;
