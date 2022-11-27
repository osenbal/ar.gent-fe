import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '@/config/config';
import { useParams } from 'react-router-dom';

const FormNewPassword = () => {
  const { uniqueString } = useParams();
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [validUniqueString, setValidUniqueString] = useState<boolean>(false);

  const handleChangePassword = async (event: any) => {
    if (password) {
      const response = await fetch(
        `${BACKEND_URL}/auth/reset-password/${uniqueString}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data);
      }
      setPassword('');
    } else {
      setPassword('');
      console.log('password is empty');
    }
  };

  const checkUniqueString = async () => {
    setIsLoading(true);
    const response = await fetch(
      `${BACKEND_URL}/auth/reset-password/check/${uniqueString}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.ok) {
      setValidUniqueString(true);
      setIsLoading(false);
    } else {
      setValidUniqueString(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUniqueString();
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : validUniqueString ? (
        <>
          <h1>FormNewPassword</h1>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Input New Password"
            name="password"
            id="password"
          />

          <button onClick={handleChangePassword} type="submit">
            Submit
          </button>
        </>
      ) : (
        <p>Not Found</p>
      )}
    </>
  );
};

export default FormNewPassword;
