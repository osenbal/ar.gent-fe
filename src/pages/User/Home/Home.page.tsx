import React from 'react';
import { Ribbon } from '@/components/Layouts/Navbar';
import { Box, Container, Typography, Button } from '@mui/material';
import Navbar from '@/components/Layouts/Navbar';
import { Helmet } from 'react-helmet-async';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Home | ar.gent</title>
      </Helmet>

      <Navbar />

      <Ribbon />
      <main>
        <Container style={{ minHeight: '100vh' }} maxWidth="lg">
          <Typography
            variant="h3"
            sx={{ marginTop: { xs: '62px', md: '278px' } }}
            maxWidth="450px"
            color="#22879D"
          >
            Tempat ini berisi jargon dari AR.GENT
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              marginTop: '32px',
              rowGap: '24px',
              columnGap: '62px',
            }}
          >
            <Button
              sx={{ width: { xs: '100%', sm: 'auto' }, background: '#F93F98' }}
              variant="contained"
            >
              Hire a Freelancer
            </Button>
            <Button
              sx={{ width: { xs: '100%', sm: 'auto' }, background: '#1EC776' }}
              variant="contained"
            >
              Earn Money Freelancing
            </Button>
          </Box>
        </Container>
      </main>
    </>
  );
};

export default Home;
