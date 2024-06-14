import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IChallengeListRes } from '../../../interfaces/interface';
import axios from '../../../utils/axios';

const ChallengeOnboarding = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['challenge', 'admin', 'onboarding'],
    queryFn: async () => {
      const res = await axios.get(`/challenge?size=1000`);
      return res.data.data as IChallengeListRes;
    },
  });

  useEffect(() => {
    if (data) {
      navigate(`/admin/challenge/operation/${data.programList[0]?.id}/home`);
    }
  }, [data, navigate]);

  return null;
};

export default ChallengeOnboarding;
