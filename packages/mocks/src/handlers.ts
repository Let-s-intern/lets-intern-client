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
const reservationStart = new Date(now.getTime() + 5 * 60 * 1000).toISOString();
const reservationEnd = new Date(now.getTime() + 35 * 60 * 1000).toISOString();

/**
 * 캘린더 라이브 세션 분포 시드.
 *
 * 과거 `LIVE_FEEDBACK_MOCK_DATA` 시나리오(챌린지 2개, 라이브 5/4~5/8)를 MSW 응답으로
 * 이관해 화면 동등성을 유지한다. `useLiveFeedbackData`가 programTitle 그룹별
 * `live-feedback-period` 바와 개별 `live-feedback` 바를 파생한다.
 *
 * 절대일자(2026-05-xx)를 사용 — mockNow(데모 시각)와 함께 보던 고정 시연 일정 재현.
 */
const CALENDAR_FEEDBACK_SESSIONS: ReadonlyArray<
  readonly [string, string, string, string]
> = [
  // [챌린지1] 기필코 경험정리 챌린지 21기 — 5/4~5/6
  [
    '2026-05-04T10:00:00',
    '2026-05-04T10:30:00',
    '기필코 경험정리 챌린지 21기',
    '이지수',
  ],
  [
    '2026-05-04T14:00:00',
    '2026-05-04T14:30:00',
    '기필코 경험정리 챌린지 21기',
    '박서연',
  ],
  [
    '2026-05-05T10:00:00',
    '2026-05-05T10:30:00',
    '기필코 경험정리 챌린지 21기',
    '최지훈',
  ],
  [
    '2026-05-05T15:00:00',
    '2026-05-05T15:30:00',
    '기필코 경험정리 챌린지 21기',
    '임채원',
  ],
  [
    '2026-05-06T09:00:00',
    '2026-05-06T09:30:00',
    '기필코 경험정리 챌린지 21기',
    '한도윤',
  ],
  // [챌린지2] 커리어 설계 챌린지 5기 — 5/6~5/8
  [
    '2026-05-06T14:00:00',
    '2026-05-06T14:30:00',
    '커리어 설계 챌린지 5기',
    '문수아',
  ],
  [
    '2026-05-07T10:00:00',
    '2026-05-07T10:30:00',
    '커리어 설계 챌린지 5기',
    '조예린',
  ],
  [
    '2026-05-08T15:00:00',
    '2026-05-08T15:30:00',
    '커리어 설계 챌린지 5기',
    '백지윤',
  ],
];

const calendarFeedbackList = CALENDAR_FEEDBACK_SESSIONS.map(
  ([startDate, endDate, programTitle, menteeName], idx) => ({
    feedbackId: 70_000 + idx,
    startDate,
    endDate,
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle,
    menteeName,
  }),
);

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
            missionTh: 1,
            missionStartDate: isoMissionStart,
            missionEndDate: isoMissionEnd,
            feedbackId: MOCK_FEEDBACK_ID,
            feedbackStatus: 'RESERVED',
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
        feedbackList: [
          {
            feedbackId: MOCK_FEEDBACK_ID,
            startDate: reservationStart,
            endDate: reservationEnd,
            meetingUrl: null,
            mentorStatus: 'PENDING',
            menteeStatus: 'PENDING',
            status: 'RESERVED',
            programTitle: '자소서 챌린지 7기',
            menteeName: '이지수',
          },
          // 캘린더 세션 분포(2 챌린지, 5/4~5/8) — live-feedback / period 바 파생.
          ...calendarFeedbackList,
        ],
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
    return HttpResponse.json({
      status: 200,
      data: {
        feedbackInfo: {
          feedbackId,
          startDate: reservationStart,
          endDate: reservationEnd,
          meetingUrl: null,
          status: 'RESERVED',
          programTitle: '자소서 챌린지 7기',
          attendanceUrl: 'https://example.com/submission/' + feedbackId,
          attendanceStatus: 'PRESENT',
          menteeName: '이지수',
          menteeWishField: '기획 / PM / PO',
          menteeWishIndustry: 'IT · 플랫폼, 금융 · 핀테크',
          menteeWishCompany: 'Toss, Kakao',
          preQuestion:
            '작성한 자기소개서 피드백을 받고 싶어서 신청하게 되었습니다.',
          mentorStatus: 'PENDING',
          menteeStatus: 'PENDING',
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
   * (양쪽 공통) GET /feedback/:feedbackId
   * 단건 상세. 시작 5분 후 / 종료 35분 후 → T-10 룰로 즉시 입장 활성화.
   */
  http.get('*/feedback/:feedbackId', ({ params }) => {
    const feedbackId = Number(params.feedbackId);
    return HttpResponse.json({
      status: 200,
      data: {
        feedbackInfo: {
          feedbackId,
          startDate: reservationStart,
          endDate: reservationEnd,
          meetingUrl: null,
          status: 'RESERVED',
        },
      },
    });
  }),
];
