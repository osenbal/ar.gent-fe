import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppSelector, useAppDispatch } from '@/hooks/redux.hook';
import { setUser } from '@/store/authSlice';
import { BACKEND_URL } from '@/config/config';
import Summary from './Summary/Summary';
import Education from './Education/Education';
import { useParams } from 'react-router-dom';
import Experience from './Experience/Experience';
import Skills from './Skills/Skills';
import PortfolioUrl from './PortfolioUrl/PortfolioUrl';

const Profile: React.FC = () => {
  const { user, userId } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);

  const getUser = async (controller: any) => {
    // fetch user from server
    fetch(`${BACKEND_URL}/user/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(setUser(data.data));
        setIsLoading(false);
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('abort');
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getUser(controller);
    return () => {
      controller.abort();
    };
  }, [id]);

  console.log(id);
  return (
    <>
      <Helmet>
        <title>Profile | ar.gent</title>
      </Helmet>

      {userId === user?._id ? <h1>My Profile</h1> : <h1>Profile</h1>}

      {isLoading ? (
        <p>Loading...</p>
      ) : !user ? (
        <p>User Not Found</p>
      ) : (
        <>
          <Summary id={id} />
          <Education />
          <Experience />
          <Skills />
          <PortfolioUrl />
        </>
      )}
    </>
  );
};

export default Profile;
