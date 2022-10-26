import React, { useEffect, useState } from 'react';
import {
  AppBar,
  styled,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
  ListItemIcon,
} from '@mui/material';
import MaterialUISwitch from '../Reusable/Switch';
import { useTheme } from '@mui/material/styles';
import ColorModeContext from '@/Context/ColorMode.context';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import AddBoxIcon from '@mui/icons-material/AddBox';
import { AppRegistration, ChevronRight } from '@mui/icons-material';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const SectionToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'flex-start',
  gap: '32px',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const Navbar: React.FC = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const styleAppBar = {
    background: 'transparent',
    color: 'inherit',
    boxShadow: 'none',
    padding: '32px 0',
  };

  return (
    <>
      <AppBar style={styleAppBar} position="relative">
        <StyledToolbar>
          <SectionToolbar>
            <Typography variant="h6">AR.GENT</Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button href="/login" color="inherit">
                How it Works
              </Button>
              <Button href="/login  " color="inherit">
                Browse Job
              </Button>
            </Box>
          </SectionToolbar>

          <SectionToolbar>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SectionToolbar>
                <Button href="/login" color="inherit">
                  Login
                </Button>
                <Button href="/signup" color="inherit">
                  Sign Up
                </Button>
                <Button href="#" variant="contained">
                  Post a Job
                </Button>
                <MaterialUISwitch
                  checked={theme.palette.mode === 'dark' ? true : false}
                  onChange={colorMode.toggleColorMode}
                />
              </SectionToolbar>
            </Box>

            <IconButton
              onClick={() => setIsOpen(!isOpen)}
              color="inherit"
              aria-label="menu"
              sx={{
                display: { xs: 'block', md: 'none' },
                size: 'large',
                edge: 'start',
              }}
            >
              <MenuIcon />
            </IconButton>
          </SectionToolbar>
        </StyledToolbar>
      </AppBar>

      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
          },
          display: { xs: 'block', md: 'none' },
        }}
        variant="persistent"
        anchor="right"
        open={isOpen}
      >
        <DrawerHeader sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton onClick={() => setIsOpen(false)}>
            <ChevronRight />
          </IconButton>
          <MaterialUISwitch
            checked={theme.palette.mode === 'dark' ? true : false}
            onChange={colorMode.toggleColorMode}
          />
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton href="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="/signup">
              <ListItemIcon>
                <AppRegistration />
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton href="#">
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              <ListItemText primary="Post a Job" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export const Ribbon: React.FC = () => {
  return (
    <AppBar sx={{ background: '#4EA6B4' }} position="relative">
      <StyledToolbar
        sx={{ overflowX: { xs: 'scroll', md: 'hidden' }, width: '100%' }}
      >
        <SectionToolbar
          sx={{
            width: { xs: '100%', md: 'auto' },
          }}
        >
          <Button href="#" color="inherit">
            Find Job
          </Button>
          <Button href="#" color="inherit">
            Hire Freelancers
          </Button>
          <Button href="#" color="inherit">
            Get Ideas
          </Button>
          <Button href="#" color="inherit">
            About
          </Button>
          <Button href="#" color="inherit">
            Resources
          </Button>
        </SectionToolbar>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
