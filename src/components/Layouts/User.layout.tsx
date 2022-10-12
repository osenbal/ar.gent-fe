import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <>
      <div>
        <p>Layout User</p>
      </div>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
