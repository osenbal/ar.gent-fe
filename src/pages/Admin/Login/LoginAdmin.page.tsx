import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import {
  Link,
  Container,
  Typography,
  Divider,
  Stack,
  Button,
  TextField,
} from '@mui/material';

const LoginAdmin: React.FC = () => {
  return (
    <>
      <Helmet>
        <title> Login | Admin </title>
      </Helmet>

      <Container maxWidth="sm">
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: '100vh' }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Login
          </Typography>
          <Divider sx={{ width: '100%' }} />
          <TextField
            type="email"
            label="Email"
            variant="outlined"
            sx={{ width: '100%' }}
          />

          <TextField
            label="Password"
            type="password"
            autoComplete="off"
            variant="outlined"
            sx={{ width: '100%', mt: 3 }}
          />
          <Button variant="contained" sx={{ width: '100%', mt: 3 }}>
            Login
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default LoginAdmin;
