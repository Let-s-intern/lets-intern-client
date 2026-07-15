import { http, HttpResponse } from 'msw';

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

/** 김경험(userId 501)의 경험정리 제출물 — STAR 전체 필드 채움 */
const MOCK_EXPERIENCES_BY_USER: Record<string, unknown[]> = {
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

export const handlers = [
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
      const attendanceList =
        challengeId === MOCK_CHALLENGE_ID ? MOCK_MENTEES : MOCK_ATTENDANCE_LIST;
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
   */
  http.get(
    '*/challenge/:challengeId/mission/:missionId/feedback/attendances/:attendanceId',
    () => {
      return HttpResponse.json({
        status: 200,
        data: { attendanceDetailVo: { feedback: null } },
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
            '작성한 자기소개서 피드백을 받고 싶어서 신청하게 되었습니다.',
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
];
