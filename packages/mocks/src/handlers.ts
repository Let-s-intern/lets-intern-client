import { http, HttpResponse } from 'msw';

/**
 * MSW 핸들러 — 멘토 서면 피드백 "경험정리형 제출물" QA용 **최소 인터셉트**.
 *
 * 시나리오: 피드백 캘린더 → 서면 피드백 카드 클릭 → 피드백 모달에서
 * 제출 유형별 "제출물 보기" 동작을 한 화면에서 비교 확인한다.
 *
 *   1. 김경험 — 경험정리형 제출 (link 없음) → "제출물 보기" 클릭 시 경험 목록 서브모달
 *   2. 이링크 — 링크형 제출 (노션 URL)     → 기존 외부 링크 동작 (회귀 확인)
 *   3. 박빈손 — 제출됨인데 link·경험 모두 없음 → "제출물 없음" 안내
 *   4. 최미제출 — 미제출(ABSENT)           → 경험 조회 API 호출 금지 확인
 *
 * 인증(signin/is-mentor/user)도 mock이므로 실 BE 없이 단독 실행 가능 —
 * 로그인 화면에서 아무 이메일/비밀번호나 입력하면 통과된다.
 * 그 외 요청은 `onUnhandledRequest: 'bypass'`로 BE 통과.
 * 활성화: `pnpm dev:mock:mentor`로 띄울 때만.
 *
 * URL 매칭: 와일드카드 prefix(asterisk + slash) 패턴으로 axios baseURL 무관.
 */

/** challengeId >= 230 → 신규 /mentee 엔드포인트 경로를 타도록 큰 값 사용 */
export const MOCK_CHALLENGE_ID = 9901;
export const MOCK_MISSION_ID = 77001;

const DAY_MS = 24 * 60 * 60 * 1000;
const now = new Date();
/** 미션 종료 = 2일 전 → 피드백 제출기간(end+1 ~ end+4)이 오늘을 포함해 캘린더에 보임 */
const missionEnd = new Date(now.getTime() - 2 * DAY_MS);
const missionStart = new Date(missionEnd.getTime() - 6 * DAY_MS);
const challengeStart = new Date(missionStart.getTime() - 14 * DAY_MS);
const challengeEnd = new Date(missionEnd.getTime() + 21 * DAY_MS);

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
   * (멘토) GET /challenge-mentor
   * 담당 챌린지 목록 — 진행중 mock 챌린지 1건. 캘린더 데이터 페칭의 시작점.
   */
  http.get('*/challenge-mentor', () => {
    return HttpResponse.json({
      status: 200,
      data: {
        myChallengeMentorVoList: [
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
   * (멘토) GET /challenge/:challengeId/mission/feedback
   * 서면 피드백 미션 목록 — 3회차 1건. 피드백 제출기간이 오늘을 포함해
   * 캘린더 이번 주에 카드가 보인다.
   */
  http.get('*/challenge/:challengeId/mission/feedback', () => {
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
  }),

  /**
   * (멘토) GET /challenge/:cid/mission/:mid/feedback/attendances/mentee
   * 멘티 제출 내역 — 4가지 케이스 혼합.
   * 주의: `:attendanceId` 단건 핸들러보다 먼저 등록해야 `mentee`가 매칭된다.
   */
  http.get(
    '*/challenge/:challengeId/mission/:missionId/feedback/attendances/mentee',
    () => {
      return HttpResponse.json({
        status: 200,
        data: { attendanceList: MOCK_MENTEES },
      });
    },
  ),

  /**
   * (멘토) GET /challenge/:cid/mission/:mid/feedback/attendances/:attendanceId
   * 멘토가 작성한 피드백 단건 — 작성 전 상태(null).
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
];
