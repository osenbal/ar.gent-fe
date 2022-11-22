import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material/styles';
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
  },
  {
    label: 'Profile',
  },
];

const drawerWidth = 240;
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const AccountPopover = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = (event: any) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
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
        // anchorEl={open}
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
            Jhon Doe
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            admin@gmail.com
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleClose} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};

const StyledRoot = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backgroundColor: 'inherit',
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
            <AccountPopover />
          </Stack>
        </StyledToolbar>
      </StyledRoot>
    </>
  );
};

export default Header;
