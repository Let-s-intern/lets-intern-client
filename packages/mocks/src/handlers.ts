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

export const handlers = [
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
   * BE feedbackSlotSchema 정확히 일치. **예약 확정된 슬롯 1건**을 박는다.
   * → 멘토 schedule/feedback-management에서 RESERVED 슬롯으로 보임.
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
