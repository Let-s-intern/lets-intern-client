import { http, HttpResponse } from 'msw';

import {
  LIVE_MENTOR_CARDS,
  LIVE_MENTOR_DETAILS,
  LIVE_MENTORING_SETTINGS,
  LIVE_MENTORING_SLOTS,
  LIVE_MENTORING_SLOTS_BY_MENTOR,
  LIVE_MENTORING_TEMPLATE,
  OPENING_HISTORY,
  getPriceByDuration,
  mentoringTitleFor,
  type LiveMentorCard,
  type LiveMentoringCategory,
  type LiveMentoringDuration,
  type LiveMentoringSlot,
  type LiveMentoringTemplate,
} from './data/liveMentoring';

/**
 * MSW 핸들러 — 두 QA 시나리오를 **하나의 공유 핸들러 배열**로 통합한다.
 *
 * 두 시나리오는 챌린지 ID 네임스페이스가 분리되어(라이브=1·2 legacy, 서면 경험정리=9901≥230)
 * 겹치는 라우트(`challenge-mentor`, `mission/feedback`, `attendances/mentee`)는
 * `challengeId`로 분기해 데이터 오염 없이 공존한다. 그 외 요청은
 * `onUnhandledRequest: 'bypass'`로 BE 그대로 통과.
 *
 * ── 시나리오 A) Jitsi 라이브 피드백 통합 QA (챌린지 1·2) ──────────────
 *   라이브 피드백 1건이 양쪽(멘티/멘토)에 "예약 확정" 상태로 보이게 하고,
 *   먼저 입장한 쪽이 등록한 회의실로 양쪽이 수렴(데드락 방지)하는 흐름을 재현.
 *
 * ── 시나리오 B) 멘토 서면 피드백 "경험정리형 제출물" QA (챌린지 9901) ──
 *   피드백 캘린더 → 서면 피드백 카드 → 모달에서 제출 유형별 동작 비교.
 *     1. 김경험 — 경험정리형 제출 (link 없음) → 경험 목록 서브모달
 *     2. 이링크 — 링크형 제출 (노션 URL)     → 외부 링크 동작 (회귀 확인)
 *     3. 박빈손 — 제출됨인데 link·경험 모두 없음 → "제출물 없음" 안내
 *     4. 최미제출 — 미제출(ABSENT)           → 경험 조회 API 호출 금지 확인
 *   인증(signin/is-mentor/user)도 mock이라 실 BE 없이 단독 실행 가능 —
 *   로그인 화면에서 아무 이메일/비밀번호나 입력하면 통과된다.
 *
 * 활성화: `pnpm dev:mock`(또는 dev:mock:web / dev:mock:mentor)으로 띄울 때만.
 * URL 매칭: 와일드카드 prefix(asterisk + slash) 패턴으로 axios baseURL 무관.
 */

/** 양측이 같은 방으로 수렴하기 위한 단일 feedbackId (라이브 피드백 QA) */
export const MOCK_FEEDBACK_ID = 999999;

/** challengeId >= 230 → 신규 /mentee 엔드포인트 경로를 타도록 큰 값 사용 (서면 경험정리 QA) */
export const MOCK_CHALLENGE_ID = 9901;
export const MOCK_MISSION_ID = 77001;

/** mock 회의실 방 이름 — PATCH 로 받은 base 와 합성(BE 의 base + meetingRoom 합성 모사). */
const MOCK_MEETING_ROOM = 'letscareer-mock-room-9z9z9z';

/**
 * 입장 시 `PATCH /feedback/{id}/meeting-url` 로 등록된 회의실 URL 을 feedbackId 별로 보관.
 *
 * MSW 핸들러는 무상태라 기본적으로 PATCH 결과가 다음 GET 에 반영되지 않는다. 이 스토어로
 * **먼저 입장한 쪽(멘토 or 멘티)이 등록하면 이후 양쪽 상세 조회가 같은 meetingUrl 을 받아**
 * 동일 방으로 수렴(입장 순서 무관 = 데드락 방지)하는 흐름을 수동 QA 에서 재현한다.
 */
const meetingUrlStore = new Map<number, string>();

const MOCK_MENTOR = {
  nickname: '테스트 멘토',
  introduction: '안녕하세요. Jitsi 통합 QA용 mock 멘토입니다.',
  profileImgUrl: 'https://avatars.githubusercontent.com/u/1?v=4',
};

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
const isoMissionStart = new Date(now.getTime() - 7 * DAY_MS).toISOString();
const isoMissionEnd = new Date(now.getTime() + 14 * DAY_MS).toISOString();
/** 시작 5분 후 → T-10 룰로 즉시 활성화 */
// QA 입장창을 넉넉히 연다: 1시간 전 시작 ~ 12시간 후 종료 → 항상 "진행 중"이라
// 멘토(T-20 게이팅)·멘티 모두 입장 버튼이 활성. (종료 후 동작은 completedFeedbackList 로 확인)
const reservationStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
const reservationEnd = new Date(
  now.getTime() + 12 * 60 * 60 * 1000,
).toISOString();

/** `now` 기준 상대 시각 ISO. 캘린더 QA 가 항상 이번 주를 보게 하려고 고정 날짜를 쓰지 않는다. */
const fromNow = (ms: number) => new Date(now.getTime() + ms).toISOString();

/**
 * (멘토) 1대1 라이브 멘토링 예약 목록 mock — 전부 결제 완료 확정(CONFIRMED) 건이다.
 *
 * 1번은 라이브 피드백 QA 예약(`reservationStart`)과 같은 시간대에 놓아, 캘린더에서
 * 라이브 피드백 카드와 1대1 카드가 겹칠 때 둘 다 보이는지 눈으로 확인할 수 있게 했다.
 * 제출 여부(질문·전달 파일)는 세 조합(둘 다·질문만·둘 다 없음)을 모두 만든다.
 *
 * 4~6번은 상세(질문·첨부 본문) QA 전용이다. 로컬 DB 에는 `FILE` 첨부도 동의 미체크 건도
 * 하나도 없어 목이 유일한 검증 수단이라, 첨부 종류와 동의 조합을 여기서 만든다.
 * 상세 응답은 아래 `MENTOR_LIVE_MENTORING_RESERVATION_DETAILS` 가 이 목록에서
 * 예약 정보를 그대로 가져다 쓴다 — 두 응답의 멘티 이름·시각이 어긋나지 않는다.
 */
const MENTOR_LIVE_MENTORING_RESERVATIONS = [
  {
    applicationId: 91001,
    menteeId: 51001,
    menteeName: '김일대',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 60,
    reservationStartAt: reservationStart,
    reservationEndAt: fromNow(0),
    status: 'CONFIRMED' as const,
    questionWritten: true,
    attachmentSubmitted: true,
    createDate: deriveCreateDate(reservationStart, 3),
  },
  {
    applicationId: 91002,
    menteeId: 51002,
    menteeName: '박멘티',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 30,
    reservationStartAt: fromNow(DAY_MS + 2 * 60 * 60 * 1000),
    reservationEndAt: fromNow(DAY_MS + 2.5 * 60 * 60 * 1000),
    status: 'CONFIRMED' as const,
    questionWritten: true,
    attachmentSubmitted: false,
    createDate: deriveCreateDate(reservationStart, 6),
  },
  {
    applicationId: 91003,
    menteeId: 51003,
    menteeName: '최준비',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 60,
    reservationStartAt: fromNow(3 * DAY_MS + 5 * 60 * 60 * 1000),
    reservationEndAt: fromNow(3 * DAY_MS + 6 * 60 * 60 * 1000),
    status: 'CONFIRMED' as const,
    questionWritten: false,
    attachmentSubmitted: false,
    createDate: deriveCreateDate(reservationStart, 9),
  },
  {
    applicationId: 91004,
    menteeId: 51004,
    menteeName: '정링크',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 30,
    reservationStartAt: fromNow(4 * DAY_MS + 3 * 60 * 60 * 1000),
    reservationEndAt: fromNow(4 * DAY_MS + 3.5 * 60 * 60 * 1000),
    status: 'CONFIRMED' as const,
    questionWritten: true,
    attachmentSubmitted: true,
    createDate: deriveCreateDate(reservationStart, 11),
  },
  {
    applicationId: 91005,
    menteeId: 51005,
    menteeName: '한파일',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 60,
    reservationStartAt: fromNow(5 * DAY_MS + 2 * 60 * 60 * 1000),
    reservationEndAt: fromNow(5 * DAY_MS + 3 * 60 * 60 * 1000),
    status: 'CONFIRMED' as const,
    questionWritten: true,
    attachmentSubmitted: true,
    createDate: deriveCreateDate(reservationStart, 12),
  },
  {
    applicationId: 91006,
    menteeId: 51006,
    menteeName: '오비동의',
    productName: '자소서 실전 첨삭 멘토링',
    durationMinutes: 30,
    reservationStartAt: fromNow(6 * DAY_MS + 7 * 60 * 60 * 1000),
    reservationEndAt: fromNow(6 * DAY_MS + 7.5 * 60 * 60 * 1000),
    status: 'CONFIRMED' as const,
    questionWritten: true,
    /** 첨부를 내긴 냈다. 멘토 전달에 동의하지 않았을 뿐이라 목록 표기는 "제출" 이다. */
    attachmentSubmitted: true,
    createDate: deriveCreateDate(reservationStart, 15),
  },
];

/** 상세 mock 중 예약 정보를 뺀 나머지 — 멘티가 낸 질문·첨부. */
interface MentorLiveMentoringSubmission {
  /** 백필 전 기존 행은 서버가 null 을 내린다. 아래 91003 이 그 경우다. */
  mentoringCategory: 'PERSONAL_STATEMENT' | 'RESUME' | 'PORTFOLIO' | null;
  questionDeferred: boolean;
  questionContent: string | null;
  attachmentType: 'NONE' | 'FILE' | 'URL';
  attachmentUrl: string | null;
  mentorShareAgreed: boolean;
}

/**
 * 목록의 같은 건에서 예약 정보를 가져와 제출물을 얹는다. 두 응답이 같은 값을 말하게 하려는
 * 것이다 — 상세를 따로 적어 두면 목록에서 연 모달이 다른 시각을 보여준다.
 */
/** 출석 상태 — 서버 `FeedbackAttendanceStatus` 와 같은 값이다. */
type LiveMentoringAttendance = 'PENDING' | 'PRESENT' | 'ABSENT';

const mentorLiveMentoringDetail = (
  applicationId: number,
  submission: MentorLiveMentoringSubmission,
) => {
  const reservation = MENTOR_LIVE_MENTORING_RESERVATIONS.find(
    (r) => r.applicationId === applicationId,
  );
  if (!reservation) {
    throw new Error(`예약 목록에 없는 applicationId: ${applicationId}`);
  }
  return {
    applicationId,
    menteeName: reservation.menteeName,
    productName: reservation.productName,
    durationMinutes: reservation.durationMinutes,
    reservationStartAt: reservation.reservationStartAt,
    reservationEndAt: reservation.reservationEndAt,
    /*
      세션 진행 상태. 목은 "아직 아무도 입장하지 않은" 상태에서 시작한다 — 멘토가
      입장을 누르면 아래 meeting-url 핸들러가 방을 만들고 출석이 PRESENT 로 바뀐다.
      화면이 그 전이를 밟아 볼 수 있어야 입장 흐름을 목으로 확인할 수 있다.
     */
    mentorStatus: 'PENDING' as LiveMentoringAttendance,
    menteeStatus: 'PENDING' as LiveMentoringAttendance,
    meetingUrl: null as string | null,
    ...submission,
  };
};

/**
 * (멘토) 예약 상세 mock — `GET /mentor/live-mentoring/reservations/{applicationId}`.
 *
 * PRD 4.7 의 렌더 규칙을 화면 없이도 다 밟을 수 있도록 다섯 경우를 모두 담는다.
 * 노션 주소(91001)와 노션이 아닌 주소(91004)를 나눈 이유는, 임베드를 노션일 때만
 * 시도하기 때문이다.
 *
 * 파일 첨부(91005)에는 파일명도 주소도 없다 — 서버가 내리지 않기로 한 값이라(PRD 4.2)
 * 목이 먼저 내리면 화면이 없는 필드에 기대게 된다.
 *
 * `questionUpdatedAt` 도 넣지 않는다. 백엔드가 이번에 내리지 않기로 했고(PRD 4.5),
 * 스키마는 없어도 통과하도록 열려 있다.
 *
 * 91003 은 `mentoringCategory` 가 null 이다. 실 데이터 대부분이 그 상태라 화면이 이 값을
 * 조건부로 그려야 한다.
 */
