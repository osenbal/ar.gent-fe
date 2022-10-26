import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hook';

const Education: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {}, []);

  return <div>Education</div>;
};

export default Education;
