import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '@pages/User/Home/Home.page';
import MainLayout from '@components/Layouts/User.layout';
import Login from '@pages/User/Login/Login.page.user';
import Register from '@pages/User/Register/Register.page.user';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />

        <Route />
      </Route>

      {/* Catch  All Route */}
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default AppRoutes;
