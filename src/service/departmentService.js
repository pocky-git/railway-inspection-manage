import api from '../utils/api';

/**
 * 获取部门列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} [params.tenant_id] - 租户ID（可选）
 * @param {string} [params.department_id] - 部门ID（可选）
 * @returns {Promise<Object>} 部门列表数据
 */
export const getDepartments = async (params) => {
  return api.get('/department', { params });
};

/**
 * 添加部门
 * @param {Object} departmentData - 部门数据
 * @param {string} departmentData.name - 部门名称
 * @param {string} departmentData.tenant_id - 所属租户ID
 * @param {boolean} [departmentData.status=true] - 状态
 * @returns {Promise<Object>} 添加结果
 */
export const addDepartment = async (departmentData) => {
  return api.post('/department', departmentData);
};

/**
 * 删除部门
 * @param {string} id - 部门ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteDepartment = async (id) => {
  return api.delete(`/department/${id}`);
};
