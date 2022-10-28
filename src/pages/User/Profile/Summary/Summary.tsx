import React, { useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import {
  Avatar,
  Card,
  CardContent,
  Box,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Edit, CameraAlt } from '@mui/icons-material';

const Summary: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [banner, setBanner] = useState<string | undefined>(user?.banner);

  const Banner = styled('img')({
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  });

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <Banner src={banner} alt="banner" />
        <IconButton sx={{ position: 'absolute', top: '0', right: '0' }}>
          <CameraAlt />
        </IconButton>
        <Box
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px;',
            paddingBottom: 2,
          }}
        >
          <Box sx={{ marginLeft: 2 }}>
            <Box>
              <Avatar
                sx={{
                  width: 98,
                  height: 98,
                  marginTop: -8,
                }}
                src={avatar}
                alt="avatar"
              />

              <IconButton
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 280,
                  background: '#fff',
                }}
              >
                <Edit />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: '700', marginTop: 2 }}>
                {user?.fullName}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: '500' }}>
                  {user?.address?.country}
                </Typography>
                <Link sx={{ cursor: 'pointer' }}>Contact Info</Link>
              </Box>
              <Link
                color="neutral"
                underline="hover"
                variant="h6"
                sx={{ fontWeight: '500', cursor: 'pointer' }}
              >
                Download CV
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ position: 'relative', marginTop: 2 }}>
        <Card>
          <IconButton
            sx={{
              backgroundColor: '#ffffff',
              position: 'absolute',
              top: 4,
              right: 8,
            }}
          >
            <Edit />
          </IconButton>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: '700' }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: '500' }}>
              {user?.about}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Summary;
