import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { setUser } from '@/store/authSlice';
import { BACKEND_URL } from '@/config/config';
import {
  Drawer,
  Toolbar,
  Divider,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import NavbarLoggedIn from '@/components/Layouts/NavbarLoggedIn';

const HomeLoggedIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Helmet>
        <title>Dashboard | ar.gent</title>
      </Helmet>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Box>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam
              non autem voluptate officiis iure molestiae veniam enim, unde
              consequatur debitis suscipit nihil! Deserunt fugiat et repellendus
              impedit quia cupiditate unde!
            </p>
          </Box>
        </>
      )}
    </>
  );
};

export default HomeLoggedIn;
