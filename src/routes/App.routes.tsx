import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from '@pages/User/Home/Home.page';
import Login from '@pages/User/Login/Login.page.user';
import Register from '@pages/User/Register/Register.page.user';
import SuccessRegister from '@/pages/User/Register/SuccessRegister.page';
import Profile from '@pages/User/Profile/PannelProfile/Profile';
import ProtectedRoute from '@/middleware/protectedRoute';
import GuestRoute from '@/middleware/guestRoute';
import PersistLogin from '@/middleware/persistLogin';
import ForgotPassword from '@pages/User/ForgotPassword/ForgotPassword.page';
import UserLoggedInLayout from '@/components/Layouts/UserDahboard/UserLoggedIn.layout';
import JobCreate from '@/pages/User/Jobs/JobCreate.page';
import JobControl from '@/pages/User/Jobs/JobControl';
import HelpPage from '@/pages/User/Help/Help.page';
import JobListProfile from '@/pages/User/Profile/PannelJob/JobListProfile';
import ProfileLayout from '@/components/Layouts/ProfileLayout';
import Dashboard from '@/pages/User/Home/Dashboard.page';
import LoginAdmin from '@/pages/Admin/Login/LoginAdmin.page';
import DashboardAdmin from '@/pages/Admin/Dashboard/DashboardAdmin.page';
import AdminLayout from '@/components/Layouts/AdminDashboard/Admin.layout';
import UserList from '@/pages/Admin/Users/UserList.page';
import ProtectedAdmin from '@/middleware/Admin/protectedAdmin';
import FormNewPassword from '@/pages/User/ForgotPassword/FormNewPassword.page';
import NotFound from '@/pages/NotFound/NotFound.page';
import VerifyEmailPage from '@/pages/User/VerifyEmail/VerifyEmail.page';
import SuccessResetPassword from '@/pages/User/ForgotPassword/SuccessResetPassword';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Admin */}
        <Route path="/admin/login" element={<LoginAdmin />} />

        <Route element={<ProtectedAdmin />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/users" element={<UserList />} />
          </Route>
        </Route>

        {/* User */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:uniqueString"
          element={<FormNewPassword />}
        />
        <Route
          path="/success-reset-password"
          element={<SuccessResetPassword />}
        />
        <Route path="/verify/:userId" element={<VerifyEmailPage />} />

        <Route element={<GuestRoute />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Register />} />
          <Route
            path="signup-success/:username"
            element={<SuccessRegister />}
          />
        </Route>
        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLoggedInLayout />}>
              <Route path="jobs" element={<Dashboard />} />
              <Route element={<ProfileLayout />}>
                <Route path="user/:id/profile" element={<Profile />} />
                <Route path="user/:id/job" element={<JobListProfile />} />
              </Route>
              <Route path="job/create" element={<JobCreate />} />
              <Route path="job/edit/:jobId" element={<JobControl />} />
              <Route path="help" element={<HelpPage />} />
            </Route>
          </Route>
        </Route>
        {/* Catch  All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
