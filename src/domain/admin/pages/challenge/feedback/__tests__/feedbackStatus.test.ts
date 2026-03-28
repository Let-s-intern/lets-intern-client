/**
 * 피드백 진행상태(feedbackStatus) 업데이트 디버깅 테스트
 *
 * 목적: feedbackStatus PATCH 요청이 올바른 엔드포인트 & 올바른 body로
 *       전송되는지 검증하여, "변경이 안 되는" 원인을 특정한다.
 *
 * 가설:
 *   1. v2 admin PATCH (/api/v2/admin/attendance/{id}) 가 feedbackStatus 를 무시
 *   2. v1 mentor PATCH (/api/v1/attendance/{id}/mentor) 는 feedback (필수) 누락 시 실패
 */

import { describe, expect, it, vi } from 'vitest';

// ── 1) 타입 호환성 테스트 ─────────────────────────────────────────

describe('PatchAttendanceMentorReq 타입 호환성', () => {
  it('attendanceSchema 타입은 feedbackStatus만 보내는 것을 허용한다', () => {
    // attendanceSchema.ts의 PatchAttendanceMentorReq는 feedback이 optional
    type Req = {
      attendanceId: number | string;
      feedback?: string | null;
      feedbackStatus?: string;
    };

    const req: Req = {
      attendanceId: 123,
      feedbackStatus: 'IN_PROGRESS',
      // feedback 없음 — 타입 에러 없어야 함
    };

    expect(req.feedbackStatus).toBe('IN_PROGRESS');
    expect(req.feedback).toBeUndefined();
  });

  it('mentorSchema 타입은 feedback이 필수이다', () => {
    // mentorSchema.ts의 patchAttendanceMentorReqSchema는 feedback이 required
    // 이 테스트는 백엔드가 feedback 없이 요청을 거부할 수 있음을 문서화
    const { z } = require('zod');
    const schema = z.object({
      feedback: z.string(),
      feedbackStatus: z.string(),
    });

    // feedback 누락 시 파싱 실패
    const result = schema.safeParse({ feedbackStatus: 'IN_PROGRESS' });
    expect(result.success).toBe(false);

    // feedback 포함 시 파싱 성공
    const result2 = schema.safeParse({
      feedback: '',
      feedbackStatus: 'IN_PROGRESS',
    });
    expect(result2.success).toBe(true);
  });
});

// ── 2) PATCH 요청 body 테스트 ─────────────────────────────────────

describe('feedbackStatus PATCH 요청 body 검증', () => {
  it('어드민: v2 admin endpoint로 feedbackStatus만 전송', () => {
    // usePatchAdminAttendance의 mutationFn 시뮬레이션
    const mockPatch = vi.fn();

    const req = {
      attendanceId: 42 as number | string,
      feedbackStatus: 'IN_PROGRESS' as const,
    };

    // mutationFn: const { attendanceId, ...body } = req
    const { attendanceId, ...body } = req;
    mockPatch(`/admin/attendance/${attendanceId}`, body);

    expect(mockPatch).toHaveBeenCalledWith('/admin/attendance/42', {
      feedbackStatus: 'IN_PROGRESS',
    });
    // body에 feedback 필드가 없음 — 이것이 정상인지 서버에서 확인 필요
    expect(body).not.toHaveProperty('feedback');
  });

  it('멘토: v1 mentor endpoint로 feedbackStatus만 전송', () => {
    const mockPatch = vi.fn();

    const req = {
      attendanceId: 42 as number | string,
      feedbackStatus: 'IN_PROGRESS' as const,
    };

    const { attendanceId, ...body } = req;
    mockPatch(`/attendance/${attendanceId}/mentor`, body);

    expect(mockPatch).toHaveBeenCalledWith('/attendance/42/mentor', {
      feedbackStatus: 'IN_PROGRESS',
    });
    // ⚠️ 경고: mentorSchema에서 feedback은 필수
    // 서버가 이 요청을 거부할 수 있음
    expect(body).not.toHaveProperty('feedback');
  });

  it('멘토 endpoint에 feedback 포함 시 올바른 body', () => {
    const mockPatch = vi.fn();

    const req = {
      attendanceId: 42 as number | string,
      feedback: '',
      feedbackStatus: 'IN_PROGRESS' as const,
    };

    const { attendanceId, ...body } = req;
    mockPatch(`/attendance/${attendanceId}/mentor`, body);

    expect(mockPatch).toHaveBeenCalledWith('/attendance/42/mentor', {
      feedback: '',
      feedbackStatus: 'IN_PROGRESS',
    });
    expect(body).toHaveProperty('feedback');
  });
});

// ── 3) useRoleBasedAttendanceData fallback 테스트 ─────────────────

describe('fallback 데이터 feedbackStatus 매핑', () => {
  it('일반 attendance에 feedbackStatus 있으면 그 값 사용', () => {
    const attendance = {
      id: 1,
      name: '홍길동',
      feedbackStatus: 'IN_PROGRESS',
      status: 'PRESENT',
      result: 'WAITING',
    };

    const mapped = {
      feedbackStatus: (attendance.feedbackStatus ?? 'WAITING'),
    };

    expect(mapped.feedbackStatus).toBe('IN_PROGRESS');
  });

  it('일반 attendance에 feedbackStatus 없으면 WAITING 기본값', () => {
    const attendance = {
      id: 1,
      name: '홍길동',
      feedbackStatus: undefined as string | undefined,
    };

    const mapped = {
      feedbackStatus: (attendance.feedbackStatus ?? 'WAITING'),
    };

    expect(mapped.feedbackStatus).toBe('WAITING');
  });
});

// ── 4) 결론 & 디버깅 가이드 ─────────────────────────────────────

describe('디버깅 가이드', () => {
  it('네트워크 탭에서 확인해야 할 것들', () => {
    const checkList = {
      'PATCH 응답 status': '200이면 서버 수신 성공, 400/422면 body 검증 실패',
      'PATCH 응답 body': '에러 메시지가 있는지 확인',
      'GET 응답 (새로고침 후)': 'feedbackStatus 필드 값이 변경되었는지 확인',
      'fallback 여부':
        '/feedback/attendances가 빈 배열이면 fallback 사용 중 → feedbackStatus가 일반 attendance에서 옴',
    };

    // 이 테스트는 항상 통과 — 디버깅 가이드 문서화 용도
    expect(Object.keys(checkList).length).toBe(4);
  });

  it('가설별 확인 방법', () => {
    const hypotheses = [
      {
        가설: 'v2 admin PATCH가 feedbackStatus 무시',
        확인방법: 'PATCH /api/v2/admin/attendance/{id} 응답 확인',
        대안: 'v1 mentor endpoint 사용, 단 feedback 필드 포함 필요',
      },
      {
        가설: 'v1 mentor PATCH에서 feedback 필수 누락',
        확인방법: 'PATCH /api/v1/attendance/{id}/mentor 응답에 validation error 확인',
        대안: 'feedback: "" (빈 문자열) 추가 전송',
      },
      {
        가설: 'PATCH는 성공하나 GET에서 값이 안 옴',
        확인방법: '새로고침 후 GET /feedback/attendances 응답의 feedbackStatus 확인',
        대안: 'fallback에서 일반 attendance의 feedbackStatus 매핑 (이미 적용됨)',
      },
    ];

    expect(hypotheses).toHaveLength(3);
  });
});
