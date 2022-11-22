import React from 'react';
import { NavLink } from 'react-router-dom';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import WorkIcon from '@mui/icons-material/Work';
import ReportIcon from '@mui/icons-material/Report';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
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
  ListItemText,
} from '@mui/material';

const drawerWidth = 240;
const MENU_OPTIONS = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: <InsertChartIcon />,
  },
  {
    label: 'Users',
    path: '/admin/users',
    icon: <PersonPinIcon />,
  },
  {
    label: 'Jobs',
    path: '/admin/jobs',
    icon: <WorkIcon />,
  },
  {
    label: 'Reports',
    path: '/admin/reports',
    icon: <ReportIcon />,
  },
];

type props = {
  openNav: boolean;
  onClosedNav: () => void;
};

const Slider: React.FC<props> = ({ openNav, onClosedNav }) => {
  const theme = useTheme();
  const upTabScreen: boolean = useMediaQuery(theme.breakpoints.up('md'));

  const renderContent = (
    <>
      {/* <DrawerHeader /> */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 3,
          marginTop: 2,
        }}
      >
        <AdminPanelSettingsIcon sx={{ width: 52, height: 52 }} />
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
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />

          <Typography sx={{ mb: 0 }} variant="body1" gutterBottom>
            Admin Jhon
          </Typography>
        </CardContent>
      </Card>

      {/* <DrawerContent /> */}
      <List sx={{ mt: 4, px: 2 }}>
        {MENU_OPTIONS.map((option, index) => (
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
