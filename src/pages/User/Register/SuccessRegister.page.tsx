import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SuccessRegister: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Success Register | ar.gent</title>
      </Helmet>

      <h1>Success Register</h1>
      <p>Check your email inbox for validate email</p>
      <Link to="/login">Login</Link>
    </>
  );
};

export default SuccessRegister;
