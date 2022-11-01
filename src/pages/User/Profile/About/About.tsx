import React from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import { Box, Card, IconButton, Typography, CardContent } from '@mui/material';
import { Edit } from '@mui/icons-material';

const About: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Box sx={{ position: 'relative', marginTop: 2 }}>
        <Card>
          <IconButton
            sx={{
              background: 'inherit',
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

export default About;
