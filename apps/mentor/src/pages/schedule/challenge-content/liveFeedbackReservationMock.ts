import type { PeriodBarData } from '../types';

export interface LiveFeedbackReservationMock {
  title: string;
  menteeName: string;
  challengeTitle: string;
  submissionStatusLabel: string;
  mentorRole: string;
  mentorCompany: string;
  mentorIndustry: string;
  phoneNumber: string;
  reservationTimeLabel: string;
  questionAnswer: string;
  mentoringStatusLabel: string;
  mentoringStatusTone: 'neutral' | 'critical';
  countdownLabel: string;
  guidebookButtons: Array<{ label: string }>;
  submitButtonLabel: string;
}

function formatKoreanTime(time: string): string {
  const [hourText, minuteText] = time.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const minuteSuffix = minute === 0 ? '' : ` ${minute}분`;

  return `${period} ${displayHour}시${minuteSuffix}`;
}

export function getLiveFeedbackReservationMock(
  bar: PeriodBarData,
): LiveFeedbackReservationMock {
  if (!bar.liveFeedback) {
    return {
      title: '예약 상세',
      menteeName: '',
      challengeTitle: bar.challengeTitle,
      submissionStatusLabel: '미제출',
      mentorRole: '기획 / PM / PO',
      mentorCompany: 'IT · 플랫폼, 금융 · 핀테크',
      mentorIndustry: 'Toss, Kakao',
      phoneNumber: '010-1234-5678',
      reservationTimeLabel: '',
      questionAnswer: '',
      mentoringStatusLabel: '미참여',
      mentoringStatusTone: 'critical',
      countdownLabel: '23시간 58분 58초 전',
      guidebookButtons: [
        { label: '자소서첨삭 피드백 가이드' },
        { label: '라이브 멘토링 피드백 가이드' },
      ],
      submitButtonLabel: '입장하기',
    };
  }

  const liveFeedback = bar.liveFeedback;
  const isCompleted = liveFeedback.status === 'completed';

  return {
    title: '예약 상세',
    menteeName: liveFeedback.menteeName,
    challengeTitle: bar.challengeTitle,
    submissionStatusLabel: isCompleted ? '제출됨' : '미제출',
    mentorRole: '기획 / PM / PO',
    mentorCompany: 'IT · 플랫폼, 금융 · 핀테크',
    mentorIndustry: 'Toss, Kakao',
    phoneNumber: '010-1234-5678',
    reservationTimeLabel: `${bar.startDate.slice(0, 4)}년 ${Number(
      bar.startDate.slice(5, 7),
    )}월 ${Number(bar.startDate.slice(8, 10))}일 ${formatKoreanTime(
      liveFeedback.startTime,
    )} ~ ${formatKoreanTime(liveFeedback.endTime)}`,
    questionAnswer:
      '추천을 받아서 렛츠 커리어 주디 매니저님의 피드백을 바탕으로 이력서를 작성해 제출했습니다. 이력서를 받고 자기소개서도 작성해서 보내드리고자 하여 이번주 내로 보내드리겠다고 했는데 작성한 자기소개서 피드백을 받고 싶어서 신청하게 되었습니다.',
    mentoringStatusLabel: isCompleted ? '참여 완료' : '미참여',
    mentoringStatusTone: isCompleted ? 'neutral' : 'critical',
    countdownLabel: '23시간 58분 58초 전',
    guidebookButtons: [
      { label: '자소서첨삭 피드백 가이드' },
      { label: '라이브 멘토링 피드백 가이드' },
    ],
    submitButtonLabel: '입장하기',
  };
}
