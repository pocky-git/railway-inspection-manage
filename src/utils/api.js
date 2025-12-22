import axios from "axios";
import { message } from "antd";
import { userStore } from "../store";

// 创建axios实例
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = userStore.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { code, message: msg } = response.data;
    if (code !== 200) {
      message.error(msg || "请求失败");
      return Promise.reject(new Error(msg || "请求失败"));
    }
    return response.data;
  },
  (error) => {
    const { response } = error;
    if (response) {
      const { code, message: msg } = response.data;
      if (code === 401) {
        // 未授权，跳转到登录页
        userStore.logout();
        window.location.hash = "/login";
      }
      message.error(msg || "请求失败");
    } else {
      message.error("网络错误，请稍后重试");
    }
    return Promise.reject(error);
  }
);

export default api;
