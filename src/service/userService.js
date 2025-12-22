import api from '../utils/api';

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.tenant_id] - 租户ID（可选）
 * @param {string} [params.department_id] - 部门ID（可选）
 * @returns {Promise<Object>} 用户列表数据
 */
export const getUsers = async (params) => {
  return api.get('/user', { params });
};

/**
 * 添加用户
 * @param {Object} userData - 用户数据
 * @param {string} userData.username - 用户名
 * @param {string} userData.password - 密码
 * @param {string} userData.real_name - 真实姓名
 * @param {string} userData.phone - 手机号
 * @param {string} [userData.email] - 邮箱（可选）
 * @param {string} userData.tenant_id - 所属租户ID
 * @param {string} userData.department_id - 所属部门ID
 * @param {number} [userData.role_id=4] - 角色ID（可选，默认普通用户）
 * @returns {Promise<Object>} 添加结果
 */
export const addUser = async (userData) => {
  return api.post('/user', userData);
};

/**
 * 删除用户
 * @param {string} id - 用户ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteUser = async (id) => {
  return api.delete(`/user/${id}`);
};
