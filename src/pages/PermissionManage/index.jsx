import React, { useState, useEffect } from "react";
import { Tabs, message, Spin } from "antd";
import { observer } from "mobx-react-lite";
import { userStore } from "../../store";
import { ROLE_ID } from "../../constants/role";
import TenantManagement from "./TenantManagement";
import DepartmentManagement from "./DepartmentManagement";
import UserManagement from "./UserManagement";

const { TabPane } = Tabs;

const PermissionManage = observer(() => {
  const [activeTab, setActiveTab] = useState("tenant");

  // 根据用户角色设置默认激活的标签页
  useEffect(() => {
    if (!userStore.userInfo) {
      return;
    }

    const roleId = userStore.userInfo.role_id;
    if (roleId === ROLE_ID.SUPER_ADMIN) {
      setActiveTab("tenant");
    } else if (roleId === ROLE_ID.TENANT_ADMIN) {
      setActiveTab("department");
    } else if (roleId === ROLE_ID.DEPARTMENT_ADMIN) {
      setActiveTab("user");
    } else {
      message.warning("您没有权限访问权限管理页面");
    }
  }, [userStore.userInfo]);

  // 根据用户角色渲染不同的标签页
  const renderTabPanes = () => {
    const roleId = userStore.userInfo?.role_id;
    const tabPanes = [];

    // 超级管理员可以查看所有标签页
    if (roleId === ROLE_ID.SUPER_ADMIN) {
      tabPanes.push(
        <TabPane tab="租户管理" key="tenant">
          <TenantManagement />
        </TabPane>
      );
    }

    // 超级管理员和租户管理员可以查看部门管理
    if (roleId === ROLE_ID.SUPER_ADMIN || roleId === ROLE_ID.TENANT_ADMIN) {
      tabPanes.push(
        <TabPane tab="部门管理" key="department">
          <DepartmentManagement />
        </TabPane>
      );
    }

    // 超级管理员、租户管理员和部门管理员可以查看用户管理
    if (
      roleId === ROLE_ID.SUPER_ADMIN ||
      roleId === ROLE_ID.TENANT_ADMIN ||
      roleId === ROLE_ID.DEPARTMENT_ADMIN
    ) {
      tabPanes.push(
        <TabPane tab="用户管理" key="user">
          <UserManagement />
        </TabPane>
      );
    }

    return tabPanes;
  };

  return (
    <Tabs activeKey={activeTab} onChange={setActiveTab} destroyOnHidden>
      {renderTabPanes()}
    </Tabs>
  );
});

export default PermissionManage;
