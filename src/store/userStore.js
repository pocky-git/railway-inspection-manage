import { makeAutoObservable } from "mobx";

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
      // 模拟登录请求
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock 登录逻辑
      if (username === "admin" && password === "123456") {
        const mockToken = "mock-token-123456";
        const mockUserInfo = {
          id: 1,
          username: "admin",
          name: "管理员",
          role: "admin",
        };

        this.token = mockToken;
        this.userInfo = mockUserInfo;
        localStorage.setItem("token", mockToken);
        return { success: true };
      } else {
        return { success: false, message: "用户名或密码错误" };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "登录失败，请重试" };
    } finally {
      this.isLoading = false;
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
}

export default new UserStore();