const MENTOR_LIVE_MENTORING_RESERVATION_DETAILS = [
  // 1. 질문 있음 + URL 첨부(노션) + 동의함 → 링크 버튼과 임베드가 모두 뜬다.
  mentorLiveMentoringDetail(91001, {
    mentoringCategory: 'PERSONAL_STATEMENT',
    questionDeferred: false,
    questionContent:
      '지원 동기 문단이 다른 지원자와 비슷해 보일까 걱정입니다. 경험을 더 앞으로 빼는 게 나을지 봐주세요.',
    attachmentType: 'URL',
    attachmentUrl: 'https://www.notion.so/letscareer-mentee-self-intro-91001',
    mentorShareAgreed: true,
  }),
  // 질문만 낸 건. 첨부가 없어 "첨부 자료 없음" 안내만 뜬다.
  mentorLiveMentoringDetail(91002, {
    mentoringCategory: 'RESUME',
    questionDeferred: false,
    questionContent:
      '경력 기술서에 인턴 경험을 어느 정도 비중으로 적어야 할지 모르겠습니다.',
    attachmentType: 'NONE',
    attachmentUrl: null,
    mentorShareAgreed: false,
  }),
  // 5. 나중에 작성하기 + 첨부 없음 → 빈 화면이 아니라 안내 문구가 떠야 한다.
  //    카테고리도 null 이다 — 서버 `mentoring_category` 가 0 인 기존 행(로컬 26건 중 23건)이
  //    이 형태로 내려온다. 화면이 카테고리 라벨을 조건부로 그리는지 여기서 확인한다.
  mentorLiveMentoringDetail(91003, {
    mentoringCategory: null,
    questionDeferred: true,
    questionContent: null,
    attachmentType: 'NONE',
    attachmentUrl: null,
    mentorShareAgreed: false,
  }),
  // 2. 질문 있음 + URL 첨부(노션 아님) + 동의함 → 임베드 없이 링크 버튼만.
  mentorLiveMentoringDetail(91004, {
    mentoringCategory: 'PORTFOLIO',
    questionDeferred: false,
    questionContent:
      '포트폴리오 첫 페이지에서 무엇을 먼저 보여주는 게 좋을지 궁금합니다.',
    attachmentType: 'URL',
    attachmentUrl: 'https://drive.google.com/file/d/mentee-portfolio-91004',
    mentorShareAgreed: true,
  }),
  // 3. 질문 있음 + FILE 첨부 + 동의함 → "파일 첨부됨 — 준비 중". 파일명·링크 모두 없다.
  mentorLiveMentoringDetail(91005, {
    mentoringCategory: 'RESUME',
    questionDeferred: false,
    questionContent:
      '이력서를 두 장으로 줄이고 싶은데 어떤 항목을 빼야 할지 봐주시면 좋겠습니다.',
    attachmentType: 'FILE',
    attachmentUrl: null,
    mentorShareAgreed: true,
  }),
  // 4. 질문 있음 + URL 첨부 + 동의 안 함 → 서버가 주소를 null 로 비워 내린다(PRD 4.4).
  mentorLiveMentoringDetail(91006, {
    mentoringCategory: 'PERSONAL_STATEMENT',
    questionDeferred: false,
    questionContent:
      '자기소개서 3번 문항 분량이 너무 깁니다. 어디를 덜어내면 좋을까요.',
    attachmentType: 'URL',
    attachmentUrl: null,
    mentorShareAgreed: false,
  }),
];

/** 서면 경험정리 QA(챌린지 9901) — 미션 종료 = 2일 전 → 제출기간이 오늘을 포함. */
const missionEnd = new Date(now.getTime() - 2 * DAY_MS);
const missionStart = new Date(missionEnd.getTime() - 6 * DAY_MS);
const challengeStart = new Date(missionStart.getTime() - 14 * DAY_MS);
const challengeEnd = new Date(missionEnd.getTime() + 21 * DAY_MS);

/**
 * 캘린더 라이브 세션 분포 시드.
 *
 * 과거 `LIVE_FEEDBACK_MOCK_DATA` 시나리오(챌린지 2개, 라이브 5/4~5/8)를 MSW 응답으로
 * 이관해 화면 동등성을 유지한다. `useLiveFeedbackData`가 programTitle 그룹별
 * `live-feedback-period` 바와 개별 `live-feedback` 바를 파생한다.
 *
 * 절대일자(2026-05-xx)를 사용 — mockNow(데모 시각)와 함께 보던 고정 시연 일정 재현.
 */
/**
 * 캘린더 개별 LIVE 카드의 상태 배지 시연을 위한 세션별 상태.
 *
 * `status`(BE FeedbackStatus) + 출석(mentorStatus/menteeStatus)으로
 * `resolveSessionStatus` 매핑을 거쳐 카드 배지가 결정된다.
 *  - COMPLETED                  → 진행 완료(회색 아웃라인)
 *  - CANCELED + menteeStatus ABSENT → 멘티 미참여
 *  - CANCELED (단순 취소)        → 취소(연빨강)
 *  - RESERVED                   → 대기(배지 없음)
 * 미지정 시 RESERVED(대기) 기본값.
 */
type CalendarSessionStatus = {
  status: 'RESERVED' | 'COMPLETED' | 'CANCELED';
  mentorStatus: 'PENDING' | 'PRESENT' | 'ABSENT';
  menteeStatus: 'PENDING' | 'PRESENT' | 'ABSENT';
};

const CALENDAR_FEEDBACK_SESSIONS: ReadonlyArray<
  readonly [string, string, string, string, CalendarSessionStatus?]
> = [
  // [챌린지1] 기필코 경험정리 챌린지 21기 — 5/4~5/6
  [
    '2026-05-04T10:00:00',
    '2026-05-04T10:30:00',
    '기필코 경험정리 챌린지 21기',
    '이지수',
    { status: 'COMPLETED', mentorStatus: 'PRESENT', menteeStatus: 'PRESENT' },
  ],
  [
    '2026-05-04T14:00:00',
    '2026-05-04T14:30:00',
    '기필코 경험정리 챌린지 21기',
    '박서연',
    { status: 'CANCELED', mentorStatus: 'PENDING', menteeStatus: 'PENDING' },
  ],
  [
    '2026-05-05T10:00:00',
    '2026-05-05T10:30:00',
    '기필코 경험정리 챌린지 21기',
    '최지훈',
    { status: 'CANCELED', mentorStatus: 'PRESENT', menteeStatus: 'ABSENT' },
  ],
  [
    '2026-05-05T15:00:00',
    '2026-05-05T15:30:00',
    '기필코 경험정리 챌린지 21기',
    '임채원',
    // 미지정 → RESERVED(대기, 배지 없음)
  ],
  [
    '2026-05-06T09:00:00',
    '2026-05-06T09:30:00',
    '기필코 경험정리 챌린지 21기',
    '한도윤',
    { status: 'COMPLETED', mentorStatus: 'PRESENT', menteeStatus: 'PRESENT' },
  ],
  // [챌린지2] 커리어 설계 챌린지 5기 — 5/6~5/8
  [
    '2026-05-06T14:00:00',
    '2026-05-06T14:30:00',
    '커리어 설계 챌린지 5기',
    '문수아',
    { status: 'CANCELED', mentorStatus: 'PENDING', menteeStatus: 'PENDING' },
  ],
  [
    '2026-05-07T10:00:00',
    '2026-05-07T10:30:00',
    '커리어 설계 챌린지 5기',
    '조예린',
    { status: 'COMPLETED', mentorStatus: 'PRESENT', menteeStatus: 'PRESENT' },
  ],
  [
    '2026-05-08T15:00:00',
    '2026-05-08T15:30:00',
    '커리어 설계 챌린지 5기',
    '백지윤',
  ],
];

