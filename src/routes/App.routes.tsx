import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Home from '@pages/User/Home/Home.page';
import Login from '@pages/User/Login/Login.page.user';
import Register from '@pages/User/Register/Register.page.user';
import SuccessRegister from '@/pages/User/Register/SuccessRegister.page';
import Profile from '@pages/User/Profile/PannelProfile/Profile';
import HomeLoggedIn from '@pages/User/Home/HomeLoggedIn.page';
import ProtectedRoute from '@/middleware/protectedRoute';
import GuestRoute from '@/middleware/guestRoute';
import PersistLogin from '@/middleware/persistLogin';
import ForgotPassword from '@pages/User/ForgotPassword/ForgotPassword.page';
import UserLoggedInLayout from '@/components/Layouts/UserLoggedIn.layout';
import JobDetails from '@/pages/User/Jobs/JobDetails';
import JobLayout from '@/components/Layouts/JobLayout';
import JobCreate from '@/pages/User/Jobs/JobCreate.page';
import JobControl from '@/pages/User/Jobs/JobControl';
import HelpPage from '@/pages/User/Help/Help.page';
import AuthPolicy from '@/middleware/authPolicy';
import JobList from '@/pages/User/Jobs/JobList';
import JobListProfile from '@/pages/User/Profile/PannelJob/JobListProfile';
import ProfileLayout from '@/components/Layouts/ProfileLayout';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
              <Route path="home" element={<HomeLoggedIn />} />

              <Route element={<ProfileLayout />}>
                <Route path="user/:id/profile" element={<Profile />} />
                <Route path="user/:id/job" element={<JobListProfile />} />
              </Route>

              <Route path="help" element={<HelpPage />} />

              <Route path="job/create" element={<JobCreate />} />
              <Route path="job/edit/:jobId" element={<JobControl />} />

              {/* <Route path="job/search/" element={<JobLayout />}>
                <Route index element={<JobDetails />} />
              </Route> */}
            </Route>
          </Route>
        </Route>
        {/* Catch  All Route */}
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
