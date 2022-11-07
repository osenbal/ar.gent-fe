import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useAppSelector } from '@/hooks/redux.hook';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MaterialUISwitch from '../Reusable/Switch';
import { ColorModeContext } from '@/Context/ColorMode.context';

const drawerWidth = 240;

const Main = styled('main')<{
  open?: boolean;
  uptab?: boolean;
}>(({ theme, open, uptab }) => ({
  flexGrow: 1,
  maxWidth: '1980px',
  padding: theme.spacing(3),
  ...(!uptab && {
    padding: `${theme.spacing(3)} 8px`,
  }),
  ...(open
    ? {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
      }
    : {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
      }),
  ...(uptab
    ? {
        marginLeft: 0,
        margin: '0 auto',
      }
    : {
        marginLeft: `-${drawerWidth}px`,
      }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  widthScreen?: number;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface DrawerHeaderProps extends MuiAppBarProps {
  uptab?: boolean;
}

const DrawerHeader = styled('div')<DrawerHeaderProps>(({ theme, uptab }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
  ...(uptab && {
    display: 'none',
  }),
}));

export default function UserLoggedInLayout() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const [open, setOpen] = React.useState(upTabScreen);
  const { userId } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar sx={{ display: { xs: 'block', md: 'none' } }} position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            AR.GENT
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open || upTabScreen}
      >
        <DrawerHeader>
          <IconButton
            sx={{ display: { xs: 'block', md: 'none' } }}
            onClick={handleDrawerClose}
          >
            {theme.direction === 'ltr' ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
          <Typography
            sx={{ display: { xs: 'none', md: 'block' }, margin: '0 auto' }}
            variant="h5"
          >
            AR.GENT
          </Typography>
        </DrawerHeader>
        <Divider />
        <List>
          {/* Home */}
          <ListItem
            component={NavLink}
            to="/home"
            disablePadding
            selected={'/home' === location.pathname}
          >
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>
          <Divider />

          {/* Profile */}
          <ListItem disabled>
            <Typography variant="body1">Profile</Typography>
          </ListItem>
          <ListItem
            component={NavLink}
            to={`/profile/${userId}`}
            disablePadding
            selected={
              `/profile/${userId}` === location.pathname &&
              `${userId}` === location.pathname.split('/')[2]
            }
          >
            <ListItemButton>
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            component={NavLink}
            to="/job/create"
            selected={'/job/create' === location.pathname}
          >
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Create Job Free" />
            </ListItemButton>
          </ListItem>
          <Divider />

          {/* Account */}
          <ListItem disabled>
            <Typography variant="body1">Account</Typography>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Help ?" />
            </ListItemButton>
          </ListItem>
          <Divider />

          {/* Sign out */}
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <Box sx={{ margin: '0 auto', mt: 1 }}>
              <MaterialUISwitch
                checked={theme.palette.mode === 'dark' ? true : false}
                onChange={colorMode.toggleColorMode}
              />
            </Box>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open} uptab={upTabScreen}>
        <DrawerHeader uptab={upTabScreen} />
        <Outlet />
      </Main>
    </Box>
  );
}
