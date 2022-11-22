import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useMediaQuery, useTheme, styled } from '@mui/material';
import Slider from './Slider';

const APP_BAR_DESKTOP = 92;
const APP_BAR_MOBILE = 64;

const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
  maxWidth: '1980px',
});

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE,
  [theme.breakpoints.up('md')]: {
    paddingTop: APP_BAR_DESKTOP,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const AdminLayout: React.FC = () => {
  const [openNav, setOpenNav] = useState<boolean>(false);

  return (
    <>
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
