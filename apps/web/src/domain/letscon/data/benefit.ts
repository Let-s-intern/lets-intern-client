import {
  FileText,
  MessagesSquare,
  MonitorPlay,
  TicketPercent,
} from 'lucide-react';

export const LETSCON_DOCUMENT_DEADLINE = '11/13(금)';

export const LETSCON_BENEFITS = [
  {
    icon: TicketPercent,
    title: '1:1 멘토링 50% 할인 쿠폰 2장',
    body: '렛츠콘 이후, 내 상황에 맞는 1:1 멘토링을 반값에 참여 가능합니다. 현장 참여자 전원 지급합니다.',
  },
  {
    icon: MonitorPlay,
    title: '렛츠콘 자료집',
    body: '컨퍼런스 VOD, 강의자료, QNA 질문&답변 정리본. 현장 참여자 전원 제공합니다.',
  },
  {
    icon: MessagesSquare,
    title: '현장 질문 우선',
    body: 'Q&A 시간에는 현장 질문을 먼저 받은 뒤,\n온라인 질문에 답변합니다.',
  },
];

export const LETSCON_FEEDBACK_BENEFIT = {
  icon: FileText,
  title: '무료 서류 Live 피드백',
  lines: [
    '내 자소서·이력서·포트폴리오에 대해 멘토의 피드백을 받아보세요.',
    `현장 참여자에 한해 ${LETSCON_DOCUMENT_DEADLINE}까지 서류를 제출할 수 있습니다. 제출된 서류 중 일부를 선정해 세션 중 40분간 공개 피드백을 진행합니다.`,
  ],
};

export const LETSCON_FEEDBACK_STEPS = [
  {
    title: '제출',
    body: `신청 완료 후 받은 링크로 ${LETSCON_DOCUMENT_DEADLINE}까지 서류 1종 제출`,
  },
  { title: '선정', body: '제출 서류 중 피드백이 필요한 서류 선정' },
  { title: '현장 피드백', body: '세션 중 40분, 멘토가 선정작을 공개 피드백' },
];

export const LETSCON_FEEDBACK_DETAILS = [
  { label: '대상', value: '오프라인 신청자' },
  { label: '제출 서류', value: '자기소개서·이력서·포트폴리오 중 1종' },
  {
    label: '개인정보',
    value: '이름·학교·연락처 등 신상 정보는 모두 가린 뒤 피드백을 진행합니다',
  },
];
