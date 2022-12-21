import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from '@pages/User/Home/Home.page';
import Login from '@pages/User/Login/Login.page.user';
import Register from '@pages/User/Register/Register.page.user';
import SuccessRegister from '@/pages/User/Register/SuccessRegister.page';
import Profile from '@/pages/User/Profile/PanelProfile/Profile.page';
import ProtectedRoute from '@/middleware/protectedRoute';
import GuestRoute from '@/middleware/guestRoute';
import PersistLogin from '@/middleware/persistLogin';
import ForgotPassword from '@pages/User/ForgotPassword/ForgotPassword.page';
import UserLoggedInLayout from '@/components/Layouts/UserDahboard/UserLoggedIn.layout';
import JobCreatePage from '@/pages/User/Jobs/JobCreate.page';
import JobControlPage from '@/pages/User/Jobs/JobControl.page';
import HelpPage from '@/pages/User/Help/Help.page';
import JobListProfile from '@/pages/User/Profile/PanelJob/JobListProfile.page';
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
import UserApplication from '@/pages/User/Profile/PanelUserApplication/UserApplication.page';
import JobDetailsPage from '@/pages/User/Jobs/JobDetails.page';
import JobNearlyPage from '@/pages/User/Jobs/JobNearly.page';
import JobSearchPage from '@/pages/User/Jobs/JobSearch.page';
import UserReportPage from '@/pages/Admin/UserReport/UserReport.page';
import UserReportDetail from '@/pages/Admin/UserReport/UserReportDetail.page';
import JobListPage from '@/pages/Admin/Job/JobList.page';
import JobDetailPage from '@/pages/Admin/Job/JobDetail.page';

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
            <Route path="/admin/jobs" element={<JobListPage />} />
            <Route path="/admin/reports" element={<UserReportPage />} />
            <Route
              path="/admin/reports/:reportId"
              element={<UserReportDetail />}
            />
            <Route path="/admin/job/:jobId" element={<JobDetailPage />} />
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
              <Route path="jobs/search" element={<JobSearchPage />} />
              <Route path="nearly/jobs" element={<JobNearlyPage />} />
              <Route element={<ProfileLayout />}>
                <Route path="user/:id/profile" element={<Profile />} />
                <Route path="user/:id/job" element={<JobListProfile />} />
                <Route
                  path="user/:id/applications"
                  element={<UserApplication />}
                />
              </Route>
              <Route path="job/create" element={<JobCreatePage />} />
              <Route path="job/edit/:jobId" element={<JobControlPage />} />
              <Route path="job/detail/:jobId" element={<JobDetailsPage />} />
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
