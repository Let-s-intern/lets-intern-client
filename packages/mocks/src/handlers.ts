import { http, HttpResponse } from 'msw';

/**
 * MSW 핸들러 — Jitsi 통합 QA용 **최소 인터셉트**.
 *
 * 원칙: 라이브 피드백 1건이 양쪽(멘티/멘토)에 "예약 확정" 상태로 보이게 하기 위한
 * **3개 엔드포인트만 가로챈다**. 그 외 모든 요청(`/challenge/:id`, `/user/me`,
 * `/challenge/:id/schedule` 등)은 `onUnhandledRequest: 'bypass'`로 BE 그대로 통과.
 *
 * 활성화: `pnpm dev:mock`(또는 dev:mock:web / dev:mock:mentor)으로 띄울 때만.
 *
 * URL 매칭: 와일드카드 prefix(asterisk + slash) 패턴으로 axios baseURL 무관.
 */

/** 양측이 같은 방으로 수렴하기 위한 단일 feedbackId */
export const MOCK_FEEDBACK_ID = 999999;

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

const now = new Date();
const isoMissionStart = new Date(
  now.getTime() - 7 * 24 * 60 * 60 * 1000,
).toISOString();
const isoMissionEnd = new Date(
  now.getTime() + 14 * 24 * 60 * 60 * 1000,
).toISOString();
/** 시작 5분 후 → T-10 룰로 즉시 활성화 */
// QA 입장창을 넉넉히 연다: 1시간 전 시작 ~ 12시간 후 종료 → 항상 "진행 중"이라
// 멘토(T-20 게이팅)·멘티 모두 입장 버튼이 활성. (종료 후 동작은 completedFeedbackList 로 확인)
const reservationStart = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
const reservationEnd = new Date(
  now.getTime() + 12 * 60 * 60 * 1000,
).toISOString();

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
  const created = new Date(start.getTime() - daysBefore * 24 * 60 * 60 * 1000);
  // 신청 시각은 예약 시작 시각과 무관하게 오전 무렵으로 고정해 자연스럽게 표기.
  created.setHours(9, 30, 0, 0);
  const y = created.getFullYear();
  const mo = String(created.getMonth() + 1).padStart(2, '0');
  const d = String(created.getDate()).padStart(2, '0');
  const hh = String(created.getHours()).padStart(2, '0');
  const mm = String(created.getMinutes()).padStart(2, '0');
  return `${y}-${mo}-${d}T${hh}:${mm}:00`;
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
 * 서면 미션 제출자(출석) 시드 — challengeMissionFeedbackAttendanceListSchema 와
 * mentorMenteeAttendanceListSchema 양쪽을 모두 통과하는 공통 형태.
 *
 * status(ABSENT 여부)와 feedbackStatus(WAITING/IN_PROGRESS/COMPLETED) 분포로
 * ChallengeDataFetcher 가 written-feedback 바의 카운트를 파생한다.
 * (과거 WRITTEN_FEEDBACK_MOCK_DATA 의 제출/진행/완료 분포를 대표값으로 이관)
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

export const handlers = [
  /**
   * (멘토) GET /challenge/mentor/feedback-management
   * 참여중인 챌린지별 서면 피드백 현황. BE mentorFeedbackManagementSchema 정확히 일치.
   * (기존 feedback-management/mocks/writtenChallengeMock.ts 시나리오 이관)
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
   * BE challengeMentorVoSchema 정확히 일치. PROCEEDING 2개를 박는다.
   * (과거 WRITTEN_FEEDBACK_MOCK_DATA / MOCK_CHALLENGE_FILTER_ITEMS 시나리오 이관)
   * → schedule 캘린더가 이 2개 챌린지를 ChallengeDataFetcher 로 fan-out.
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
        ],
      },
    });
  }),

  /**
   * (멘토) GET /challenge/:challengeId/mission/:missionId/feedback/attendances/mentee
   * 신규(≥230) 챌린지 멘티 제출 내역. BE mentorMenteeAttendanceListSchema 일치.
   *
   * ⚠️ 라우트 순서: 구체 경로(.../mentee)를 일반 경로(.../attendances)보다 먼저 등록.
   * MSW는 등록 순서로 매칭하므로 mentee 가 attendances 에 가로채이지 않게 한다.
   */
  http.get(
    '*/challenge/:challengeId/mission/:missionId/feedback/attendances/mentee',
    () => {
      return HttpResponse.json({
        status: 200,
        data: { attendanceList: MOCK_ATTENDANCE_LIST },
      });
    },
  ),

  /**
   * (멘토) GET /challenge/:challengeId/mission/:missionId/feedback/attendances
   * legacy(<230) 챌린지 제출자(출석). BE challengeMissionFeedbackAttendanceListSchema 일치.
   * 시드 챌린지(1,2)는 legacy 라 ChallengeDataFetcher 가 이 경로를 사용.
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
   * 챌린지 피드백 미션 목록. BE challengeMissionFeedbackListSchema 일치.
   * startDate/endDate 는 datetime({ local: true }) 포맷(타임존 없음) 준수.
   *
   * 미션 endDate 4/25/4/27 → ChallengeDataFetcher 가 written-feedback 바를
   * endDate+2~+4 (4/27~4/29, 4/29~5/1)로 파생 → 과거 mock 동등.
   */
  http.get('*/challenge/:challengeId/mission/feedback', ({ params }) => {
    const challengeId = Number(params.challengeId);
    const missionEnd =
      challengeId === 2 ? '2026-04-27T23:59:59' : '2026-04-25T23:59:59';
    const missionStart =
      challengeId === 2 ? '2026-04-22T00:00:00' : '2026-04-20T00:00:00';
    return HttpResponse.json({
      status: 200,
      data: {
        missionList: [
          {
            id: challengeId * 1000 + 1,
            title: '1회차 서면 피드백',
            th: 1,
            startDate: missionStart,
            endDate: missionEnd,
            submittedCount: 0,
            totalCount: 0,
          },
        ],
      },
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
            attendanceStatus: null,
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
          attendanceUrl: 'https://example.com/submission/' + feedbackId,
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
        },
      },
    });
  }),
];
