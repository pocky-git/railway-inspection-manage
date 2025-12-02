import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { observer } from "mobx-react-lite";
import { userStore } from "./store";
import { routes } from "./config/routes";

// 懒加载页面组件
const Login = lazy(() => import("./pages/Login"));
const Main = lazy(() => import("./pages/Main"));

// 私有路由组件，用于保护需要登录的页面
const PrivateRoute = observer(({ children }) => {
  // 使用userStore中的isLoggedIn状态
  return userStore.isLoggedIn ? children : <Navigate to="/login" replace />;
});

const App = observer(() => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        >
          {routes.map((item) => (
            <Route key={item.path} path={item.path} element={item.element} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to={routes[0].path} replace />} />
      </Routes>
    </Suspense>
  );
});

export default App;
