'use client';

/**
 * 분할 패널 진입 아이콘 — 어느 쪽에 열리는지를 분할선 위치로 표현한다.
 * 서면(MenteeInfo)·라이브(LiveFeedbackReservationModal) 양쪽이 공유한다.
 */

/** 왼쪽 분할 패널(제출물·경험) */
export const SidePanelIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="3"
      width="12"
      height="10"
      rx="1.5"
      stroke="#4D55F5"
      strokeWidth="1.2"
    />
    <path d="M6.5 3V13" stroke="#4D55F5" strokeWidth="1.2" />
  </svg>
);

/**
 * 연필 — "피드백 작성" 진입을 직관적으로 표시.
 * 다른 진입 아이콘과 같은 primary 색을 쓴다(혼자 회색이면 비활성으로 읽힌다).
 */
export const PencilIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M11.3 2.4a1.3 1.3 0 0 1 1.9 0l.4.4a1.3 1.3 0 0 1 0 1.9l-7.4 7.4-2.7.8.8-2.7 7-7.8Z"
      stroke="#4D55F5"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <path d="M10.6 3.5l1.9 1.9" stroke="#4D55F5" strokeWidth="1.2" />
  </svg>
);

/** 눈 — 수정 불가(제출 완료) 상태의 "보기" 진입 표시. */
export const EyeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M1.8 8c1.4-2.6 3.6-4 6.2-4s4.8 1.4 6.2 4c-1.4 2.6-3.6 4-6.2 4s-4.8-1.4-6.2-4Z"
      stroke="#4D55F5"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="1.8" stroke="#4D55F5" strokeWidth="1.2" />
  </svg>
);

/** 오른쪽 분할 패널(사전 질문) — 위 아이콘의 좌우 대칭 */
export const RightPanelIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect
      x="2"
      y="3"
      width="12"
      height="10"
      rx="1.5"
      stroke="#4D55F5"
      strokeWidth="1.2"
    />
    <path d="M9.5 3V13" stroke="#4D55F5" strokeWidth="1.2" />
  </svg>
);
