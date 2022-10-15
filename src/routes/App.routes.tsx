import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '@pages/User/Home/Home.page';
import MainLayout from '@components/Layouts/User.layout';
import Login from '@pages/User/Login/Login.page.user';
import Register from '@pages/User/Register/Register.page.user';
import SuccessRegister from '@/pages/User/Register/SuccessRegister.page';
import Profile from '@/pages/User/Profile/Profile.page';
import HomeLoggedIn from '@/pages/User/Home/HomeLoggedIn.page';
import ProtectedRoute from '@/middleware/protectedRoute';
import GuestRoute from '@/middleware/guestRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="signup-success/:username" element={<SuccessRegister />} />

        <Route path="profile/:id" element={<Profile />} />

        {/* guest */}
        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Register />} />
        </Route>

        {/* protected */}
        <Route path="home" element={<ProtectedRoute />}>
          <Route index element={<HomeLoggedIn />} />
        </Route>
      </Route>

      {/* Catch  All Route */}
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default AppRoutes;
