import React, { useEffect, useState } from 'react';
import { EMAIL_REGEX } from '@/constant/_regex';
import { isEmpty } from '@utils/utils';
import { Helmet } from 'react-helmet-async';
import { useAppDispatch } from '@hooks/redux.hooks';
import { loginUser } from '@store/authSlice';
import { ToastContainer, toast } from 'react-toastify';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>('');
  const [validEmail, setValidEmail] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (!validEmail || isEmpty(password)) {
      toast.error(`invalid email or password`, {
        position: 'bottom-left',
        theme: 'dark',
      });
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>

      <ToastContainer />
      <div>
        <h1>Login</h1>

        <form action="POST">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <br />

          <button type="submit" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
