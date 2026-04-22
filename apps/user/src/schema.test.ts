/* eslint-disable react-hooks/rules-of-hooks */
// import { expect, test } from 'vitest';
// import {
//   challengeGuides,
//   challengeNotices,
//   challenges,
//   getChallengeIdApplications,
//   getChallengeIdApplicationsPayback,
//   getChallengeIdSchema,
//   getContentsAdmin,
//   getContentsAdminSimple,
//   missionAdmin,
// } from './schema';

import { test } from 'vitest';

/********************************
 * TODO: 아직 제대로 테스트 프로세스 정립되지 않았습니다.
 * 본 파일은 아직 미완임
 *****************************/

const requestPromise = (async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_API}/user/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: process.env.TEST_EMAIL,
      password: process.env.TEST_PASSWORD,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to sign in');
  }

  const json = await res.json();
  if (json.status !== 200) {
    throw new Error('Failed to sign in');
  }

  const { accessToken } = json.data as {
    accessToken: string;
    refreshToken: string;
  };

  return ({
    body,
    method,
    path,
  }: {
    path: string;
    method: string;
    body?: Record<string, unknown>;
  }) => {
    return fetch(`${process.env.NEXT_PUBLIC_SERVER_API}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };
})();

const mockReqeustPromise = (async () => {
  return () => {
    return Promise.resolve(new Response());
  };
})();

interface Fixtures {
  request: Awaited<typeof requestPromise>;
}

/** @see https://vitest.dev/guide/test-context.html */
const testWithAuth = test.extend<Fixtures>({
  request: async ({}, use) => {
    // use(await requestPromise);
    // do nothing
    use(await mockReqeustPromise);
  },
});

testWithAuth(
  'GET /api/v1/challenge/{challengeId}/mission/{missionId}/attendances',
  async ({ request, skip }) => {
    skip();
  },
);

testWithAuth('GET /api/v1/vod', async ({ request, skip }) => {
  skip();
});

testWithAuth('POST /api/v1/vod', async ({ request, skip }) => {
  skip();
});

testWithAuth('GET /api/v1/vod/{id}', async ({ request, skip }) => {
  skip();
});

testWithAuth('DELETE /api/v1/vod/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/vod/{id}
// [어드민] vod 수정
testWithAuth('PATCH /api/v1/vod/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/user
// 유저 마이페이지 정보
testWithAuth('GET /api/v1/user', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/user
// 유저 탈퇴
testWithAuth('DELETE /api/v1/user', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/user
// 유저 정보 업데이트
testWithAuth('PATCH /api/v1/user', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/user/additional-info
// 회원가입-추가 정보 업데이트
testWithAuth(
  'PATCH /api/v1/user/additional-info',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/user/admin
// [어드민] 유저 전체 목록
testWithAuth('GET /api/v1/user/is-admin', async ({ request, skip }) => {
  skip();
  // const res = await request({ method: 'GET', path: '/user/is-admin' });
  // const data = await res.json();
  // expect(data.data).toBe(true);
});

// GET
// /api/v1/user/applications
// 나의 신청서 전체 조회
testWithAuth('GET /api/v1/user/applications', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/user/is-admin
// 유저 관리자 여부
testWithAuth('GET /api/v1/user/is-admin', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/user/password
// 비밀번호 재설정 메일 전송
testWithAuth('POST /api/v1/user/password', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/user/password
// 비밀번호 변경
testWithAuth('PATCH /api/v1/user/password', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/user/signin
// 유저 이메일 로그인
testWithAuth('POST /api/v1/user/signin', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/user/signout
// 유저 로그아웃
testWithAuth('GET /api/v1/user/signout', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/user/signup
// 유저 이메일 회원가입
testWithAuth('POST /api/v1/user/signup', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v2/user/token
// 유저 토큰 재발급
testWithAuth('PATCH /api/v2/user/token', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/review
// 리뷰 생성
testWithAuth('POST /api/v1/review', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/review/{id}
// 리뷰 상세 조회
testWithAuth('GET /api/v1/review/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/review/{id}
// 리뷰 수정
testWithAuth('PATCH /api/v1/review/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/review/{id}/status
// [어드민] 리뷰 노출 여부 수정
testWithAuth('PATCH /api/v1/review/{id}/status', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/mission/{id}
// [어드민] 미션 생성
testWithAuth('POST /api/v1/mission/{id}', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/mission/{id}
// [어드민] 미션 삭제
testWithAuth('DELETE /api/v1/mission/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/mission/{id}
// [어드민] 미션 수정
testWithAuth('PATCH /api/v1/mission/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/mission/{id}/admin
// [어드민] 챌린지 1개의 미션 전체 목록
testWithAuth('GET /api/v1/mission/{id}/admin', async ({ request, skip }) => {
  skip();
  // const res = await request({
  //   method: 'GET',
  //   path: '/mission/1/admin',
  // });

  // const data = await res.json();
  // missionAdmin.parse(data.data);
});

// POST
// /api/v1/mission-template
// [어드민] 미션 템플릿 생성
testWithAuth('POST /api/v1/mission-template', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/mission-template/{id}
// [어드민] 미션 템플릿 삭제
testWithAuth(
  'DELETE /api/v1/mission-template/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// PATCH
// /api/v1/mission-template/{id}
// [어드민] 미션 템플릿 수정
testWithAuth(
  'PATCH /api/v1/mission-template/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/mission-template/admin
// [어드민] 미션 템플릿 전체 목록
testWithAuth(
  'GET /api/v1/mission-template/admin',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/mission-template/admin/simple
// [어드민] 미션 템플릿 간단 목록
testWithAuth(
  'GET /api/v1/mission-template/admin/simple',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/live
// 라이브 목록 조회
testWithAuth('GET /api/v1/live', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/live
// [어드민] 라이브 생성
testWithAuth('POST /api/v1/live', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}
// 라이브 상세 조회
testWithAuth('GET /api/v1/live/{id}', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/live/{id}
// [어드민] 라이브 삭제
testWithAuth('DELETE /api/v1/live/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/live/{id}
// [어드민] 라이브 수정
testWithAuth('PATCH /api/v1/live/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}/application
// 라이브 신청폼 조회
testWithAuth('GET /api/v1/live/{id}/application', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}/applications
// [어드민] 프로그램 신청자 조회
testWithAuth(
  'GET /api/v1/live/{id}/applications',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/live/{id}/content
// 라이브 상세내용 조회
testWithAuth('GET /api/v1/live/{id}/content', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}/faqs
// 라이브 faq 목록 조회
testWithAuth('GET /api/v1/live/{id}/faqs', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}/reviews
// [어드민] 신청자 리뷰 조회
testWithAuth('GET /api/v1/live/{id}/reviews', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}/thumbnail
// 라이브 섬네일 조회
testWithAuth('GET /api/v1/live/{id}/thumbnail', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/{id}/title
// 라이브 title 조회
testWithAuth('GET /api/v1/live/{id}/title', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/live/reviews
// 라이브 리뷰 조회
testWithAuth('GET /api/v1/live/reviews', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/faq
// program type에 해당하는 Faq 목록 조회
testWithAuth('GET /api/v1/faq', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/faq
// [어드민] Faq 생성
testWithAuth('POST /api/v1/faq', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/faq/{faqId}
// [어드민] Faq 삭제
testWithAuth('DELETE /api/v1/faq/{faqId}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/faq/{faqId}
// [어드민] Faq 수정
testWithAuth('PATCH /api/v1/faq/{faqId}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/coupon
// 쿠폰 적용
testWithAuth('GET /api/v1/coupon', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/coupon
// [어드민] 쿠폰 생성
testWithAuth('POST /api/v1/coupon', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/coupon/{id}
// [어드민] 쿠폰 삭제
testWithAuth('DELETE /api/v1/coupon/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/coupon/{id}
// [어드민] 쿠폰 수정
testWithAuth('PATCH /api/v1/coupon/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/coupon/admin
// [어드민] 쿠폰 목록 조회
testWithAuth('GET /api/v1/coupon/admin', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/coupon/admin/{id}
// [어드민] 쿠폰 상세 조회
testWithAuth('GET /api/v1/coupon/admin/{id}', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/contents
// [어드민] 콘텐츠 생성
testWithAuth('POST /api/v1/contents', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/contents/{id}
// [어드민] 콘텐츠 삭제
testWithAuth('DELETE /api/v1/contents/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/contents/{id}
// [어드민] 콘텐츠 수정
testWithAuth('PATCH /api/v1/contents/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/contents/admin
// [어드민] 콘텐츠 전체 목록
testWithAuth('GET /api/v1/contents/admin', async ({ request, skip }) => {
  skip();
  // const res = await request({
  //   method: 'GET',
  //   path: '/contents/admin',
  // });

  // const data = await res.json();
  // getContentsAdmin.parse(data.data);
});

// GET
// /api/v1/contents/admin/simple
// [어드민] 콘텐츠 타입별 간단 목록
testWithAuth(
  'GET /api/v1/contents/admin/simple?type=ESSENTIAL',
  async ({ request, skip }) => {
    skip();
    // const res = await request({
    //   method: 'GET',
    //   path: '/contents/admin/simple?type=ESSENTIAL',
    // });

    // const data = await res.json();
    // getContentsAdminSimple.parse(data.data);
  },
);

testWithAuth(
  'GET /api/v1/contents/admin/simple?type=ADDITIONAL',
  async ({ request, skip }) => {
    skip();
    // const res = await request({
    //   method: 'GET',
    //   path: '/contents/admin/simple?type=ADDITIONAL',
    // });

    // const data = await res.json();
    // getContentsAdminSimple.parse(data.data);
  },
);

// GET
// /api/v1/challenge
// 챌린지 목록 조회
testWithAuth('GET /api/v1/challenge', async ({ request, skip }) => {
  skip();
  // const res = await request({
  //   method: 'GET',
  //   path: '/challenge',
  // });

  // const data = await res.json();
  // challenges.parse(data.data);
});

// POST
// /api/v1/challenge
// [어드민] 챌린지 생성
testWithAuth('POST /api/v1/challenge', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/challenge/{challengeId}/application/{applicationId}/payback
// [어드민] 챌린지 미션 참가자 패이백 정보 수정
testWithAuth(
  'PATCH /api/v1/challenge/{challengeId}/application/{applicationId}/payback',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{challengeId}/mission/{missionId}/attendances
// [어드민] 챌린지 미션별 제출 목록 조회
testWithAuth(
  'GET /api/v1/challenge/{challengeId}/mission/{missionId}/attendances',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{challengeId}/missions/{missionId}
// 챌린지 나의 기록장 미션 상세 조회
testWithAuth(
  'GET /api/v1/challenge/{challengeId}/missions/{missionId}',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}
// 챌린지 상세 조회
testWithAuth('GET /api/v1/challenge/{id}', async ({ request, skip }) => {
  skip();
  // const res = await request({
  //   method: 'GET',
  //   path: '/challenge/1',
  // });

  // const data = await res.json();
  // getChallengeIdSchema.parse(data.data);
});

// DELETE
// /api/v1/challenge/{id}
// [어드민] 챌린지 삭제
testWithAuth('DELETE /api/v1/challenge/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/challenge/{id}
// [어드민] 챌린지 수정
testWithAuth('PATCH /api/v1/challenge/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/challenge/{id}/application
// 챌린지 신청폼 조회
testWithAuth(
  'GET /api/v1/challenge/{id}/application',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/applications
// [어드민] 프로그램 신청자 조회
testWithAuth(
  'GET /api/v1/challenge/{id}/applications',
  async ({ request, skip }) => {
    skip();
    // const res = await request({
    //   method: 'GET',
    //   path: '/challenge/1/applications',
    // });

    // const data = await res.json();
    // const parsed = getChallengeIdApplications.parse(data.data);
    // if (parsed.applicationList.length === 0) {
    //   throw new Error("No applications. Can't test");
    // }
  },
);

// GET
// /api/v1/challenge/{id}/applications/payback
// [어드민] 챌린지 미션 참가자 패이백 목록
testWithAuth(
  'GET /api/v1/challenge/{id}/applications/payback',
  async ({ request, skip }) => {
    skip();
    // const res = await request({
    //   method: 'GET',
    //   path: '/challenge/1/applications/payback',
    // });

    // const data = await res.json();
    // getChallengeIdApplicationsPayback.parse(data.data);
  },
);

// GET
// /api/v1/challenge/{id}/content
// 챌린지 상세정보 조회
testWithAuth(
  'GET /api/v1/challenge/{id}/content',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/daily-mission
// 챌린지 대시보드 데일리 미션
testWithAuth(
  'GET /api/v1/challenge/{id}/daily-mission',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/faqs
// 챌린지 faqs 조회
testWithAuth('GET /api/v1/challenge/{id}/faqs', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/challenge/{id}/guides
// 챌린지 가이드 조회
testWithAuth('GET /api/v1/challenge/{id}/guides', async ({ request, skip }) => {
  skip();
  // const res = await request({
  //   method: 'GET',
  //   path: '/challenge/1/guides',
  // });

  // const data = await res.json();
  // challengeGuides.parse(data.data);
});

// GET
// /api/v1/challenge/{id}/missions
// 챌린지 나의 기록장 미션 목록
testWithAuth(
  'GET /api/v1/challenge/{id}/missions',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/my/daily-mission
// 챌린지 나의 기록장 데일리 미션
testWithAuth(
  'GET /api/v1/challenge/{id}/my/daily-mission',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/notices
// 챌린지 공지사항 조회
testWithAuth(
  'GET /api/v1/challenge/{id}/notices',
  async ({ request, skip }) => {
    skip();
    // const res = await request({
    //   method: 'GET',
    //   path: '/challenge/1/notices',
    // });

    // const data = await res.json();
    // challengeNotices.parse(data.data);
  },
);

// GET
// /api/v1/challenge/{id}/reviews
// [어드민] 신청자 리뷰 조회
testWithAuth(
  'GET /api/v1/challenge/{id}/reviews',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/schedule
// 챌린지 대시보드 일정 및 미션 제출 현황
testWithAuth(
  'GET /api/v1/challenge/{id}/schedule',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/score
// 챌린지 대시보드 미션 점수 현황
testWithAuth('GET /api/v1/challenge/{id}/score', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/challenge/{id}/thumbnail
// 챌린지 섬네일 조회
testWithAuth(
  'GET /api/v1/challenge/{id}/thumbnail',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/challenge/{id}/title
// 챌린지 title 조회
testWithAuth('GET /api/v1/challenge/{id}/title', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/challenge/reviews
// 챌린지 리뷰 조회
testWithAuth('GET /api/v1/challenge/reviews', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/challenge-notice/{id}
// [어드민] 챌린지 공지사항 생성
testWithAuth(
  'POST /api/v1/challenge-notice/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// DELETE
// /api/v1/challenge-notice/{id}
// [어드민] 챌린지 공지사항 삭제
testWithAuth(
  'DELETE /api/v1/challenge-notice/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// PATCH
// /api/v1/challenge-notice/{id}
// [어드민] 챌린지 공지사항 수정
testWithAuth(
  'PATCH /api/v1/challenge-notice/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// POST
// /api/v1/challenge-guide/{id}
// [어드민] 챌린지 가이드 생성
testWithAuth('POST /api/v1/challenge-guide/{id}', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/challenge-guide/{id}
// [어드민] 챌린지 가이드 삭제
testWithAuth(
  'DELETE /api/v1/challenge-guide/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// PATCH
// /api/v1/challenge-guide/{id}
// [어드민] 챌린지 가이드 수정
testWithAuth(
  'PATCH /api/v1/challenge-guide/{id}',
  async ({ request, skip }) => {
    skip();
  },
);

// GET
// /api/v1/banner
// 노출 배너 목록 조회
testWithAuth('GET /api/v1/banner', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/banner
// [어드민] 타입별 배너 생성
testWithAuth('POST /api/v1/banner', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/banner/{id}
// [어드민] 배너 삭제
testWithAuth('DELETE /api/v1/banner/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/banner/{id}
// [어드민] 타입별 배너 수정
testWithAuth('PATCH /api/v1/banner/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/banner/admin
// [어드민] 배너 타입별 전체 목록
testWithAuth('GET /api/v1/banner/admin', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/banner/admin/{id}
// [어드민] 배너 상세 조회
testWithAuth('GET /api/v1/banner/admin/{id}', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/attendance/{id}
// 출석 생성
testWithAuth('POST /api/v1/attendance/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/attendance/{id}
// 출석 업데이트
testWithAuth('PATCH /api/v1/attendance/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/attendance/{id}/admin
// [어드민] 챌린지 1개의 출석 전체 목록
testWithAuth('GET /api/v1/attendance/{id}/admin', async ({ request, skip }) => {
  skip();
});

// POST
// /api/v1/application/{id}
// 신청서 생성
testWithAuth('POST /api/v1/application/{id}', async ({ request, skip }) => {
  skip();
});

// DELETE
// /api/v1/application/{id}
// 신청서 삭제
testWithAuth('DELETE /api/v1/application/{id}', async ({ request, skip }) => {
  skip();
});

// PATCH
// /api/v1/payment/{id}
// [어드민] 결제 내역 수정
testWithAuth('PATCH /api/v1/payment/{id}', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/program
// 프로그램 통합 조회
testWithAuth('GET /api/v1/program', async ({ request, skip }) => {
  skip();
});

// GET
// /api/v1/program/admin
// [어드민] 프로그램 통합 조회
testWithAuth('GET /api/v1/program/admin', async ({ request, skip }) => {
  skip();
});

// health-check-api-controller

// GET
// /;
// health check
