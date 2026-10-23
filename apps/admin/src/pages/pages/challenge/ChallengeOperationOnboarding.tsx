import { challengeSchema } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import {
  CHALLENGE_OPERATION_TABS,
  challengeOperationTabPath,
} from '@/pages/challenge/ui/challengeOperationTabs';

/** ?tab= 이 운영 탭 id 면 그 탭, 없거나 모르는 값이면 홈 */
const tabOf = (tab: string | null) =>
  CHALLENGE_OPERATION_TABS.find(({ id }) => id === tab)?.id ?? 'home';

const ChallengeOnboarding = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = tabOf(searchParams.get('tab'));

  const { data } = useQuery({
    queryKey: ['challenge', 'admin'],
    queryFn: async () => {
      const res = await axios.get(`/challenge?size=1000`);
      return challengeSchema.parse(res.data.data);
      // return challenges.parse(res.data.data);
    },
  });

  useEffect(() => {
    if (data) {
      navigate(challengeOperationTabPath(data.programList[0]?.id, tab));
    }
  }, [data, navigate, tab]);

  return null;
};

export default ChallengeOnboarding;
