import api from "../utils/api";

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise<Object>} 登录结果
 */
export const login = async (username, password) => {
  return api.post("/auth/login", { username, password });
};

/**
 * 获取当前用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getCurrentUser = async () => {
  return api.get("/auth/current");
};
