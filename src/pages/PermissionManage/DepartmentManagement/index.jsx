import { PlusOutlined } from "@ant-design/icons";
import { ProTable, PageContainer } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useRef } from "react";
import { observer } from "mobx-react-lite";
import {
  getDepartments,
  deleteDepartment,
} from "../../../service/departmentService";
import { getColumns } from "./columns";
import AddDepartmentModal from "./AddDepartmentModal";
import userStore from "../../../store/userStore";

const DepartmentManagement = observer(() => {
  const actionRef = useRef();

  // 删除部门
  const handleDeleteDepartment = async (id) => {
    try {
      const response = await deleteDepartment(id);

      if (response.code === 200) {
        message.success("部门删除成功");
        actionRef.current?.reload?.();
      }
    } catch (error) {
      console.error("删除部门失败:", error);
    }
  };

  const columns = getColumns({
    handleDeleteDepartment,
    role_id: userStore.userInfo?.role_id,
  });

  return (
    <PageContainer
      header={{
        title: "部门管理",
        ghost: true,
        breadcrumb: {
          items: [
            {
              path: "",
              title: "部门管理",
            },
            {
              path: "",
              title: "列表",
            },
          ],
        },
      }}
    >
      <ProTable
        options={false}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const { current, ...rest } = params;
          return getDepartments({
            page: current,
            ...rest,
          }).then((res) => ({
            data: res?.data?.list || [],
            page: res?.data?.page || 1,
            total: res?.data?.total || 0,
          }));
        }}
        rowKey="_id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <AddDepartmentModal onFinish={() => actionRef.current?.reload?.()} />,
        ]}
      />
    </PageContainer>
  );
});

export default DepartmentManagement;
