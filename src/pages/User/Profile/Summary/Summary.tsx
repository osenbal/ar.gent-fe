import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';

const Summary: React.FC = () => {
  const { user, userDetails } = useAppSelector((state) => state.auth);
  const [username, setUsername] = useState<string | undefined>(user?.username);
  const [avatar, setAvatar] = useState<string | undefined>(user?.avatar);
  const [banner, setBanner] = useState<string | undefined>(user?.banner);

  return (
    <>
      <img src={banner} alt="Banner" />
      <img src={avatar} alt="avatar" />
      <p>{user?.fullName}</p>
      <p>{userDetails?.address.country}</p>

      <p>{user?.about}</p>
    </>
  );
};

export default Summary;
