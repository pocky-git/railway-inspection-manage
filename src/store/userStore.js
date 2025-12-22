import { makeAutoObservable } from "mobx";
import { login, getCurrentUser } from "../service/authService";
import { ROLE_NAME_MAP } from "../constants/role";

class UserStore {
  // 状态
  token = localStorage.getItem("token") || "";
  userInfo = null;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  login = async (username, password) => {
    this.isLoading = true;
    try {
      // 调用真实登录API
      const response = await login(username, password);

      if (response.code === 200) {
        const { token, user } = response.data;

        this.token = token;
        this.userInfo = user;
        localStorage.setItem("token", token);

        return { success: true };
      } else {
        return { success: false, message: response.message || "登录失败" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "登录失败，请重试" };
    } finally {
      this.isLoading = false;
    }
  };

  // 获取当前用户信息
  getCurrentUserInfo = async () => {
    try {
      const response = await getCurrentUser();
      if (response.code === 200) {
        this.userInfo = response.data.user;
        return { success: true, user: response.data.user };
      } else {
        return {
          success: false,
          message: response.message || "获取用户信息失败",
        };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "获取用户信息失败，请重试" };
    }
  };

  logout = () => {
    this.token = "";
    this.userInfo = null;
    localStorage.removeItem("token");
  };

  // Getters
  get isLoggedIn() {
    return !!this.token;
  }

  // 获取用户角色名称
  get roleName() {
    if (!this.userInfo) return "";
    return ROLE_NAME_MAP[this.userInfo.role_id] || "未知角色";
  }
}

export default new UserStore();
