/** 챌린지 운영 > 피드백 > 미션별 참여자 페이지
 * @todo API 연결: /api/v2/admin/challenge/{challengeId}/mission/{missionId}/feedback/attendances
 */

import { AttendanceStatus, ChallengePricePlan } from '@/schema';

const data = [
  {
    id: 1,
    title: '첫 번째 미션',
    th: 1,
    startDate: '2024-03-01T00:00:00',
    endDate: '2024-03-07T23:59:59',
    challengeOptionCode: 'FEEDBACK_A',
  },
  {
    id: 2,
    title: '두 번째 미션',
    th: 2,
    startDate: '2024-03-08T00:00:00',
    endDate: '2024-03-14T23:59:59',
    challengeOptionCode: 'FEEDBACK_B',
  },
  {
    id: 3,
    title: '세 번째 미션',
    th: 3,
    startDate: '2024-03-15T00:00:00',
    endDate: '2024-03-21T23:59:59',
    challengeOptionCode: 'FEEDBACK_C',
  },
];

interface Row {
  id: number | string;
  mentorName: string;
  name: string;
  major: string;
  wishJob: string;
  wishCompany: string;
  link: string;
  status: AttendanceStatus;
  result: 'WAITING';
  challengePricePlanType: ChallengePricePlan;
}

export default function FeedbackParticipantPage() {
  return <div>FeedbackParticipantPage</div>;
}
