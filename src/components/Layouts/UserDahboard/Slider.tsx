import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from '@/Context/ColorMode.context';
import { useAppSelector } from '@/hooks/redux.hook';
import MaterialUISwitch from '../../Reusable/Switch';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IUser from '@/interfaces/user.interface';
import {
  useMediaQuery,
  useTheme,
  Box,
  Drawer,
  List,
  Card,
  CardContent,
  Typography,
  Avatar,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Divider,
  ListItemText,
} from '@mui/material';

const drawerWidth = 240;

const MENU_OPTIONS = (userId: string) => [
  {
    label: 'Home',
    path: '/jobs',
    icon: <HomeIcon />,
  },
  {
    label: 'My Profile',
    path: `/user/${userId}/profile`,
    icon: <AccountBoxIcon />,
  },
  {
    label: 'Create Job',
    path: '/job/create',
    icon: <AddBoxIcon />,
  },
  {
    label: 'Help',
    path: '/help',
    icon: <HelpCenterIcon />,
  },
];

type props = {
  openNav: boolean;
  user: IUser | null;
  onClosedNav: () => void;
  handleLogout: () => void;
};

// ------------------------------------------

const Slider: React.FC<props> = ({
  openNav,
  onClosedNav,
  handleLogout,
  user,
}) => {
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));
  const colorMode = useContext(ColorModeContext);
  const { userId } = useAppSelector((state) => state.auth);

  const renderContent = (
    <>
      {/* <DrawerHeader /> */}
      <div>
        <Typography variant="h5" noWrap sx={{ textAlign: 'center', mt: 5 }}>
          AR.GENT
        </Typography>
      </div>

      <Card
        sx={{
          boxShadow: 'none',
          backgroundColor: 'inherit',
          mx: 1,
          mt: 1,
          borderRadius: 2,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            gap: '10px',
            p: 2,
            '&:last-child': {
              paddingBottom: 2,
            },
          }}
        >
          <Avatar alt="Remy Sharp" src={user?.avatar} />

          <Typography sx={{ mb: 0 }} variant="body1" gutterBottom>
            {user?.username}
          </Typography>
        </CardContent>
      </Card>

      {/* <DrawerContent /> */}
      <List sx={{ mt: 4, px: 2 }}>
        <ListItem disablePadding sx={{ mb: 4 }}>
          <Box sx={{ margin: '0 auto' }}>
            <MaterialUISwitch
              checked={theme.palette.mode === 'dark' ? true : false}
              onChange={colorMode.toggleColorMode}
            />
          </Box>
        </ListItem>

        {MENU_OPTIONS(userId).map((option, index) => (
          <ListItem
            sx={{
              borderRadius: 2,
              '&.active': {
                color: 'text.primary',
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightBold',
              },
            }}
            key={index}
            component={NavLink}
            to={option.path}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText secondary={option.label} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider />

        <ListItem disablePadding onClick={handleLogout} sx={{ mt: 4 }}>
          <ListItemButton>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <>
      <Box
        component="nav"
        sx={{
          flexShrink: { md: 0 },
          width: { md: drawerWidth },
        }}
      >
        {upTabScreen ? (
          <Drawer
            open
            variant="permanent"
            PaperProps={{
              sx: {
                width: drawerWidth,
                bgcolor: 'background.default',
                borderRightStyle: 'dashed',
              },
            }}
            anchor="left"
          >
            {renderContent}
          </Drawer>
        ) : (
          <Drawer
            open={openNav}
            onClose={onClosedNav}
            PaperProps={{
              sx: {
                width: drawerWidth,
              },
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {renderContent}
          </Drawer>
        )}
      </Box>
    </>
  );
};

export default Slider;
