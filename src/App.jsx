import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "./store";
import { routes, getRoutesByRole } from "./config/routes";

// 懒加载页面组件
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Main = lazy(() => import("./pages/Main"));

// 私有路由组件，用于保护需要登录的页面
const PrivateRoute = observer(({ children, requiredRoles }) => {
  // 如果用户未登录，重定向到登录页
  if (!userStore.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 如果配置了角色要求，检查用户角色是否匹配
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(userStore.userInfo?.role_id)) {
      // 如果角色不匹配，重定向到404页面
      return <Navigate to="/404" replace />;
    }
  }

  return children;
});

const App = observer(() => {
  useEffect(() => {
    // 检查是否有已保存的token
    const token = localStorage.getItem("token");
    if (token) {
      // 如果有token，尝试获取当前用户信息
      userStore.getCurrentUserInfo();
    }
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/404" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        >
          {/* 根据用户角色过滤路由 */}
          <Route
            path="/"
            element={
              <Navigate
                to={getRoutesByRole(userStore.userInfo?.role_id)[0]?.path}
                replace
              />
            }
          />
          {routes.map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={
                <PrivateRoute requiredRoles={item.roles}>
                  {item.element}
                </PrivateRoute>
              }
            />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
});

export default App;