/** startDate(ISO local)에서 며칠 앞선 신청 일시(createDate)를 파생 */
function deriveCreateDate(startDate: string, daysBefore: number): string {
  const start = new Date(startDate);
  const created = new Date(start.getTime() - daysBefore * DAY_MS);
  // 신청 시각은 예약 시작 시각과 무관하게 오전 무렵으로 고정해 자연스럽게 표기.
  created.setHours(9, 30, 0, 0);
  const y = created.getFullYear();
  const mo = String(created.getMonth() + 1).padStart(2, '0');
  const d = String(created.getDate()).padStart(2, '0');
  const hh = String(created.getHours()).padStart(2, '0');
  const mm = String(created.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${d}T${hh}:${mm}:00`;
}

/** 프로그램 제목의 "N차"에서 회차(th)를 파생(없으면 1). */
function thFromTitle(title: string): number {
  const m = title.match(/(\d+)차/);
  return m ? Number(m[1]) : 1;
}

const calendarFeedbackList = CALENDAR_FEEDBACK_SESSIONS.map(
  ([startDate, endDate, programTitle, menteeName, sessionStatus], idx) => ({
    feedbackId: 70_000 + idx,
    startDate,
    endDate,
    createDate: deriveCreateDate(startDate, 3 + (idx % 3)),
    meetingUrl: null,
    mentorStatus: sessionStatus?.mentorStatus ?? 'PENDING',
    menteeStatus: sessionStatus?.menteeStatus ?? 'PENDING',
    status: sessionStatus?.status ?? 'RESERVED',
    programTitle,
    menteeName,
    // 다회차 검증용: 기필코 경험정리 21기는 5/4=1차, 이후 날짜=2차. 그 외 챌린지는 1차.
    th:
      programTitle === '기필코 경험정리 챌린지 21기'
        ? startDate.startsWith('2026-05-04')
          ? 1
          : 2
        : 1,
  }),
);

/**
 * 완료된 예약(COMPLETED) 분포 시드 — 예약 현황 "완료된 예약" 테이블용.
 * 과거 날짜로 프로그램/멘티/신청시간을 다양화한다. RESERVED(예정)와 별도.
 *
 * [startDate, endDate, programTitle, menteeName, createDate(신청 일시)]
 */
const COMPLETED_FEEDBACK_SESSIONS: ReadonlyArray<
  readonly [string, string, string, string, string]
> = [
  [
    '2025-10-16T17:30:00',
    '2025-10-16T18:00:00',
    '한경닷컴 마케팅 과정 9기 1:1 멘토링',
    '강하늘',
    '2025-10-10T13:20:00',
  ],
  [
    '2025-10-20T11:00:00',
    '2025-10-20T11:30:00',
    '포트폴리오 완성 챌린지 16기 1차 피드백',
    '윤서아',
    '2025-10-12T09:05:00',
  ],
  [
    '2025-10-23T19:00:00',
    '2025-10-23T19:30:00',
    '자기소개서 완성 챌린지 16기 2차 피드백',
    '오지호',
    '2025-10-18T22:40:00',
  ],
  [
    '2025-11-03T14:00:00',
    '2025-11-03T14:30:00',
    '한경닷컴 마케팅 과정 9기 1:1 멘토링',
    '김도현',
    '2025-10-28T10:15:00',
  ],
  [
    '2025-11-07T10:30:00',
    '2025-11-07T11:00:00',
    '포트폴리오 완성 챌린지 16기 1차 피드백',
    '서지안',
    '2025-11-01T16:30:00',
  ],
  [
    '2025-11-12T16:00:00',
    '2025-11-12T16:30:00',
    '자기소개서 완성 챌린지 16기 2차 피드백',
    '한예준',
    '2025-11-05T08:50:00',
  ],
  [
    '2025-11-18T18:30:00',
    '2025-11-18T19:00:00',
    '한경닷컴 마케팅 과정 9기 1:1 멘토링',
    '정유나',
    '2025-11-13T20:10:00',
  ],
];

const completedFeedbackList = COMPLETED_FEEDBACK_SESSIONS.map(
  ([startDate, endDate, programTitle, menteeName, createDate], idx) => ({
    feedbackId: 60_000 + idx,
    startDate,
    endDate,
    createDate,
    meetingUrl: null,
    mentorStatus: 'PRESENT',
    menteeStatus: 'PRESENT',
    status: 'COMPLETED',
    programTitle,
    menteeName,
    th: thFromTitle(programTitle),
  }),
);

/**
 * 멘토 라이브 피드백 단일 시드.
 *
 * 목록(`GET /feedback/mentor`)과 단건 상세(`GET /feedback/mentor/:feedbackId`)가
 * **이 배열을 공유**한다. 상세 핸들러는 feedbackId로 여기서 세션을 찾아
 * 목록과 동일한 일시/프로그램/멘티/상태를 반환한다.
 *
 * 구성: 기본 세션(MOCK_FEEDBACK_ID, RESERVED) + 캘린더 RESERVED 분포 + COMPLETED 분포.
 */
const MENTOR_FEEDBACK_SEED = [
  {
    feedbackId: MOCK_FEEDBACK_ID,
    startDate: reservationStart,
    endDate: reservationEnd,
    createDate: deriveCreateDate(reservationStart, 2),
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    menteeName: '이지수',
    th: 1,
  },
  ...calendarFeedbackList,
  ...completedFeedbackList,
];

/**
 * 멘토 오픈 슬롯 분포 시드 — `live-feedback-mentor-open` 글로벌 바 파생용.
 * 4/24~4/28 분포 → 캘린더 상단 오픈기간 바 1개로 묶인다.
 */
const calendarSlotList = [
  {
    feedbackSlotId: 80_001,
    startDate: '2026-04-24T09:00:00',
    endDate: '2026-04-25T18:00:00',
    status: 'OPEN' as const,
  },
  {
    feedbackSlotId: 80_002,
    startDate: '2026-04-27T09:00:00',
    endDate: '2026-04-28T18:00:00',
    status: 'OPEN' as const,
  },
];

/**
 * 라이브 피드백 QA(legacy 챌린지 1·2)용 서면 미션 제출자(출석) 시드 —
 * challengeMissionFeedbackAttendanceListSchema 와 mentorMenteeAttendanceListSchema
 * 양쪽을 모두 통과하는 공통 형태.
 *
 * status(ABSENT 여부)와 feedbackStatus(WAITING/IN_PROGRESS/COMPLETED) 분포로
 * ChallengeDataFetcher 가 written-feedback 바의 카운트를 파생한다.
 */
const MOCK_ATTENDANCE_LIST = [
  {
    id: 1,
    userId: 101,
    mentorName: '테스트 멘토',
    name: '이지수',
    status: 'PRESENT',
    feedbackStatus: 'COMPLETED',
  },
  {
    id: 2,
    userId: 102,
    mentorName: '테스트 멘토',
    name: '김민준',
    status: 'PRESENT',
    feedbackStatus: 'COMPLETED',
  },
  {
    id: 3,
    userId: 103,
    mentorName: '테스트 멘토',
    name: '박서연',
    status: 'PRESENT',
    feedbackStatus: 'IN_PROGRESS',
  },
  {
    id: 4,
    userId: 104,
    mentorName: '테스트 멘토',
    name: '정하늘',
    status: 'PRESENT',
    feedbackStatus: 'WAITING',
  },
  {
    id: 5,
    userId: 105,
    mentorName: '테스트 멘토',
    name: '최지훈',
    status: 'ABSENT',
    feedbackStatus: 'WAITING',
  },
  {
    // 지각 제출 — 목록에는 남고 '지각 제출 / 진행 불가'로 구분돼야 한다.
    // 완료 분모(feedbackTargetCount)에서는 빠지되 전체 인원에서는 빠지지 않는다.
    id: 6,
    userId: 106,
    mentorName: '테스트 멘토',
    name: '한지각',
    status: 'LATE',
    feedbackStatus: 'WAITING',
  },
];

/**
 * 서면 경험정리 QA(챌린지 9901)용 멘티 제출 내역 — 4가지 케이스 혼합.
 * (BE mentorMenteeAttendanceListSchema 일치, challengeId>=230 신규 경로)
 */
const MOCK_MENTEES = [
  {
    id: 9001,
    userId: 501,
    challengeMentorId: 301,
    mentorName: '테스트 멘토',
    name: '김경험',
    major: '경영학과',
    wishJob: '서비스 기획',
    wishCompany: '네이버',
    link: null, // ← 경험정리형 제출: link 없음 → 경험 목록 서브모달
    status: 'PRESENT',
    result: 'PASS',
    challengePricePlanType: 'BASIC',
    feedbackStatus: 'WAITING',
    optionCode: 'WRITTEN_1',
  },
  {
    id: 9002,
    userId: 502,
    challengeMentorId: 301,
    mentorName: '테스트 멘토',
    name: '이링크',
    major: '컴퓨터공학과',
    wishJob: '백엔드 개발',
    wishCompany: '카카오',
    // ← 링크형: 노션 퍼블리시 일반 공유 링크 → FE가 /ebd/ 임베드 URL로 변환
    link: 'https://boggy-chestnut-60b.notion.site/3764740158fa80129663f64380a93d10',
    status: 'PRESENT',
    result: 'PASS',
    challengePricePlanType: 'STANDARD',
    feedbackStatus: 'IN_PROGRESS',
    optionCode: 'WRITTEN_1',
  },
  {
    id: 9003,
    userId: 503,
    challengeMentorId: 301,
    mentorName: '테스트 멘토',
    name: '박빈손',
    major: '심리학과',
    wishJob: 'HR',
    wishCompany: '토스',
    link: null, // ← 제출됐지만 경험도 0건 → "제출물 없음" 안내
    status: 'PRESENT',
    result: 'PASS',
    challengePricePlanType: 'BASIC',
    feedbackStatus: 'WAITING',
    optionCode: 'WRITTEN_1',
  },
  {
    id: 9004,
    userId: 505,
    challengeMentorId: 301,
    mentorName: '테스트 멘토',
    name: '한지각',
    major: '산업공학과',
    wishJob: '데이터 분석',
    wishCompany: '배민',
    link: null, // ← 지각 제출(경험정리형): 열람은 되고 작성만 막혀야 한다
    status: 'LATE',
    result: 'PASS',
    challengePricePlanType: 'BASIC',
    feedbackStatus: 'WAITING',
    optionCode: 'WRITTEN_1',
  },
  {
    id: 9005,
    userId: 506,
    challengeMentorId: 301,
    mentorName: '테스트 멘토',
    name: '오지각',
    major: '통계학과',
    wishJob: '프로덕트 매니저',
    wishCompany: '당근',
    // ← 지각 제출 + 이미 작성된 피드백: 내용은 읽기 전용으로 남고 수정·완료만 막혀야 한다
    link: 'https://boggy-chestnut-60b.notion.site/3764740158fa80129663f64380a93d10',
    status: 'LATE',
    result: 'PASS',
    challengePricePlanType: 'STANDARD',
    feedbackStatus: 'IN_PROGRESS',
    optionCode: 'WRITTEN_1',
  },
  {
    id: null, // ← 미제출: 경험 조회 API가 호출되지 않아야 함
    userId: 504,
    challengeMentorId: 301,
    mentorName: '테스트 멘토',
    name: '최미제출',
    major: '영문학과',
    wishJob: '마케팅',
    wishCompany: '쿠팡',
    link: null,
    status: 'ABSENT',
    result: 'WAITING',
    challengePricePlanType: 'BASIC',
    feedbackStatus: null,
    optionCode: 'WRITTEN_1',
  },
];

/**
 * 이미 저장된 서면 피드백 본문 (Lexical editor state JSON).
 * 지각 제출인데 멘토가 이미 써 둔 건을 재현해, 화면이 내용을 지우지 않고
 * 읽기 전용으로 남기는지 확인하는 데 쓴다.
 */
const MOCK_SAVED_FEEDBACK = JSON.stringify({
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text: '경험 정리 구조는 좋습니다. STAR 중 Result 를 수치로 바꿔 보세요.',
            type: 'text',
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
        textFormat: 0,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

/**
 * 경험정리 EXPERIENCE_1/EXPERIENCE_2 페어 그룹핑 QA(챌린지 9902)용 미션별 출석.
 * missionId 3401~3602 각각에 대해 같은 멘티(이름 동일, id/userId만 미션마다 다름)를
 * 다른 status로 배치해, 케이스 A(한쪽만 제출)/B(반대)/C(둘 다 제출)가 실제로
 * `WrittenMenteeAttendanceFetcher` → `useMergedFeedbackRows` 파이프라인을 거쳐도
 * 재현되게 한다. feedbackMissions의 submittedCount만 다르고 출석 데이터가 같으면
 * (기존 문제) 필터링 로직을 실제 화면에서 검증할 수 없다.
 */
const EXPERIENCE_PAIR_ATTENDANCE_BY_MISSION: Record<
  number,
  Array<{
    id: number | null;
    userId: number | null;
    mentorName: string;
    name: string;
    status: 'PRESENT' | 'ABSENT';
    feedbackStatus: 'WAITING' | 'IN_PROGRESS' | 'COMPLETED';
  }>
> = {
  // 케이스 A(4회차): EXPERIENCE_1(3401)만 제출, EXPERIENCE_2(3402)는 미제출.
  3401: [
    {
      id: 9401,
      userId: 601,
      mentorName: '테스트 멘토',
      name: '강경험',
      status: 'PRESENT',
      feedbackStatus: 'COMPLETED',
    },
  ],
  3402: [
    {
      id: null,
      userId: 601,
      mentorName: '테스트 멘토',
      name: '강경험',
      status: 'ABSENT',
      feedbackStatus: 'WAITING',
    },
  ],
  // 케이스 B(5회차): EXPERIENCE_1(3501)은 미제출, EXPERIENCE_2(3502)만 제출.
  3501: [
    {
      id: null,
      userId: 602,
      mentorName: '테스트 멘토',
      name: '노선택',
      status: 'ABSENT',
      feedbackStatus: 'WAITING',
    },
  ],
  3502: [
    {
      id: 9502,
      userId: 602,
      mentorName: '테스트 멘토',
      name: '노선택',
      status: 'PRESENT',
      feedbackStatus: 'IN_PROGRESS',
    },
  ],
  // 케이스 C(6회차): EXPERIENCE_1(3601)/EXPERIENCE_2(3602) 둘 다 제출(예외 케이스, PRD §5-④).
  3601: [
    {
      id: 9601,
      userId: 603,
      mentorName: '테스트 멘토',
      name: '두번제출',
      status: 'PRESENT',
      feedbackStatus: 'COMPLETED',
    },
  ],
  3602: [
    {
      id: 9602,
      userId: 603,
      mentorName: '테스트 멘토',
      name: '두번제출',
      status: 'PRESENT',
      feedbackStatus: 'WAITING',
    },
  ],
};

/** 김경험(userId 501)의 경험정리 제출물 — STAR 전체 필드 채움 */
const MOCK_EXPERIENCES_BY_USER: Record<string, unknown[]> = {
  // 한지각(505) — 지각 제출자도 제출물 열람은 가능해야 하므로 경험을 1건 둔다.
  '505': [
    {
      id: 91,
      title: '지역 소상공인 배달 데이터 분석 프로젝트',
      activityType: 'TEAM',
      experienceCategory: 'CLUB',
      organ: '교내 데이터분석 학회',
      role: '분석 담당',
      startDate: '2025-03-01',
      endDate: '2025-06-30',
      situation: '동네 상권의 배달 매출이 요일별로 크게 흔들렸음.',
      task: '요일·시간대별 수요 패턴을 찾아 프로모션 시점을 제안해야 했음.',
      action:
        '3개월치 주문 로그를 시간대로 쪼개 회귀 분석하고 대시보드로 공유함.',
      result: '제안한 시간대에 쿠폰을 집행해 주말 객단가 8% 상승.',
      reflection: '분석보다 전달 형식이 실행 여부를 갈랐다.',
      coreCompetency: '데이터 분석',
      isAdminAdded: false,
    },
  ],
  '501': [
    {
      id: 81,
      title: '교내 창업 동아리 서비스 런칭',
      activityType: 'TEAM',
      experienceCategory: 'CLUB',
      organ: '한양대 창업 동아리',
      role: '기획 리드 (PM)',
      startDate: '2025-03-01',
      endDate: '2025-08-31',
      situation:
        '교내 중고거래가 오픈채팅방에 분산되어 있어 사기 거래와 노쇼가 빈번했음.',
      task: '신뢰 기반 교내 중고거래 플랫폼을 한 학기 안에 런칭해야 했음.',
      action:
        '학생 인증 기반 가입 플로우를 설계하고, MVP 기능을 3개로 좁혀 6주 만에 베타를 출시. 주간 사용자 인터뷰 8회로 개선 우선순위를 정함.',
      result:
        '출시 3개월 만에 교내 재학생의 23%(1,200명) 가입, 거래 분쟁 신고 0건 달성.',
      reflection:
        '기능을 늘리기보다 신뢰라는 핵심 가치에 집중할 때 지표가 움직인다는 것을 배움.',
      coreCompetency: '문제정의, 우선순위 설정',
      isAdminAdded: false,
    },
    {
      id: 82,
      title: '리테일 스타트업 데이터 분석 인턴',
      activityType: 'INDIVIDUAL',
      experienceCategory: 'INTERNSHIP',
      organ: '(주)모크리테일',
      role: '데이터 분석 인턴',
      startDate: '2025-09-01',
      endDate: '2025-12-31',
      situation: '재구매율이 6개월간 정체되어 원인 파악이 필요했음.',
      task: '구매 데이터를 분석해 재구매 저해 요인을 도출하는 업무를 담당.',
      action:
        'RFM 세그먼트별 코호트 분석으로 첫 구매 후 2주 내 재방문이 없는 고객군을 특정하고, CRM 메시지 A/B 테스트를 제안·실행함.',
      result: '타깃 세그먼트 재구매율 11%p 상승, 분석 리포트가 전사 공유됨.',
      reflection:
        '분석은 결론이 아니라 실행 제안까지 이어져야 가치가 생긴다는 것을 체감.',
      coreCompetency: '데이터 분석, 가설 검증',
      isAdminAdded: false,
    },
    {
      id: 83,
      title: '대학생 마케팅 공모전 대상',
      activityType: 'TEAM',
      experienceCategory: 'COMPETITION',
      organ: '한국마케팅협회',
      role: '팀장 · 발표 담당',
      startDate: '2025-05-01',
      endDate: '2025-06-30',
      situation: 'Z세대 대상 금융 앱 신규 가입 캠페인 기획 과제가 주어짐.',
      task: '4인 팀으로 6주 안에 실행 가능한 캠페인 전략을 완성해야 했음.',
      action:
        '타깃 인터뷰 12건으로 페인포인트를 좁히고, 숏폼 챌린지 중심의 퍼널 설계와 예산 시뮬레이션까지 포함해 제안함.',
      result:
        '본선 12팀 중 대상 수상, 주관사 실무진으로부터 실행 협의 제안받음.',
      reflection:
        '심사위원이 아닌 실제 사용자 관점에서 검증한 것이 차별점이었음.',
      coreCompetency: '커뮤니케이션, 실행력',
      isAdminAdded: false,
    },
  ],
  // 박빈손(503): 데이터 정합성이 깨진 케이스 — 제출됨인데 경험 0건
  '503': [],
};

/** 형식상 유효한 가짜 JWT — payload: { sub: '1', exp: 4102444800(2100-01-01) } */
const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjo0MTAyNDQ0ODAwfQ.mock-signature';

/** GET /user (마이페이지·환영 메시지) — userSchema 필수 키 전부 포함 */
const MOCK_USER = {
  userId: 1,
  id: null,
  name: '테스트 멘토',
  email: 'mock-mentor@letscareer.co.kr',
  contactEmail: null,
  phoneNum: null,
  university: null,
  inflowPath: null,
  grade: null,
  major: null,
  wishField: null,
  wishJob: null,
  wishIndustry: null,
  wishEmploymentType: null,
  wishCompany: null,
  accountType: null,
  accountNum: null,
  marketingAgree: null,
  authProvider: null,
  role: 'USER',
  careerType: null,
  memo: null,
  isPoolUp: null,
  nickname: '테스트 멘토',
  introduction: null,
  profileImgUrl: null,
  sns: null,
};

/**
 * (마이페이지 출시알림 QA) 사용자가 신청한 LAUNCH_ALERT 마그넷 시드 —
 * BE mypageMagnetListItemSchema 형태와 일치.
 *
 * DELETE(신청취소)가 실제로 목록에서 항목을 제거하도록 mutable 배열로 둔다.
 * 취소 후 재조회(invalidate)에서 해당 카드가 사라지는 흐름을 실 BE 없이 QA 한다.
 */
const LAUNCH_ALERT_MAGNET_SEED = [
  {
    magnetId: 90_001,
    type: 'LAUNCH_ALERT' as const,
    title: 'AI 취업 특강 출시알림',
    description: '출시되면 가장 먼저 알려드릴게요.',
    desktopThumbnail: '',
    mobileThumbnail: '',
    applicationCreateDate: deriveCreateDate(reservationStart, 5),
  },
  {
    magnetId: 90_002,
    type: 'LAUNCH_ALERT' as const,
    title: '포트폴리오 완성 챌린지 출시알림',
    description: '신규 기수 오픈 소식을 받아보실 수 있어요.',
    desktopThumbnail: '',
    mobileThumbnail: '',
    applicationCreateDate: deriveCreateDate(reservationStart, 12),
  },
  {
    magnetId: 90_003,
    type: 'LAUNCH_ALERT' as const,
    title: '현직자 커피챗 프로그램 출시알림',
    description: '출시 일정이 확정되면 알림을 보내드려요.',
    desktopThumbnail: '',
    mobileThumbnail: '',
    applicationCreateDate: deriveCreateDate(reservationStart, 20),
  },
];

let launchAlertMagnetList = [...LAUNCH_ALERT_MAGNET_SEED];

/**
 * 대표 경력은 오픈 설정 저장(PUT)과 무관하게 전용 API 로 즉시 저장된다.
 * 목에서도 상태를 들고 있어야 "지정 → 재조회 시 반영"이라는 실제 동작을 재현할 수 있다.
 */
let representativeCareerId: number | null =
  LIVE_MENTORING_SETTINGS.careers.find((career) => career.isRepresentative)
    ?.id ?? null;

/** 현재 대표 경력 지정 상태를 반영한 경력 목록. */
const settingsCareers = () =>
  LIVE_MENTORING_SETTINGS.careers.map((career) => ({
    ...career,
    isRepresentative: career.id === representativeCareerId,
  }));

/**
 * 라이브 멘토링 상품·개설 목 상태.
 *
 * 저장 → 개설(자가승인) → 종료가 한 줄기로 이어지는지 확인하려면 목이 상태를
 * 들고 있어야 한다. 응답만 고정으로 돌려주면 "개설했는데 목록이 그대로"인 상태가 되어
 * 화면 흐름을 검증할 수 없다.
 */
const liveMentoringState = {
  liveMentoringId: LIVE_MENTORING_SETTINGS.liveMentoringId,
  title: LIVE_MENTORING_SETTINGS.title,
  status: LIVE_MENTORING_SETTINGS.status,
  categories: [...LIVE_MENTORING_SETTINGS.categories],
  durations: [...LIVE_MENTORING_SETTINGS.durations],
  approvedAt: null as string | null,
  approvedByUserId: null as number | null,
  openings: OPENING_HISTORY.map((opening) => ({ ...opening })),
  slots: LIVE_MENTORING_SLOTS.map((slot) => ({ ...slot })),
};

let nextOpeningId = 200;

/**
 * 상세 페이지 목 상태. PUT 이 저장한 편집분을 GET 이 그대로 돌려준다.
 * 고정 응답이면 "저장했는데 새로고침하면 원래대로"가 되어 흐름을 확인할 수 없다.
 */
let detailPageState: LiveMentoringTemplate = { ...LIVE_MENTORING_TEMPLATE };

/** 서버 요청 DTO(`UpdateLiveMentoringDetailPageRequestDto`)가 받는 키 전부. */
const DETAIL_PAGE_REQUEST_KEYS = [
  'hero',
  'mentoringTypes',
  'strategy',
  'video',
  'results',
  'reviews',
] as const;
type DetailPageRequestKey = (typeof DETAIL_PAGE_REQUEST_KEYS)[number];

/**
 * 목 상태를 초기값으로 되돌린다.
 *
 * 핸들러가 모듈 스코프 상태를 들고 있어 `server.resetHandlers()` 만으로는 지워지지 않는다.
 * 상태를 바꾸는 테스트(개설·슬롯 저장·종료)는 `afterEach` 에서 이걸 불러 서로 간섭하지 않게 한다.
 */
export const resetLiveMentoringMockState = () => {
  liveMentoringState.liveMentoringId = LIVE_MENTORING_SETTINGS.liveMentoringId;
  liveMentoringState.title = LIVE_MENTORING_SETTINGS.title;
  liveMentoringState.status = LIVE_MENTORING_SETTINGS.status;
  liveMentoringState.categories = [...LIVE_MENTORING_SETTINGS.categories];
  liveMentoringState.durations = [...LIVE_MENTORING_SETTINGS.durations];
  liveMentoringState.approvedAt = null;
  liveMentoringState.approvedByUserId = null;
  liveMentoringState.openings = OPENING_HISTORY.map((opening) => ({
    ...opening,
  }));
  liveMentoringState.slots = LIVE_MENTORING_SLOTS.map((slot) => ({ ...slot }));
  adminFixtureRows = makeAdminFixtureRows();
  nextOpeningId = 200;
  detailPageState = { ...LIVE_MENTORING_TEMPLATE };
};

const liveMentoringNow = () => new Date().toISOString().slice(0, 19);

/** 서버 `LiveMentoringErrorCode` 를 그대로 흉내낸 에러 응답. */
const liveMentoringError = (status: number, code: string, message: string) =>
  HttpResponse.json({ status, code, message }, { status });

const activeOpening = () =>
  liveMentoringState.openings.find((opening) => opening.status === 'OPEN') ??
  null;

/** 서버 `LiveMentoring.isEditable()` — 상태와 활성 개설 유무를 함께 본다. */
const isSettingsEditable = () =>
  (liveMentoringState.status === null ||
    liveMentoringState.status === 'DRAFT') &&
  activeOpening() === null;

const settingsResponse = () => ({
  liveMentoringId: liveMentoringState.liveMentoringId,
  nickname: LIVE_MENTORING_SETTINGS.nickname,
  profileImage: LIVE_MENTORING_SETTINGS.profileImage,
  introduction: LIVE_MENTORING_SETTINGS.introduction,
  careers: settingsCareers(),
  title: liveMentoringState.title,
  status: liveMentoringState.status,
  categories: liveMentoringState.categories,
  durations: liveMentoringState.durations,
});

/**
 * 상세 페이지 조회/저장 응답. 편집 대상 템플릿에 읽기 전용 상품 정보를 얹는다.
 *
 * `editable` 은 서버 `LiveMentoring.isEditable()` 과 같은 조건이라 설정 화면의
 * 판정(`isSettingsEditable`)을 그대로 쓴다 — 목에서 두 화면의 잠금이 갈리면
 * 어느 쪽이 맞는지 확인할 수 없다.
 */
const detailPageResponse = () => ({
  ...detailPageState,
  mentoring: {
    liveMentoringId: liveMentoringState.liveMentoringId,
    title: liveMentoringState.title,
    status: liveMentoringState.status,
    editable: isSettingsEditable(),
    categories: liveMentoringState.categories,
  },
});

const openingHistoryResponse = () => ({
  liveMentoringId: liveMentoringState.liveMentoringId,
  openings: liveMentoringState.openings,
});

const closeOpeningById = (
  openingId: number,
  closeReason: 'ADMIN_FORCED' | 'MENTOR_CANCELED',
  closedByUserId: number,
) => {
  const opening = liveMentoringState.openings.find(
    (each) => each.openingId === openingId,
  );
  if (!opening) return false;
  // 이미 종료된 개설은 사유를 덮어쓰지 않고 그대로 성공 처리한다(서버와 동일).
  if (opening.status === 'OPEN') {
    opening.status = 'CLOSED';
    opening.closedAt = liveMentoringNow();
    opening.closeReason = closeReason;
    Object.assign(opening, { closedByUserId });
    // 종료는 슬롯을 건드리지 않는다. 슬롯이 챌린지 라이브 피드백과 공유되면서
    // 1대1 오픈을 닫는 행위가 그 멘토의 챌린지 가용시간까지 지우면 안 된다.
  }
  return true;
};

/** 슬롯 목록을 시작 시각 오름차순으로 정렬한다(서버 정렬과 동일). */
const sortSlots = (slots: LiveMentoringSlot[]) =>
  [...slots].sort((a, b) => a.startDate.localeCompare(b.startDate));

const slotListResponse = (slots: LiveMentoringSlot[]) =>
  HttpResponse.json({
    status: 200,
    data: { liveMentoringSlotList: sortSlots(slots) },
  });

/**
 * 관리자 목록 응답 1건. 로그인 멘토("나")의 상품만 상태를 실제로 반영하고,
 * 나머지는 상태 필터·정렬을 확인하기 위한 고정 행이다.
 */
const adminLiveMentoringVo = () => {
  const opening = activeOpening();
  return {
    liveMentoringId: liveMentoringState.liveMentoringId,
    mentorId: 1,
    mentorNickname: LIVE_MENTORING_SETTINGS.nickname,
    mentorProfileImage: LIVE_MENTORING_SETTINGS.profileImage,
    title: liveMentoringState.title,
    status: liveMentoringState.status,
    categories: liveMentoringState.categories,
    hasDetailPage: true,
    approvedAt: liveMentoringState.approvedAt,
    approvedByUserId: liveMentoringState.approvedByUserId,
    createDate: '2026-08-01T09:00:00',
    lastModifiedDate: liveMentoringNow(),
    currentOpening: opening
      ? {
          openingId: opening.openingId,
          status: opening.status,
          durationPrices: opening.durationPrices,
          openedAt: opening.openedAt,
          closedAt: opening.closedAt,
          closeReason: opening.closeReason,
          closedByUserId: null as number | null,
          createDate: opening.openedAt,
          lastModifiedDate: opening.openedAt,
        }
      : null,
  };
};

type AdminFixtureRow = ReturnType<typeof adminLiveMentoringVo>;

/**
 * "나" 이외의 멘토 행. 상태 필터·정렬 확인용 고정 행이다.
 * 관리자 화면에는 조회·강제 종료만 있고 승인·반려 자체가 없으므로(백엔드에 대응 API가
 * 없음), 상태를 실제 API 로 전이시키지 않는다 — 대신 세 상태(DRAFT/APPROVED/INACTIVE)를
 * 미리 다양하게 박아 필터·정렬을 검증한다. 개설이 있는 행(20번)은 강제 종료 핸들러가
 * `fixture.currentOpening` 을 그대로 찾아 종료 처리한다.
 */
const makeAdminFixtureRows = (): AdminFixtureRow[] => [
  {
    liveMentoringId: 20,
    mentorId: 2,
    mentorNickname: '박멘토',
    mentorProfileImage: null,
    title: '이력서 클리닉',
    status: 'APPROVED',
    categories: ['RESUME'],
    hasDetailPage: true,
    approvedAt: '2026-08-03T11:00:00',
    approvedByUserId: 1,
    createDate: '2026-08-02T11:00:00',
    lastModifiedDate: '2026-08-03T11:00:00',
    currentOpening: {
      openingId: 220,
      status: 'OPEN',
      durationPrices: [{ duration: 30, price: getPriceByDuration(30) }],
      openedAt: '2026-08-03T11:00:00',
      closedAt: null,
      closeReason: null,
      closedByUserId: null,
      createDate: '2026-08-03T11:00:00',
      lastModifiedDate: '2026-08-03T11:00:00',
    },
  },
  {
    liveMentoringId: 21,
    mentorId: 3,
    mentorNickname: '최멘토',
    mentorProfileImage: null,
    title: '포트폴리오 집중 피드백',
    status: 'INACTIVE',
    categories: ['PORTFOLIO'],
    hasDetailPage: false,
    approvedAt: '2026-07-28T15:00:00',
    approvedByUserId: 1,
    createDate: '2026-07-28T15:00:00',
    lastModifiedDate: '2026-07-30T09:00:00',
    currentOpening: null,
  },
];

let adminFixtureRows = makeAdminFixtureRows();

/**
 * 목 카드 → 백엔드 `LiveMentoringOpeningResponseDto` 형태 변환.
 *
 * 목 데이터는 PRD 기준(평점·후기·모자이크)이고 실제 개설 목록 응답은 그 필드가 없으므로,
 * 공개 목록이 실제로 받는 필드만 남겨 매핑한다.
 * `headline`("네이버 · 서비스 기획 7년")을 회사/직무로 쪼개 대표 경력을 만들고,
 * **대표 경력 미지정(null)** 케이스도 재현하도록 5번째 멘토마다 null 을 준다.
 */
function toOpeningDto(card: LiveMentorCard) {
  const [company, job] = card.headline.split('·').map((part) => part.trim());
  const hasRepresentativeCareer = card.mentorId % 5 !== 0;

  return {
    // 서버는 상품(liveMentoring)과 개설(opening)을 별도 식별자로 내려준다.
    // 목 멘토는 상품·개설을 1:1 로 갖고 있어 mentorId 를 그대로 파생시킨다.
    liveMentoringId: card.mentorId,
    openingId: card.mentorId,
    mentorId: card.mentorId,
    mentorNickname: card.nickname,
    // 프로필 이미지를 끈 멘토는 백엔드도 이미지를 내려주지 않는다.
    mentorProfileImage: card.profileVisible ? card.profileImage : null,
    mentorIntroduction: card.mentoringPoints,
    representativeCareer: hasRepresentativeCareer
      ? {
          id: card.mentorId,
          company: company ?? null,
          field: null,
          job: job ?? null,
          position: null,
          department: null,
          startDate: '2020-01',
          endDate: null,
        }
      : null,
    title: mentoringTitleFor(card),
    categories: card.categories,
    durations: card.durations,
    minimumPrice: card.price,
  };
}

/** 오픈채팅방 QA용 링크 — 실제 열리는 카카오 오픈채팅 도메인 형태. */
const MOCK_CHAT_LINK = 'https://open.kakao.com/o/gMockChat';

const daysFromNow = (days: number) =>
  new Date(now.getTime() + days * DAY_MS).toISOString();

/**
 * (마이페이지 신청현황) 프로그램 신청 시드 — LC-3190 오픈채팅방 입장 버튼 QA.
 *
 * 액션 버튼 노출 규칙이 세 조건(프로그램 타입 · chatLink 유무 · 참여 상태)의 곱이라
 * 한 화면에서 6가지 경우를 모두 눈으로 비교할 수 있게 배치한다.
 * 각 섹션은 데스크톱에서 3개까지 노출되므로 섹션당 3개를 넘기지 않는다.
 *
 *  참여예정  1) 코드 있음   → 오픈채팅방만 (클릭 시 참여코드 모달)
 *            2) 코드 없음   → 오픈채팅방만 (클릭 시 새 탭 직행)
 *  참여중    3) 베이직      → 대시보드 입장 + 오픈채팅방 (버튼 2개 레이아웃)
 *            4) 라이트      → 오픈채팅방만 (라이트는 대시보드 진입 불가)
 *            5) 라이브      → 클래스 입장만 (챌린지 아님 = 회귀 확인)
 *  참여완료  6) 링크 있음   → 대시보드 입장만 (종료 후 오픈채팅방 숨김)
 */
const MOCK_PROGRAM_APPLICATIONS = [
  {
    id: 5001,
    programId: 4001,
    programType: 'CHALLENGE',
    programStatusType: 'PREV',
    programTitle: '[QA] 참여예정 · 참여코드 있음',
    programShortDesc: '클릭하면 참여코드 모달이 떠야 한다.',
    programThumbnail: '',
    programStartDate: daysFromNow(14),
    programEndDate: daysFromNow(45),
    createDate: daysFromNow(-2),
    status: 'WAITING',
    pricePlanType: 'PREMIUM',
    challengeOptionList: [],
    chatLink: MOCK_CHAT_LINK,
    chatPassword: 'lets2026',
  },
  {
    id: 5002,
    programId: 4002,
    programType: 'CHALLENGE',
    programStatusType: 'PREV',
    programTitle: '[QA] 참여예정 · 참여코드 없음',
    programShortDesc: '모달 없이 새 탭으로 바로 이동해야 한다.',
    programThumbnail: '',
    programStartDate: daysFromNow(20),
    programEndDate: daysFromNow(50),
    createDate: daysFromNow(-1),
    status: 'WAITING',
    pricePlanType: 'BASIC',
    challengeOptionList: [],
    chatLink: MOCK_CHAT_LINK,
    chatPassword: null,
  },
  {
    id: 5003,
    programId: 4003,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    programTitle: '[QA] 참여중 · 베이직 (버튼 2개)',
    programShortDesc: '대시보드 입장과 오픈채팅방 입장이 같이 보여야 한다.',
    programThumbnail: '',
    programStartDate: daysFromNow(-7),
    programEndDate: daysFromNow(21),
    createDate: daysFromNow(-20),
    status: 'IN_PROGRESS',
    pricePlanType: 'BASIC',
    challengeOptionList: [],
    chatLink: MOCK_CHAT_LINK,
    chatPassword: 'lets2026',
  },
  {
    id: 5004,
    programId: 4004,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    programTitle: '[QA] 참여중 · 라이트',
    programShortDesc: '라이트는 대시보드에 못 들어가므로 오픈채팅방만 보인다.',
    programThumbnail: '',
    programStartDate: daysFromNow(-5),
    programEndDate: daysFromNow(25),
    createDate: daysFromNow(-18),
    status: 'IN_PROGRESS',
    pricePlanType: 'LIGHT',
    challengeOptionList: [],
    chatLink: MOCK_CHAT_LINK,
    chatPassword: 'lets2026',
  },
  {
    id: 5005,
    programId: 4005,
    programType: 'LIVE',
    programStatusType: 'PROCEEDING',
    programTitle: '[QA] 참여중 · 라이브 클래스',
    programShortDesc: '챌린지가 아니므로 클래스 입장만 보여야 한다.',
    programThumbnail: '',
    programStartDate: daysFromNow(-3),
    programEndDate: daysFromNow(10),
    createDate: daysFromNow(-15),
    status: 'IN_PROGRESS',
    pricePlanType: null,
    challengeOptionList: [],
    chatLink: MOCK_CHAT_LINK,
    chatPassword: 'lets2026',
  },
  {
    id: 5006,
    programId: 4006,
    programType: 'CHALLENGE',
    programStatusType: 'POST',
    programTitle: '[QA] 참여완료 · 링크 있음',
    programShortDesc: '종료된 챌린지는 오픈채팅방 버튼을 감춘다.',
    programThumbnail: '',
    programStartDate: daysFromNow(-60),
    programEndDate: daysFromNow(-30),
    createDate: daysFromNow(-70),
    status: 'DONE',
    pricePlanType: 'STANDARD',
    challengeOptionList: [],
    chatLink: MOCK_CHAT_LINK,
    chatPassword: 'lets2026',
  },
];

export const handlers = [
  /**
   * (마이페이지) GET /user/applications — 신청현황 탭의 프로그램 신청목록.
   *
   * LC-3190 오픈채팅방 입장 버튼 QA 시드를 반환한다(MOCK_PROGRAM_APPLICATIONS).
   * chatLink/chatPassword 는 BE 미배포 필드라 여기서 먼저 넣어 화면을 검증한다.
   * 출시알림 탭 QA 는 이 목록과 무관하게 /magnet/mypage 를 쓴다.
   */
  http.get('*/user/applications', () => {
    return HttpResponse.json({
      status: 200,
      data: { applicationList: MOCK_PROGRAM_APPLICATIONS },
    });
  }),

  /**
   * (마이페이지) GET /magnet/mypage — 사용자가 신청한 마그넷 신청현황.
   * BE mypageMagnetListResponseSchema 일치. typeList 쿼리로 필터한다.
   * 출시알림 탭(typeList=LAUNCH_ALERT)에서 mutable 시드를 반환한다.
   */
  http.get('*/magnet/mypage', ({ request }) => {
    const typeList = new URL(request.url).searchParams.getAll('typeList');
    const magnetList =
      typeList.length === 0
        ? launchAlertMagnetList
        : launchAlertMagnetList.filter((m) => typeList.includes(m.type));
    return HttpResponse.json({ status: 200, data: { magnetList } });
  }),

  /**
   * (마이페이지) DELETE /magnet-application/:magnetId — 사용자 출시알림 신청취소.
   * 신규 BE API(§4.3) 목업. 성공 시 mutable 시드에서 해당 항목을 제거해
   * 이후 재조회에서 카드가 사라지도록 한다.
   */
  http.delete('*/magnet-application/:magnetId', ({ params }) => {
    const magnetId = Number(params.magnetId);
    launchAlertMagnetList = launchAlertMagnetList.filter(
      (m) => m.magnetId !== magnetId,
    );
    return HttpResponse.json({ status: 200, data: null });
  }),

  /**
   * (인증) POST /user/signin — 아무 이메일/비밀번호로 로그인 통과.
   * 실 BE 없이 단독 실행 가능하게 한다.
   * 주의: authStore.login()이 JWT payload에서 exp를 파싱하므로
   * 형식상 유효한 JWT여야 한다 (exp = 2100-01-01).
   */
  http.post('*/user/signin', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        accessToken: MOCK_JWT,
        refreshToken: MOCK_JWT,
      },
    });
  }),

  /** (인증) GET /user/is-mentor — 멘토 가드 통과 */
  http.get('*/user/is-mentor', () => {
    return HttpResponse.json({ status: 200, data: true });
  }),

  /** (인증) GET /user — 환영 메시지 등 사용자 정보 */
  http.get('*/user', () => {
    return HttpResponse.json({ status: 200, data: MOCK_USER });
  }),

  /**
   * (멘토) GET /challenge/mentor/feedback-management
   * 참여중인 챌린지별 서면 피드백 현황. BE mentorFeedbackManagementSchema 정확히 일치.
   *
   * 라우트 순서: generic challenge/:id 패턴보다 먼저 등록해야
   * `:id`가 "mentor"로 매칭되어 가로채는 것을 막는다.
   */
  http.get('*/challenge/mentor/feedback-management', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        challengeList: [
          {
            challengeId: 1,
            title: '기필코 경험정리 챌린지 21기',
            shortDesc: '3주간 경험정리 미션과 멘토 피드백으로 완성하는 자소서',
            startDate: '2026-04-14',
            endDate: '2026-05-04',
            feedbackMissions: [
              {
                missionId: 1001,
                missionTitle: '1회차 — 경험 리스트 작성',
                th: 1,
                submittedCount: 10,
                notSubmittedCount: 2,
                feedbackStatusCounts: [
                  { feedbackStatus: 'COMPLETED', count: 8 },
                  { feedbackStatus: 'IN_PROGRESS', count: 2 },
                ],
              },
              {
                missionId: 1002,
                missionTitle: '2회차 — 경험 구조화',
                th: 2,
                submittedCount: 11,
                notSubmittedCount: 1,
                feedbackStatusCounts: [
                  { feedbackStatus: 'WAITING', count: 7 },
                  { feedbackStatus: 'IN_PROGRESS', count: 4 },
                ],
              },
              {
                missionId: 1003,
                missionTitle: '3회차 — 자소서 초안 작성',
                th: 3,
                submittedCount: 0,
                notSubmittedCount: 0,
                feedbackStatusCounts: [],
              },
            ],
          },
          {
            challengeId: 2,
            title: '커리어 설계 챌린지 5기',
            shortDesc: '자신의 커리어 로드맵을 그려보는 2주 챌린지',
            startDate: '2026-04-15',
            endDate: '2026-04-28',
            feedbackMissions: [
              {
                missionId: 2001,
                missionTitle: '1회차 — 직무 탐색',
                th: 1,
                submittedCount: 7,
                notSubmittedCount: 1,
                feedbackStatusCounts: [
                  { feedbackStatus: 'COMPLETED', count: 2 },
                  { feedbackStatus: 'IN_PROGRESS', count: 3 },
                  { feedbackStatus: 'WAITING', count: 2 },
                ],
              },
              {
                missionId: 2002,
                missionTitle: '2회차 — 커리어 로드맵 작성',
                th: 2,
                submittedCount: 0,
                notSubmittedCount: 0,
                feedbackStatusCounts: [],
              },
            ],
          },
          {
            // 경험정리(EXPERIENCE_1/EXPERIENCE_2) 그룹핑 검증용 — 같은 th에 미션 2개.
            // BE `missionType` 필드 도착 전 선개발용 목업 (PRD §6.1). 필드 도착 시 이 챌린지만 정리.
            // ⚠️ 230 이상이어야 신규 mentee 출석 경로(`.../attendances/mentee`)를 타서
            // EXPERIENCE_PAIR_ATTENDANCE_BY_MISSION(아래)로 미션별 차등 출석이 적용된다.
            challengeId: 9902,
            title: '경험정리 페어 시나리오 챌린지',
            shortDesc: '경험정리 Lv.1/Lv.2 미션 그룹핑 검증용 목업',
            startDate: '2026-04-14',
            endDate: '2026-05-04',
            feedbackMissions: [
              // 케이스 A: EXPERIENCE_1만 제출됨, EXPERIENCE_2는 미제출 (같은 4회차)
              {
                missionId: 3401,
                missionTitle: '4회차 — 경험정리(Lv.1)',
                th: 4,
                missionType: 'EXPERIENCE_1',
                submittedCount: 6,
                notSubmittedCount: 0,
                feedbackStatusCounts: [
                  { feedbackStatus: 'COMPLETED', count: 6 },
                ],
              },
              {
                missionId: 3402,
                missionTitle: '4회차 — 경험정리(Lv.2)',
                th: 4,
                missionType: 'EXPERIENCE_2',
                submittedCount: 0,
                notSubmittedCount: 6,
                feedbackStatusCounts: [],
              },
              // 케이스 B: EXPERIENCE_2만 제출됨 (같은 5회차)
              {
                missionId: 3501,
                missionTitle: '5회차 — 경험정리(Lv.1)',
                th: 5,
                missionType: 'EXPERIENCE_1',
                submittedCount: 0,
                notSubmittedCount: 5,
                feedbackStatusCounts: [],
              },
              {
                missionId: 3502,
                missionTitle: '5회차 — 경험정리(Lv.2)',
                th: 5,
                missionType: 'EXPERIENCE_2',
                submittedCount: 5,
                notSubmittedCount: 0,
                feedbackStatusCounts: [
                  { feedbackStatus: 'IN_PROGRESS', count: 5 },
                ],
              },
              // 케이스 C: 두 미션 모두 제출 기록 있음 (같은 6회차, 예외 케이스 PRD §5-④)
              {
                missionId: 3601,
                missionTitle: '6회차 — 경험정리(Lv.1)',
                th: 6,
                missionType: 'EXPERIENCE_1',
                submittedCount: 3,
                notSubmittedCount: 1,
                feedbackStatusCounts: [
                  { feedbackStatus: 'COMPLETED', count: 3 },
                ],
              },
              {
                missionId: 3602,
                missionTitle: '6회차 — 경험정리(Lv.2)',
                th: 6,
                missionType: 'EXPERIENCE_2',
                submittedCount: 2,
                notSubmittedCount: 2,
                feedbackStatusCounts: [{ feedbackStatus: 'WAITING', count: 2 }],
              },
            ],
          },
        ],
      },
    });
  }),

  /**
   * (멘토) GET /challenge-mentor — 멘토 본인이 담당하는 챌린지 목록.
   * BE challengeMentorVoSchema 정확히 일치.
   *
   * 두 QA 시나리오의 챌린지를 한 목록에 합쳐 한 앱에서 양쪽 플로우에 진입 가능:
   *  - 1·2 (legacy) → 라이브 피드백 + legacy attendances 경로
   *  - 9901 (≥230)  → 서면 경험정리형 제출물 + 신규 mentee 경로
   */
  http.get('*/challenge-mentor', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        myChallengeMentorVoList: [
          {
            challengeMentorId: 11,
            challengeId: 1,
            programStatusType: 'PROCEEDING',
            title: '기필코 경험정리 챌린지 21기',
            shortDesc: '3주간 경험정리 미션과 멘토 피드백으로 완성하는 자소서',
            thumbnail: '',
            startDate: '2026-04-14',
            endDate: '2026-05-08',
          },
          {
            challengeMentorId: 12,
            challengeId: 2,
            programStatusType: 'PROCEEDING',
            title: '커리어 설계 챌린지 5기',
            shortDesc: '자신의 커리어 로드맵을 그려보는 2주 챌린지',
            thumbnail: '',
            startDate: '2026-04-15',
            endDate: '2026-05-08',
          },
          {
            challengeMentorId: 301,
            challengeId: MOCK_CHALLENGE_ID,
            programStatusType: 'PROCEEDING',
            title: '[목] 경험정리 챌린지 5기',
            shortDesc: 'MSW mock 챌린지',
            thumbnail: '',
            startDate: challengeStart.toISOString(),
            endDate: challengeEnd.toISOString(),
          },
        ],
      },
    });
  }),

  /**
   * (멘토) GET /challenge/:challengeId/mission/:missionId/feedback/attendances/mentee
   * 신규(≥230) 챌린지 멘티 제출 내역. BE mentorMenteeAttendanceListSchema 일치.
   *  - missionId가 EXPERIENCE_PAIR_ATTENDANCE_BY_MISSION에 있으면 그 미션 전용 출석
   *    (챌린지 9902 경험정리 페어 QA — 미션마다 달라야 케이스 A/B/C가 실제로 재현됨)
   *  - 9901 → 서면 경험정리 4케이스(MOCK_MENTEES)
   *  - 그 외(1·2) → 라이브 피드백 분포(MOCK_ATTENDANCE_LIST)
   *
   * ⚠️ 라우트 순서: 구체 경로(.../mentee)를 `:attendanceId`·`.../attendances` 보다 먼저 등록.
   * MSW는 등록 순서로 매칭하므로 mentee 가 가로채이지 않게 한다.
   */
  http.get(
    '*/challenge/:challengeId/mission/:missionId/feedback/attendances/mentee',
    ({ params }) => {
      const challengeId = Number(params.challengeId);
      const missionId = Number(params.missionId);
      const attendanceList =
        EXPERIENCE_PAIR_ATTENDANCE_BY_MISSION[missionId] ??
        (challengeId === MOCK_CHALLENGE_ID
          ? MOCK_MENTEES
          : MOCK_ATTENDANCE_LIST);
      return HttpResponse.json({
        status: 200,
        data: { attendanceList },
      });
    },
  ),

  /**
   * (멘토) GET /challenge/:cid/mission/:mid/feedback/attendances/:attendanceId
   * 멘토가 작성한 피드백 단건 — 작성 전 상태(null).
   * 주의: `.../mentee`(위) 뒤에 등록해야 `mentee`가 `:attendanceId`로 매칭되지 않는다.
   *
   * `preQuestion` 은 멘티 정보 영역(MenteeInfo)의 "사전 질문" 행으로 렌더된다.
   * 실제 멘티는 줄바꿈 포함 장문을 넣는 경우가 많아 목도 장문으로 둔다.
   */
  http.get(
    '*/challenge/:challengeId/mission/:missionId/feedback/attendances/:attendanceId',
    ({ params }) => {
      return HttpResponse.json({
        status: 200,
        data: {
          attendanceDetailVo: {
            // 9005(지각 제출 + 기작성)만 저장된 피드백을 돌려준다.
            // 지각 제출이라도 이미 쓴 내용을 숨기면 멘토가 혼란스러우므로 읽기 전용으로 남긴다.
            feedback:
              Number(params.attendanceId) === 9005 ? MOCK_SAVED_FEEDBACK : null,
            preQuestion:
              '이번 경험정리에서 서비스 기획 직무에 맞춰 프로젝트 경험을 정리했는데, 제가 맡은 역할이 기획보다는 운영에 가까웠던 것 같아 이 경험을 기획 직무 지원서에 그대로 써도 될지 고민입니다.\n' +
              '또 STAR 구조로 쓰다 보니 Situation 과 Task 가 계속 겹쳐서 분량만 늘어나는 느낌인데, 어느 정도까지 압축하는 게 좋을까요?\n' +
              '마지막으로 네이버처럼 규모가 큰 회사에 지원할 때 소규모 팀 프로젝트 경험이 약점으로 보일지, 아니면 오히려 주도적으로 일한 근거로 쓸 수 있을지 의견이 궁금합니다.',
          },
        },
      });
    },
  ),

  /**
   * (멘토) GET /challenge/:challengeId/mission/:missionId/feedback/attendances
   * legacy(<230) 챌린지 제출자(출석). BE challengeMissionFeedbackAttendanceListSchema 일치.
   * 라이브 QA 시드 챌린지(1·2)는 legacy 라 ChallengeDataFetcher 가 이 경로를 사용.
   */
  http.get(
    '*/challenge/:challengeId/mission/:missionId/feedback/attendances',
    () => {
      return HttpResponse.json({
        status: 200,
        data: { attendanceList: MOCK_ATTENDANCE_LIST },
      });
    },
  ),

  /**
   * (멘토) GET /challenge/:challengeId/mission/feedback
   * 챌린지 피드백 미션 목록. startDate/endDate 는 datetime({ local: true }) 포맷 준수.
   *  - 9901 → 서면 경험정리 미션(MOCK_MISSION_ID), 제출기간이 오늘 포함
   *  - 1·2  → 1회차 서면 피드백(endDate 4/25·4/27 → written-feedback 바 파생)
   */
  http.get('*/challenge/:challengeId/mission/feedback', ({ params }) => {
    const challengeId = Number(params.challengeId);
    if (challengeId === MOCK_CHALLENGE_ID) {
      return HttpResponse.json({
        status: 200,
        data: {
          missionList: [
            {
              id: MOCK_MISSION_ID,
              title: '경험 정리하기',
              th: 3,
              startDate: missionStart.toISOString(),
              endDate: missionEnd.toISOString(),
              challengeOptionCode: 'WRITTEN_1',
              challengeOptionTitle: '서면 피드백',
              submittedCount: 3,
              totalCount: 4,
            },
          ],
        },
      });
    }
    const liveMissionEnd =
      challengeId === 2 ? '2026-04-27T23:59:59' : '2026-04-25T23:59:59';
    const liveMissionStart =
      challengeId === 2 ? '2026-04-22T00:00:00' : '2026-04-20T00:00:00';
    return HttpResponse.json({
      status: 200,
      data: {
        missionList: [
          {
            id: challengeId * 1000 + 1,
            title: '1회차 서면 피드백',
            th: 1,
            startDate: liveMissionStart,
            endDate: liveMissionEnd,
            submittedCount: 0,
            totalCount: 0,
          },
        ],
      },
    });
  }),

  /**
   * (멘토) GET /admin/attendance/user-experiences/:missionId?userId=
   * 경험정리 제출물 — userId별 분기 (501: 3건 / 503: 0건).
   * 네트워크 탭에서 미제출자(504) 선택 시 이 요청이 없어야 정상.
   */
  http.get('*/admin/attendance/user-experiences/:missionId', ({ request }) => {
    const userId = new URL(request.url).searchParams.get('userId') ?? '';
    return HttpResponse.json({
      status: 200,
      data: { userExperiences: MOCK_EXPERIENCES_BY_USER[userId] ?? [] },
    });
  }),

  /**
   * (멘티) GET /challenge/:id/feedback/live
   * 응답에 **예약 확정된 라이브 피드백 1건**을 박는다.
   * → 멘티 화면에서 "예약 완료" 카드로 보임.
   */
  http.get('*/challenge/:id/feedback/live', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        liveFeedbackList: [
          {
            thumbnail: '',
            desktopThumbnail: '',
            missionTitle: '1주차 자소서 라이브 피드백',
            missionId: 70_001,
            missionTh: 1,
            missionStartDate: isoMissionStart,
            missionEndDate: isoMissionEnd,
            feedbackId: MOCK_FEEDBACK_ID,
            // 예약 확정 세션 — liveFeedbackItemSchema 의 nullable 필수 키를 모두 채운다.
            feedbackStartDate: reservationStart,
            feedbackEndDate: reservationEnd,
            feedbackStatus: 'RESERVED',
            // 'PRESENT' = 미션 제출 완료 → resolveStatus 가 'reserved' 로 도출되어
            // 멘티 화면에 "LIVE 피드백 입장하기" 버튼이 노출된다(미제출=null 이면 'prev' 로
            // 빠져 예약/제출 유도 화면만 보임).
            attendanceStatus: 'PRESENT',
            mentorStatus: 'PENDING',
            menteeStatus: 'PENDING',
            mentorInfo: MOCK_MENTOR,
          },
        ],
      },
    });
  }),

  /**
   * (멘토) GET /feedback/mentor/slot
   * BE feedbackSlotSchema 정확히 일치.
   *  - 예약 확정 슬롯 1건(Jitsi QA용, 시작 임박) +
   *  - 캘린더 오픈기간 파생용 OPEN 슬롯 분포(4/24~4/28).
   * → 멘토 schedule 캘린더에서 `live-feedback-mentor-open` 바 1개로 묶임.
   */
  http.get('*/feedback/mentor/slot', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        feedbackSlotList: [
          {
            feedbackSlotId: MOCK_FEEDBACK_ID,
            startDate: reservationStart,
            endDate: reservationEnd,
            status: 'RESERVED',
          },
          ...calendarSlotList,
        ],
      },
    });
  }),

  /**
   * (멘토) GET /feedback/mentor — 멘토 본인 라이브 피드백 목록.
   * BE feedbackMentorSchema 정확히 일치. 예약 확정 1건을 박는다.
   * → 예약 현황 페이지에서 RESERVED 항목으로 보임.
   *
   * 라우트 순서: 슬롯(feedback/mentor/slot, 위) 뒤, generic detail(feedback/:feedbackId, 아래) 앞.
   * MSW는 등록 순서대로 매칭하므로 generic detail 핸들러보다 먼저 둬야 가로채기를 막는다.
   */
  http.get('*/feedback/mentor', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        // 단일 시드 공유: 기본 RESERVED + 캘린더 RESERVED 분포 + COMPLETED 분포.
        feedbackList: MENTOR_FEEDBACK_SEED,
      },
    });
  }),

  /**
   * (멘토) GET /feedback/mentor/:feedbackId — 멘토 단건 상세.
   * BE feedbackDetailMentorSchema 정확히 일치. 희망정보·사전질문·attendanceUrl 포함.
   * 시작 5분 후 / 종료 35분 후 → T-10 룰로 즉시 입장 활성화.
   *
   * 라우트 순서: 멘토 목록(feedback/mentor, 위) 뒤, generic detail(feedback/:feedbackId, 아래) 앞.
   */
  http.get('*/feedback/mentor/:feedbackId', ({ params }) => {
    const feedbackId = Number(params.feedbackId);
    // 목록과 동일 시드에서 세션을 찾아 일시/프로그램/멘티/상태를 도출한다.
    // 못 찾으면 기본 세션(MOCK_FEEDBACK_ID)으로 폴백하되 요청 feedbackId는 echo.
    const base =
      MENTOR_FEEDBACK_SEED.find((s) => s.feedbackId === feedbackId) ??
      MENTOR_FEEDBACK_SEED[0];
    return HttpResponse.json({
      status: 200,
      data: {
        feedbackInfo: {
          feedbackId,
          startDate: base.startDate,
          endDate: base.endDate,
          meetingUrl: meetingUrlStore.get(feedbackId) ?? base.meetingUrl,
          status: base.status,
          programTitle: base.programTitle,
          menteeName: base.menteeName,
          mentorStatus: base.mentorStatus,
          menteeStatus: base.menteeStatus,
          // 상세 전용 필드는 기본값 유지(세션별로 다를 필요 없음).
          // 노션 제출물 — 라이브 모달 좌측 임베드 QA용(실제 공개 노션 페이지).
          attendanceUrl:
            'https://boggy-chestnut-60b.notion.site/35f4740158fa80b4b79cd69e01eddca2',
          attendanceStatus: 'PRESENT',
          menteeWishField: '기획 / PM / PO',
          menteeWishIndustry: 'IT · 플랫폼, 금융 · 핀테크',
          menteeWishCompany: 'Toss, Kakao',
          preQuestion:
            '작성한 자기소개서 피드백을 받고 싶어서 신청하게 되었습니다.\n' +
            '특히 지원 동기 문항에서 회사와 제 경험을 연결하는 부분이 계속 겉도는 느낌이라, 어떤 축으로 엮어야 설득력이 생길지 듣고 싶습니다.\n' +
            '그리고 결론을 앞에 두는 두괄식으로 고쳐봤는데 오히려 근거가 빈약해 보이는 것 같아 구성도 봐주시면 감사하겠습니다.',
          // LC-3181 — 라이브에서 서면 피드백 작성. BE 미배포 필드(§3.3 요청 대상).
          attendanceId: 9001,
          // 작성 이력이 있는 상태 — 미리보기 카드 QA 용.
          feedback:
            '{"root": {"children": [{"children": [{"detail": 0, "format": 0, "mode": "normal", "style": "", "text": "지원 동기 문항은 회사 이야기보다 본인 경험이 앞서야 설득이 됩니다.", "type": "text", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "type": "paragraph", "version": 1}, {"children": [{"detail": 0, "format": 0, "mode": "normal", "style": "", "text": "STAR 는 Situation 을 한 문장으로 줄이고 Action 에 분량을 몰아주세요.", "type": "text", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "type": "paragraph", "version": 1}], "direction": "ltr", "format": "", "indent": 0, "type": "root", "version": 1}}',
          feedbackStatus: 'IN_PROGRESS',
        },
      },
    });
  }),

  /**
   * (멘토) PATCH /feedback/mentor/:feedbackId — 멘티 출석 상태 수정.
   * BE는 200 빈 본문을 반환한다.
   */
  http.patch('*/feedback/mentor/:feedbackId', () => {
    return HttpResponse.json({ status: 200, data: null });
  }),

  /**
   * (양쪽 공통) PATCH /feedback/:feedbackId/meeting-url
   * 먼저 입장한 쪽(멘토 or 멘티)이 헬스체크 후 보낸 base URL 을 `base + meetingRoom` 으로
   * 합성해 meetingUrlStore 에 보관한다(BE 합성 모사). 이후 양쪽 상세 GET 이 같은
   * meetingUrl 을 받아 동일 방으로 수렴 → 입장 순서 무관(데드락 방지) 흐름을 QA 한다.
   */
  http.patch(
    '*/feedback/:feedbackId/meeting-url',
    async ({ params, request }) => {
      const feedbackId = Number(params.feedbackId);
      const body = (await request.json().catch(() => null)) as {
        meetingUrl?: string;
      } | null;
      const base = body?.meetingUrl ?? '';
      meetingUrlStore.set(feedbackId, `${base}${MOCK_MEETING_ROOM}`);
      return HttpResponse.json({ status: 200, data: null });
    },
  ),

  /**
   * (양쪽 공통, 멘티 상세) GET /feedback/:feedbackId
   * BE feedbackDetailSchema 일치(mentorStatus/menteeStatus/score/review nullable 포함).
   * 입장창을 넉넉히 열어(1시간 전 시작 ~ 12시간 후 종료) 즉시 입장 활성.
   * meetingUrl 은 누군가 입장 등록(PATCH)한 시점부터 채워진다(meetingUrlStore).
   */
  http.get('*/feedback/:feedbackId', ({ params }) => {
    const feedbackId = Number(params.feedbackId);
    const base =
      MENTOR_FEEDBACK_SEED.find((s) => s.feedbackId === feedbackId) ??
      MENTOR_FEEDBACK_SEED[0];
    return HttpResponse.json({
      status: 200,
      data: {
        feedbackInfo: {
          feedbackId,
          startDate: base.startDate,
          endDate: base.endDate,
          meetingUrl: meetingUrlStore.get(feedbackId) ?? base.meetingUrl,
          status: base.status,
          mentorStatus: base.mentorStatus,
          menteeStatus: base.menteeStatus,
          score: null,
          review: null,
          // 입장 페이지/모달(웹) 표시용 — 일정 요약·상대방·노션 제출물.
          programTitle: base.programTitle,
          missionTh: 2,
          menteeName: base.menteeName,
          mentorName: '김멘토',
          preQuestion:
            '작성한 자기소개서 피드백을 받고 싶어서 신청하게 되었습니다.',
          attendanceUrl:
            'https://boggy-chestnut-60b.notion.site/35f4740158fa80b4b79cd69e01eddca2',
        },
      },
    });
  }),

  // ─────────────────────────────────────────────────────────────
  // 1대1 라이브 멘토링 (독립 마켓플레이스) — 전부 net-new, 결제/예약 실행 없음.
  // 공유 목 데이터(./data/liveMentoring)를 그대로 서빙한다.
  // ─────────────────────────────────────────────────────────────

  /**
   * (관리자) GET /admin/live-mentoring — 상품 목록.
   *
   * 공개 목록과 달리 기간·노출 조건을 걸지 않는다. `page` 는 1-based 다.
   *
   * **공개 목록 핸들러보다 먼저 등록해야 한다** — 아래 공개 목록의 와일드카드 패턴이
   * `/admin/live-mentoring` 까지 삼켜버려서, 순서가 뒤바뀌면 관리자 요청이
   * 공개 목록 응답을 받는다.
   */
  http.get('*/admin/live-mentoring', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const size = Number(url.searchParams.get('size') ?? '20');

    const all = [adminLiveMentoringVo(), ...adminFixtureRows];
    const filtered = status ? all.filter((row) => row.status === status) : all;
    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const start = (page - 1) * size;

    return HttpResponse.json({
      status: 200,
      data: {
        liveMentoringList: filtered.slice(start, start + size),
        pageInfo: {
          // 서버 `PageInfo` 는 0-based 인덱스를 담는다(요청은 1-based).
          pageNum: page - 1,
          pageSize: size,
          totalElements,
          totalPages,
        },
      },
    });
  }),

  /**
   * (공개) GET /live-mentoring?page&size&categories&sortType
   *
   * 실제 백엔드 `GetLiveMentoringOpeningsResponseDto` 계약을 그대로 흉내낸다:
   * 응답은 `{ openingList, pageInfo }`, `page`는 1-based
   * (서버 `spring.data.web.pageable.one-indexed-parameters: true`),
   * `categories`는 반복 파라미터(`categories=A&categories=B`)다.
   */
  http.get('*/live-mentoring', ({ request }) => {
    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
    const size = Number(url.searchParams.get('size') ?? '9');
    const categories = url.searchParams.getAll(
      'categories',
    ) as LiveMentoringCategory[];
    const sortType = url.searchParams.get('sortType');

    let list: LiveMentorCard[] =
      categories.length > 0
        ? LIVE_MENTOR_CARDS.filter((c) =>
            c.categories.some((each) => categories.includes(each)),
          )
        : [...LIVE_MENTOR_CARDS];

    // 서버 `LiveMentoringSortType` 에는 `LATEST` 하나뿐이다.
    if (sortType === 'LATEST') {
      list = [...list].sort((a, b) => b.mentorId - a.mentorId);
    }

    const totalElements = list.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const start = (page - 1) * size;
    const openingList = list.slice(start, start + size).map(toOpeningDto);

    return HttpResponse.json({
      status: 200,
      data: {
        openingList,
        pageInfo: { pageNum: page, pageSize: size, totalElements, totalPages },
      },
    });
  }),

  /**
   * (공개) GET /live-mentoring/mentors/:mentorId/slots — 예약 가능 슬롯.
   *
   * 서버 `getAvailableSlots` 는 활성 개설이 없으면 빈 배열, 있으면 `OPEN` 이면서
   * 시작이 미래인 슬롯만 내려준다. 프론트는 개설 상태와 슬롯 상태를 조합하지 않는다.
   *
   * **멘토 상세 핸들러보다 먼저 등록한다** — 경로가 한 세그먼트 더 길어 매칭 자체는
   * 갈리지만, 순서에 기대지 않도록 위에 둔다.
   */
  http.get('*/live-mentoring/mentors/:mentorId/slots', ({ params }) => {
    const mentorId = Number(params.mentorId);
    // "나"(mentorId 1)는 개설·슬롯 상태를 실제로 들고 있다. 나머지 시드 멘토는
    // 공개 목록에 떠 있는 = 활성 개설이 있는 상태로 취급한다.
    const isMe = mentorId === 1;
    if (isMe && activeOpening() === null) {
      return slotListResponse([]);
    }
    const slots = isMe
      ? liveMentoringState.slots
      : (LIVE_MENTORING_SLOTS_BY_MENTOR[mentorId] ?? []);
    const now = liveMentoringNow();
    return slotListResponse(
      slots.filter((slot) => slot.status === 'OPEN' && slot.startDate > now),
    );
  }),

  /**
   * (공개) GET /live-mentoring/mentors/:mentorId — 멘토 상세(+reviews).
   * 존재하지 않는 id는 첫 멘토로 폴백하되 mentorId는 echo.
   */
  http.get('*/live-mentoring/mentors/:mentorId', ({ params }) => {
    const mentorId = Number(params.mentorId);
    const detail = LIVE_MENTOR_DETAILS[mentorId] ?? LIVE_MENTOR_DETAILS[1];
    return HttpResponse.json({
      status: 200,
      data: { ...detail, mentorId },
    });
  }),

  /**
   * (멘토) GET /mentor/live-mentoring/settings — 오픈 설정(메타) 조회.
   */
  http.get('*/mentor/live-mentoring/settings', () => {
    return HttpResponse.json({ status: 200, data: settingsResponse() });
  }),

  /**
   * (멘토) PATCH /user-career/my/:careerId/representative — 대표 경력 지정.
   * 요청 바디는 없고, 기존 대표 경력은 서버가 자동 해제한다(단일 값으로 덮어쓰기).
   */
  http.patch('*/user-career/my/:careerId/representative', ({ params }) => {
    representativeCareerId = Number(params.careerId);
    return HttpResponse.json({ status: 200, data: { isSuccess: true } });
  }),

  /**
   * (멘토) PUT /mentor/live-mentoring/settings — 상품 설정 저장.
   *
   * 백엔드는 title/categories/durations를 받는다. 진행시간도 이 요청으로 저장한다.
   * 상품이 없으면 이 요청이 `DRAFT` 로 상품을 만든다.
   */
  http.put('*/mentor/live-mentoring/settings', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      categories?: LiveMentoringCategory[];
      durations?: number[];
    };

    if (!isSettingsEditable()) {
      return liveMentoringError(
        409,
        'LIVE_MENTORING_LOCKED',
        '현재 상태에서는 라이브 멘토링 설정을 수정할 수 없습니다.',
      );
    }
    if (!body.title?.trim() || !body.categories?.length) {
      return liveMentoringError(400, 'BAD_REQUEST', '잘못된 요청입니다.');
    }
    if (!body.durations?.length) {
      return liveMentoringError(400, 'BAD_REQUEST', '잘못된 요청입니다.');
    }
    if (body.durations.some((duration) => duration !== 30 && duration !== 60)) {
      return liveMentoringError(
        400,
        'INVALID_LIVE_MENTORING_DURATION',
        '지원하지 않는 라이브 멘토링 진행 시간입니다.',
      );
    }

    liveMentoringState.title = body.title;
    liveMentoringState.categories = body.categories;
    liveMentoringState.durations = body.durations as LiveMentoringDuration[];
    if (liveMentoringState.liveMentoringId === null) {
      liveMentoringState.liveMentoringId = 1;
      liveMentoringState.status = 'DRAFT';
    }
    return HttpResponse.json({ status: 200, data: settingsResponse() });
  }),

  /**
   * (멘토) POST /mentor/live-mentoring/openings — 개설.
   *
   * `POST /submit` 이 사라지면서 최초 개설과 재개설이 이 하나로 합쳐졌다. 관리자 검토
   * 단계가 없어(자가승인), 한 요청에서 제목·타입·진행시간 저장 → `DRAFT → APPROVED`
   * 전이 → 개설(opening) 생성까지 처리한다.
   *
   * 응답은 개설 이력이다 — 화면이 방금 만들어진 개설의 id 로 "바로 내리기"를 할 수 있어야 한다.
   */
  http.post('*/mentor/live-mentoring/openings', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as {
      title?: string;
      categories?: LiveMentoringCategory[];
      durations?: number[];
    };

    if (liveMentoringState.liveMentoringId === null) {
      return liveMentoringError(
        404,
        'LIVE_MENTORING_NOT_FOUND',
        '라이브 멘토링을 찾을 수 없습니다.',
      );
    }
    if (!body.title?.trim() || !body.categories?.length) {
      return liveMentoringError(400, 'BAD_REQUEST', '잘못된 요청입니다.');
    }
    if (!body.durations?.length) {
      return liveMentoringError(400, 'BAD_REQUEST', '잘못된 요청입니다.');
    }
    if (body.durations.some((duration) => duration !== 30 && duration !== 60)) {
      return liveMentoringError(
        400,
        'INVALID_LIVE_MENTORING_DURATION',
        '지원하지 않는 라이브 멘토링 진행 시간입니다.',
      );
    }
    // 활성 개설이 있으면 서버가 막는다 — 개설은 한 번에 하나뿐이다.
    if (activeOpening() !== null) {
      return liveMentoringError(
        409,
        'LIVE_MENTORING_LOCKED',
        '현재 상태에서는 라이브 멘토링 설정을 수정할 수 없습니다.',
      );
    }

    const durations = body.durations as LiveMentoringDuration[];
    liveMentoringState.title = body.title;
    liveMentoringState.categories = body.categories;
    liveMentoringState.durations = durations;
    // 최초 개설이면 `DRAFT → APPROVED` 로 전이한다. 재개설이면 이미 APPROVED 다.
    if (liveMentoringState.status === 'DRAFT') {
      liveMentoringState.status = 'APPROVED';
      liveMentoringState.approvedAt = liveMentoringNow();
      liveMentoringState.approvedByUserId = 1;
    }
    liveMentoringState.openings.unshift({
      openingId: nextOpeningId++,
      status: 'OPEN',
      durationPrices: durations.map((duration) => ({
        duration,
        price: getPriceByDuration(duration),
      })),
      openedAt: liveMentoringNow(),
      closedAt: null,
      closeReason: null,
    });
    return HttpResponse.json({
      status: 200,
      data: openingHistoryResponse(),
    });
  }),

  /**
   * (멘토) PATCH /mentor/live-mentoring/openings/:openingId/close — 본인 개설 종료.
   * 예약 존재 여부를 검사하지 않고 종료한다. 이미 종료된 개설도 200 이다.
   */
  http.patch(
    '*/mentor/live-mentoring/openings/:openingId/close',
    ({ params }) => {
      const found = closeOpeningById(
        Number(params.openingId),
        'MENTOR_CANCELED',
        1,
      );
      if (!found) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }
      return HttpResponse.json({ status: 200, data: null });
    },
  ),

  /**
   * (관리자) 승인·반려 엔드포인트는 없다.
   * `LiveMentoringV1AdminController`에는 목록 조회와 강제 종료 두 API뿐이다 — 자가승인
   * 전환으로 검토·승인·반려 단계 자체가 사라졌다(제출 즉시 `submit()`이 승인+개설까지
   * 처리한다, 4.2 참고). 등록하지 않은 라우트는 `onUnhandledRequest` 설정에 따라
   * bypass/에러 처리된다 — 존재하지 않는 API라는 걸 목도 동일하게 반영한다.
   */

  /** (관리자) PATCH /admin/live-mentoring/openings/:openingId/close — 강제 종료. */
  http.patch(
    '*/admin/live-mentoring/openings/:openingId/close',
    ({ params }) => {
      const openingId = Number(params.openingId);
      const fixture = adminFixtureRows.find(
        (row) => row.currentOpening?.openingId === openingId,
      );
      if (fixture?.currentOpening) {
        fixture.currentOpening.status = 'CLOSED';
        fixture.currentOpening.closedAt = liveMentoringNow();
        fixture.currentOpening.closeReason = 'ADMIN_FORCED';
        fixture.currentOpening.closedByUserId = 99;
        return HttpResponse.json({ status: 200, data: null });
      }
      const found = closeOpeningById(openingId, 'ADMIN_FORCED', 99);
      if (!found) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }
      return HttpResponse.json({ status: 200, data: null });
    },
  ),

  /**
   * (멘토) GET /mentor/live-mentoring/template — 상세 페이지 템플릿 조회.
   * 저장분(detailPageState)을 돌려주므로 저장 → 재조회 흐름을 확인할 수 있다.
   */
  http.get('*/mentor/live-mentoring/template', () => {
    return HttpResponse.json({ status: 200, data: detailPageResponse() });
  }),

  /**
   * (멘토) PUT /mentor/live-mentoring/template — 저장.
   *
   * 요청 바디를 서버 요청 DTO(`UpdateLiveMentoringDetailPageRequestDto`) 모양으로
   * 검증한다. 실제 서버는 모르는 키를 무시하지만(`@JsonIgnoreProperties`), 그 관대함
   * 때문에 "편집했는데 저장되지 않는 필드"(`intro`)가 오래 남아 있었다. 목은 일부러
   * 더 엄격하게 막아 프론트가 보내면 안 되는 키를 여기서 드러낸다.
   *
   * 응답은 서버와 같게 저장 후의 상세 페이지 전체다(요청 바디 echo 가 아니다).
   */
  http.put('*/mentor/live-mentoring/template', async ({ request }) => {
    const body = await request.json().catch(() => null);
    if (body === null || typeof body !== 'object' || Array.isArray(body)) {
      return liveMentoringError(400, 'BAD_REQUEST', '잘못된 요청입니다.');
    }

    const keys = Object.keys(body);
    const unknownKeys = keys.filter(
      (key) => !DETAIL_PAGE_REQUEST_KEYS.includes(key as DetailPageRequestKey),
    );
    const missingKeys = DETAIL_PAGE_REQUEST_KEYS.filter(
      (key) => !keys.includes(key),
    );
    if (unknownKeys.length > 0) {
      return liveMentoringError(
        400,
        'BAD_REQUEST',
        `요청 DTO에 없는 필드입니다: ${unknownKeys.join(', ')}`,
      );
    }
    if (missingKeys.length > 0) {
      return liveMentoringError(
        400,
        'BAD_REQUEST',
        `필수 필드가 없습니다: ${missingKeys.join(', ')}`,
      );
    }

    detailPageState = {
      ...detailPageState,
      ...(body as Partial<LiveMentoringTemplate>),
    };
    return HttpResponse.json({ status: 200, data: detailPageResponse() });
  }),

  /**
   * (멘토) GET /mentor/live-mentoring/open-status — 개설 이력.
   */
  http.get('*/mentor/live-mentoring/open-status', () => {
    return HttpResponse.json({ status: 200, data: openingHistoryResponse() });
  }),

  /**
   * (멘토) GET /mentor/live-mentoring/reservations/{applicationId} — 예약 1건의
   * 질문·첨부 상세.
   *
   * **목록 핸들러보다 먼저 등록해야 한다** — 아래 목록 패턴(와일드카드 +
   * `/mentor/live-mentoring/reservations`)이 이 경로까지 삼켜서, 순서가 뒤바뀌면
   * 상세 요청이 목록 응답을 받는다. 같은 함정이 관리자 상품 목록에도 있다(위 주석 참고).
   *
   * 동의 미체크 건은 목 데이터 단계에서 이미 `attachmentUrl` 이 null 이다. 핸들러가
   * 다시 지우지 않는다 — 서버가 비워 내리는 계약(PRD 4.4)을 목 데이터가 그대로 담는다.
   */
  http.get(
    '*/mentor/live-mentoring/reservations/:applicationId',
    ({ params }) => {
      const applicationId = Number(params.applicationId);
      const detail = MENTOR_LIVE_MENTORING_RESERVATION_DETAILS.find(
        (d) => d.applicationId === applicationId,
      );

      if (!detail) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }

      return HttpResponse.json({ status: 200, data: detail });
    },
  ),

  /**
   * (양쪽 공통) GET /live-mentoring/applications/:applicationId/entry
   *
   * 멘토·멘티가 같은 경로로 받는 입장 정보다. 목 사용자는 항상 멘토 시점(MOCK_USER,
   * id=1)으로 로그인하므로 `myRole` 을 고정으로 `'MENTOR'` 로 낸다 — 실 서버는
   * 요청자와 신청의 멘토·멘티 id 를 대조해 판정하지만, 목에는 그 판정에 쓸 두
   * 번째 사용자 컨텍스트가 없다.
   */
  http.get(
    '*/live-mentoring/applications/:applicationId/entry',
    ({ params }) => {
      const applicationId = Number(params.applicationId);
      const reservation = MENTOR_LIVE_MENTORING_RESERVATIONS.find(
        (r) => r.applicationId === applicationId,
      );
      const detail = MENTOR_LIVE_MENTORING_RESERVATION_DETAILS.find(
        (d) => d.applicationId === applicationId,
      );
      if (!reservation || !detail) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }
      return HttpResponse.json({
        status: 200,
        data: {
          applicationId,
          myRole: 'MENTOR',
          productName: reservation.productName,
          durationMinutes: reservation.durationMinutes,
          reservationStartAt: reservation.reservationStartAt,
          reservationEndAt: reservation.reservationEndAt,
          mentorName: '김멘토',
          menteeName: reservation.menteeName,
          questionDeferred: detail.questionDeferred,
          questionContent: detail.questionContent,
          attachmentType: detail.attachmentType,
          attachmentUrl: detail.mentorShareAgreed ? detail.attachmentUrl : null,
          mentorStatus: detail.mentorStatus,
          menteeStatus: detail.menteeStatus,
          meetingUrl: detail.meetingUrl,
        },
      });
    },
  ),

  /**
   * (양쪽 공통) PATCH /live-mentoring/applications/:applicationId/entry/meeting-url
   *
   * 먼저 입장한 쪽이 만든 방을 그대로 유지한다 — `/mentor/.../meeting-url` 목과
   * 같은 덮어쓰기 방지 규칙이다.
   */
  http.patch(
    '*/live-mentoring/applications/:applicationId/entry/meeting-url',
    async ({ params, request }) => {
      const applicationId = Number(params.applicationId);
      const detail = MENTOR_LIVE_MENTORING_RESERVATION_DETAILS.find(
        (d) => d.applicationId === applicationId,
      );
      if (!detail) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }
      const { meetingUrlBase } = (await request.json()) as {
        meetingUrlBase: string;
      };
      if (!detail.meetingUrl) {
        detail.meetingUrl = `${meetingUrlBase}mock-entry-room-${applicationId}`;
      }
      return HttpResponse.json({ status: 200, data: detail.meetingUrl });
    },
  ),

  /**
   * (멘토) PATCH .../reservations/{applicationId}/attendance — 출석 부분 갱신.
   *
   * 보내지 않은 쪽은 그대로 둔다. 목 데이터를 직접 고쳐 두어야 다시 조회했을 때
   * 화면이 바뀐 값을 본다.
   */
  http.patch(
    '*/mentor/live-mentoring/reservations/:applicationId/attendance',
    async ({ params, request }) => {
      const applicationId = Number(params.applicationId);
      const detail = MENTOR_LIVE_MENTORING_RESERVATION_DETAILS.find(
        (d) => d.applicationId === applicationId,
      );
      if (!detail) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }
      const body = (await request.json()) as {
        mentorStatus?: 'PENDING' | 'PRESENT' | 'ABSENT';
        menteeStatus?: 'PENDING' | 'PRESENT' | 'ABSENT';
      };
      if (body.mentorStatus) detail.mentorStatus = body.mentorStatus;
      if (body.menteeStatus) detail.menteeStatus = body.menteeStatus;
      return HttpResponse.json({ status: 200, data: null });
    },
  ),

  /**
   * (멘토) PATCH .../reservations/{applicationId}/meeting-url — 회의실 생성.
   *
   * 서버와 같이 **이미 방이 있으면 덮어쓰지 않고** 기존 주소를 돌려준다. 멘토와 멘티가
   * 거의 동시에 눌렀을 때 나중 요청이 방을 바꾸면 먼저 들어간 사람만 빈 방에 남는다.
   */
  http.patch(
    '*/mentor/live-mentoring/reservations/:applicationId/meeting-url',
    async ({ params, request }) => {
      const applicationId = Number(params.applicationId);
      const detail = MENTOR_LIVE_MENTORING_RESERVATION_DETAILS.find(
        (d) => d.applicationId === applicationId,
      );
      if (!detail) {
        return liveMentoringError(
          404,
          'LIVE_MENTORING_NOT_FOUND',
          '라이브 멘토링을 찾을 수 없습니다.',
        );
      }
      const { meetingUrlBase } = (await request.json()) as {
        meetingUrlBase: string;
      };
      if (!detail.meetingUrl) {
        detail.meetingUrl = `${meetingUrlBase}mock-room-${applicationId}`;
      }
      return HttpResponse.json({ status: 200, data: detail.meetingUrl });
    },
  ),

  /**
   * (멘토) GET /mentor/live-mentoring/reservations — 본인 1대1 예약 목록.
   *
   * 서버가 결제 완료 확정 건(CONFIRMED)만, 본인 건만 내리므로 mock 도 확정 건만 담는다.
   * `startDate`/`endDate` 가 오면 예약 시작 시각 기준으로 좁힌다(서버와 같은 기준).
   */
  http.get('*/mentor/live-mentoring/reservations', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('startDate');
    const to = url.searchParams.get('endDate');

    const reservationList = MENTOR_LIVE_MENTORING_RESERVATIONS.filter((r) => {
      const startMs = new Date(r.reservationStartAt).getTime();
      if (from && startMs < new Date(from).getTime()) return false;
      if (to && startMs > new Date(to).getTime()) return false;
      return true;
    });

    return HttpResponse.json({ status: 200, data: { reservationList } });
  }),
];
