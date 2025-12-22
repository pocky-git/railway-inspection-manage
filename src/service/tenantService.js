import api from "../utils/api";

/**
 * 获取租户列表
 * @param {number} page - 页码
 * @param {number} pageSize - 每页条数
 * @param {Object} [extraParams] - 额外查询参数（可选）
 * @returns {Promise<Object>} 租户列表数据
 */
export const getTenants = async (page = 1, pageSize = 10, extraParams = {}) => {
  return api.get("/tenant", { params: { page, pageSize, ...extraParams } });
};

/**
 * 添加租户
 * @param {Object} tenantData - 租户数据
 * @param {string} tenantData.name - 租户名称
 * @param {string} tenantData.username - 租户账号
 * @param {string} tenantData.password - 租户密码
 * @param {string} tenantData.email - 租户邮箱
 * @param {string} tenantData.phone - 租户手机号
 * @returns {Promise<Object>} 添加结果
 */
export const addTenant = async (tenantData) => {
  return api.post("/tenant", tenantData);
};

/**
 * 删除租户
 * @param {string} id - 租户ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteTenant = async (id) => {
  return api.delete(`/tenant/${id}`);
};
