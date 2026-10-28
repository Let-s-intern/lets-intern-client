import type { MentorApplicationStatusCode } from '@/api/mentor-application/mentorApplication';

/** 상태 표시 이름. 시안의 `접수 완료` / `검토중` / `회신완료` 대신 PRD 4장의 이름을 쓴다 */
export const STATUS_LABEL: Record<MentorApplicationStatusCode, string> = {
  CHECKING: '확인 중',
  REVIEWING: '검토 중',
  REPLIED: '회신 완료',
};

/** 진행 표시의 단계 순서 */
export const STATUS_STEPS: MentorApplicationStatusCode[] = [
  'CHECKING',
  'REVIEWING',
  'REPLIED',
];
