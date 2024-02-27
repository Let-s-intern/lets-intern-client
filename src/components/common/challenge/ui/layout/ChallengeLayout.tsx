import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import NavBar from './NavBar';
import axios from '../../../../../utils/axios';

const ChallengeLayout = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [isValidUser, setIsValidUser] = useState<boolean>();

  useQuery({
    queryKey: ['application', params.programId],
    queryFn: async () => {
      const res = await axios.get(`/application/${params.programId}`);
      const data = res.data;
      setIsValidUser(data.valid);
      return data;
    },
  });

  const isLoading = isValidUser === undefined;

  useEffect(() => {
    if (isLoading) return;
    if (!isValidUser) navigate('/');
  }, [isValidUser]);

  if (isLoading || !isValidUser) {
    return <></>;
  }

  return (
    <div className="px-6 py-6">
      <div className="mx-auto flex max-w-[1036px]">
        <NavBar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChallengeLayout;
