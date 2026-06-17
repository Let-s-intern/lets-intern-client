import { getChallengeIdApplicationsPayback } from '@/schema';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';

export const PaybackParticipantsQueryKey = 'mentorMenteePaybackParticipants';

/** /applications/payback으로 참여자 목록 조회 */
const usePaybackParticipants = (challengeId?: string) => {
  return useQuery({
    queryKey: [PaybackParticipantsQueryKey, challengeId],
    enabled: Boolean(challengeId),
    queryFn: async () => {
      const res = await axios.get(
        `/challenge/${challengeId}/applications/payback`,
        { params: { page: 0, size: 1000 } },
      );
      return getChallengeIdApplicationsPayback.parse(res.data.data);
    },
  });
};

export default usePaybackParticipants;
