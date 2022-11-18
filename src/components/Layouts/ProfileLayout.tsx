import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector } from '@/hooks/redux.hook';
import { NavLink, Outlet } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { useLocation, useParams } from 'react-router-dom';

const ProfileLayout: React.FC = () => {
  const { userId } = useAppSelector((state) => state.auth);
  const { id } = useParams();
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>Profile | ar.gent</title>
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'space-around', md: 'center' },
        }}
      >
        <NavLink style={{ textDecoration: 'none' }} to={`/user/${id}/profile`}>
          <Button
            sx={
              location.pathname === `/user/${id}/profile`
                ? {
                    fontWeight: 700,
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }
                : {
                    fontWeight: 400,
                    fontSize: '16  px',
                    textDecoration: 'none',
                  }
            }
          >
            Profile
          </Button>
        </NavLink>
        <NavLink style={{ textDecoration: 'none' }} to={`/user/${id}/job`}>
          <Button
            sx={
              location.pathname === `/user/${id}/job`
                ? {
                    fontWeight: 700,
                    fontSize: '16px',
                    textDecoration: 'underline',
                  }
                : { fontWeight: 400, fontSize: '16px', textDecoration: 'none' }
            }
          >
            Job
          </Button>
        </NavLink>
      </Box>

      <Outlet />
    </>
  );
};

export default ProfileLayout;
