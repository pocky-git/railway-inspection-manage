import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import AdminLayout from "../../components/Layout";

const Main = observer(() => {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
});

export default Main;
