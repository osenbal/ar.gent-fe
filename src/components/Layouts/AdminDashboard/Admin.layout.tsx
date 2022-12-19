import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import { styled } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import Slider from './Slider';
import { BACKEND_URL } from '@/config/config';
import { setUserAdmin } from '@/store/authAdminSlice';

const APP_BAR_DESKTOP = 92;
const APP_BAR_MOBILE = 64;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  maxWidth: '1980px',
  margin: '0 auto',
});

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100vh',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const AdminLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const [openNav, setOpenNav] = useState<boolean>(false);
  const { adminId } = useAppSelector((state) => state.authAdmin);

  const getCurrentAdmin = async () => {
    const response = await fetch(`${BACKEND_URL}/admin/${adminId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      dispatch(setUserAdmin(data.data));
    } else {
      console.log('error');
    }
  };

  useEffect(() => {
    getCurrentAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <ToastContainer />
      <StyledRoot>
        <Header onOpenNav={() => setOpenNav(true)} />
        {/* slider */}
        <Slider openNav={openNav} onClosedNav={() => setOpenNav(false)} />

        {/* header */}
        <Main>
          <Outlet />
        </Main>
      </StyledRoot>
    </>
  );
};

export default AdminLayout;
