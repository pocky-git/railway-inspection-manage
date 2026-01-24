import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "./store";
import { getRoutes } from "./config/routes";
import AdminLayout from "./components/Layout";

// 懒加载页面组件
const Login = lazy(() => import("./pages/Login"));

// 私有路由组件，用于保护需要登录的页面
const PrivateRoute = observer(({ children }) => {
  // 如果用户未登录，重定向到登录页
  // if (!userStore.isLoggedIn) {
  //   return <Navigate to="/login" replace />;
  // }

  return children;
});

const App = observer(() => {
  const routes = getRoutes();

  const renderRoutes = (routes) => {
    return routes.map((item) => (
      <Route key={item.path} path={item.path} element={item.component}>
        {!!item.routes?.length && renderRoutes(item.routes)}
      </Route>
    ));
  };

  // useEffect(() => {
  //   // 检查是否有已保存的token
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // 如果有token，尝试获取当前用户信息
  //     userStore.getCurrentUserInfo();
  //   }
  // }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </PrivateRoute>
            }
          >
            {/* 根据用户角色过滤路由 */}
            <Route
              path="/"
              element={<Navigate to={routes[0]?.path} replace />}
            />
            {renderRoutes(routes)}
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      </Routes>
    </Suspense>
  );
});

export default App;
