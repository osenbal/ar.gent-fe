import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';

const HomeLoggedIn: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      <Box>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam non
          autem voluptate officiis iure molestiae veniam enim, unde consequatur
          debitis suscipit nihil! Deserunt fugiat et repellendus impedit quia
          cupiditate unde!
        </p>
      </Box>
    </>
  );
};

export default HomeLoggedIn;
