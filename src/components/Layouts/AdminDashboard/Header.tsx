import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material/styles';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { asyncLogoutAdmin } from '@/store/authAdminSlice';
import {
  Box,
  Stack,
  AppBar,
  Toolbar,
  IconButton,
  MenuItem,
  Avatar,
  Typography,
  Divider,
  Popover,
} from '@mui/material';

const MENU_OPTIONS = [
  {
    label: 'Home',
    linkTo: '/admin/dashboard',
  },
  {
    label: 'Profile',
    linkTO: '/admin/profile',
  },
];

const drawerWidth = 240;
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const AccountPopover = ({
  username,
  email,
}: {
  username: string;
  email: string;
}) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(null);

  const handleOpen = (event: any) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    dispatch(asyncLogoutAdmin());
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(Boolean(open) && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src="asal" alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            top: '70px !important',
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              href={option.linkTo}
              component={'a'}
              key={option.label}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};

// ----------------------------------------------------------------------

const StyledRoot = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  [theme.breakpoints.up('md')]: {
    width: `calc(100% - ${drawerWidth + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('md')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

type props = {
  onOpenNav: () => void;
};

// --------------------------------------------------

const Header: React.FC<props> = ({ onOpenNav }) => {
  const { userAdmin } = useAppSelector((state) => state.authAdmin);

  return (
    <>
      <StyledRoot>
        <StyledToolbar>
          <IconButton
            onClick={onOpenNav}
            sx={{
              mr: 1,
              color: 'text.primary',
              display: { lg: 'none' },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
            <AccountPopover
              username={userAdmin ? userAdmin.username : ''}
              email={userAdmin ? userAdmin.email : ''}
            />
          </Stack>
        </StyledToolbar>
      </StyledRoot>
    </>
  );
};

export default Header;
