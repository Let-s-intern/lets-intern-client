import dayjs from '@/lib/dayjs';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';

const getIsChallengeDone = (endDate: string) => {
  return dayjs(new Date()).isAfter(dayjs(endDate));
};

export const useChallengeProgram = () => {
  const params = useParams<{ programId: string }>();

  // 프로그램 데이터 조회
  const { data: programData } = useQuery({
    queryKey: ['challenge', params.programId, 'application'],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get(
        `/${queryKey[0]}/${queryKey[1]}/${queryKey[2]}`,
      );
      return res.data;
    },
  });

  const programEndDate = programData?.data?.endDate;
  const isChallengeDone = useMemo(() => {
    return getIsChallengeDone(programEndDate);
  }, [programEndDate]);

  return {
    programData,
    programEndDate,
    isChallengeDone,
  };
};
