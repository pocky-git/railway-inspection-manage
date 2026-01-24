import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import App from "./App.jsx";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import "./assets/iconfont/iconfont.css";

dayjs.locale("zh-cn");

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </HashRouter>,
);
