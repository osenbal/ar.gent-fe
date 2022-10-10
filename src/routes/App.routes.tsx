import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from '@pages/Home/Home.page';
import MainLayout from '@/components/Layouts/Main.layout';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Catch  All Route */}
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
};

export default AppRoutes;
