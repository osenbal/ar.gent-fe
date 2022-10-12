import React, { FC } from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout: FC = () => {
  return (
    <>
      <h1>Admin</h1>
      <Outlet />
    </>
  );
};

export default AdminLayout;
