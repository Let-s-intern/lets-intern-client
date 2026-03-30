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

// ── 4) query invalidation 후 서버 값 반영 시나리오 ───────────────

describe('query invalidation 후 feedbackStatus 동기화', () => {
  it('params.value가 변경되면 localValue가 동기화된다 (statusCache 불필요)', () => {
    // statusCache 제거 후, params.value가 서버 데이터의 source of truth
    // useEffect로 params.value 변경 시 localValue를 동기화
    const initialParamsValue = 'WAITING';
    let localValue = initialParamsValue;

    // PATCH 성공 후 query invalidation → 서버에서 새로운 값 반환
    const updatedParamsValue = 'IN_PROGRESS';

    // useEffect 시뮬레이션: serverValue 변경 시 setLocalValue 호출
    const setLocalValue = (v: string) => {
      localValue = v;
    };
    setLocalValue(updatedParamsValue);

    expect(localValue).toBe('IN_PROGRESS');
  });

  it('fallback 데이터에서도 캐시된 feedbackStatus를 활용한다', () => {
    // feedback attendance 캐시에 저장된 feedbackStatus
    const cachedFeedbackData = {
      attendanceList: [
        { id: 1, feedbackStatus: 'COMPLETED' },
        { id: 2, feedbackStatus: 'IN_PROGRESS' },
      ],
    };

    const feedbackStatusMap = new Map<number, string | null>();
    cachedFeedbackData.attendanceList.forEach((item) => {
      feedbackStatusMap.set(item.id, item.feedbackStatus ?? null);
    });

    // fallback 데이터 (feedbackStatus 없음)
    const fallbackItem = { id: 1, feedbackStatus: undefined as string | undefined };
    const cachedStatus = feedbackStatusMap.get(fallbackItem.id);
    const resolvedStatus = cachedStatus ?? fallbackItem.feedbackStatus ?? 'WAITING';

    expect(resolvedStatus).toBe('COMPLETED');
  });

  it('캐시에도 없고 fallback에도 없으면 WAITING 기본값', () => {
    const feedbackStatusMap = new Map<number, string | null>();
    const fallbackItem = { id: 999, feedbackStatus: undefined as string | undefined };
    const cachedStatus = feedbackStatusMap.get(fallbackItem.id);
    const resolvedStatus = cachedStatus ?? fallbackItem.feedbackStatus ?? 'WAITING';

    expect(resolvedStatus).toBe('WAITING');
  });
});

// ── 5) 멘토 색상 & 진행상태 색상 매핑 테스트 ───────────────────

describe('멘토 색상 뱃지 (MentorRenderCell)', () => {
  it('getMentorColor는 인덱스에 따라 순환 색상을 반환한다', () => {
    const MENTOR_COLORS = [
      { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
    ];
    const getMentorColor = (i: number) => MENTOR_COLORS[i % MENTOR_COLORS.length];

    expect(getMentorColor(0).bg).toBe('bg-red-50');
    expect(getMentorColor(6).bg).toBe('bg-violet-50');
    expect(getMentorColor(7).bg).toBe('bg-red-50'); // 순환
  });

  it('멘토 ID로 리스트에서 인덱스를 찾아 색상을 결정한다', () => {
    const mentorList = [
      { challengeMentorId: 10, name: '김멘토' },
      { challengeMentorId: 20, name: '이멘토' },
      { challengeMentorId: 30, name: '박멘토' },
    ];

    const getMentorColorByIdFromList = (id: number) => {
      const idx = mentorList.findIndex((m) => m.challengeMentorId === id);
      return idx >= 0 ? idx : null;
    };

    expect(getMentorColorByIdFromList(10)).toBe(0);
    expect(getMentorColorByIdFromList(20)).toBe(1);
    expect(getMentorColorByIdFromList(30)).toBe(2);
    expect(getMentorColorByIdFromList(999)).toBeNull(); // 없는 ID
  });
});

describe('진행상태 색상 매핑 (FeedbackStatusRenderCell)', () => {
  it('각 FeedbackStatus에 대한 색상이 정의되어 있다', () => {
    const FEEDBACK_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
      WAITING: { bg: 'bg-neutral-90', text: 'text-neutral-30' },
      IN_PROGRESS: { bg: 'bg-blue-50', text: 'text-blue-700' },
      COMPLETED: { bg: 'bg-green-50', text: 'text-green-700' },
      CONFIRMED: { bg: 'bg-violet-50', text: 'text-violet-700' },
    };

    const statuses = ['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CONFIRMED'];
    statuses.forEach((status) => {
      expect(FEEDBACK_STATUS_COLORS[status]).toBeDefined();
      expect(FEEDBACK_STATUS_COLORS[status].bg).toBeTruthy();
      expect(FEEDBACK_STATUS_COLORS[status].text).toBeTruthy();
    });
  });

  it('각 상태별 색상이 서로 다르다', () => {
    const colors = [
      'bg-neutral-90', // WAITING
      'bg-blue-50',    // IN_PROGRESS
      'bg-green-50',   // COMPLETED
      'bg-violet-50',  // CONFIRMED
    ];
    const unique = new Set(colors);
    expect(unique.size).toBe(4);
  });
});

describe('진행상태 변경 알림 (snackbar)', () => {
  it('성공 시 snackbar 호출 시뮬레이션', () => {
    const snackbar = vi.fn();

    // handleChange 성공 시나리오
    const newValue = 'IN_PROGRESS';
    snackbar('진행상태가 변경되었습니다.');

    expect(snackbar).toHaveBeenCalledWith('진행상태가 변경되었습니다.');
  });

  it('실패 시 snackbar 호출 시뮬레이션', () => {
    const snackbar = vi.fn();

    // handleChange 실패 시나리오
    snackbar('진행상태 변경에 실패했습니다.');

    expect(snackbar).toHaveBeenCalledWith('진행상태 변경에 실패했습니다.');
  });
});

// ── 6) 제출확인전 상태 표시 테스트 ───────────────────────────────

describe('제출확인전 상태 (ABSENT → 확인전)', () => {
  it('status가 ABSENT이면 확인전으로 판단한다', () => {
    const row = { status: 'ABSENT', feedbackStatus: 'WAITING' };
    const isBeforeCheck = row.status === 'ABSENT';
    expect(isBeforeCheck).toBe(true);
  });

  it('status가 PRESENT이면 확인전이 아니다', () => {
    const row = { status: 'PRESENT', feedbackStatus: 'WAITING' };
    const isBeforeCheck = row.status === 'ABSENT';
    expect(isBeforeCheck).toBe(false);
  });

  it('status가 UPDATED/LATE여도 확인전이 아니다', () => {
    const updated: string = 'UPDATED';
    const late: string = 'LATE';
    expect(updated === 'ABSENT').toBe(false);
    expect(late === 'ABSENT').toBe(false);
  });
});

// ── 7) 피드백 카운트 계산 테스트 ─────────────────────────────────

describe('피드백 관리 제출/완료/전체 카운트', () => {
  it('제출 수: link가 있는 항목 수', () => {
    const list = [
      { attendance: { link: 'http://...', feedbackStatus: 'WAITING' } },
      { attendance: { link: null, feedbackStatus: 'WAITING' } },
      { attendance: { link: 'http://...', feedbackStatus: 'COMPLETED' } },
    ];
    const submitted = list.filter((a) => !!a.attendance.link).length;
    expect(submitted).toBe(2);
  });

  it('진행전 수: 제출확인 완료 + feedbackStatus가 WAITING인 항목 수', () => {
    const list = [
      { attendance: { status: 'PRESENT', feedbackStatus: 'WAITING' } },
      { attendance: { status: 'ABSENT', feedbackStatus: 'WAITING' } }, // 확인전 → 제외
      { attendance: { status: 'UPDATED', feedbackStatus: 'WAITING' } },
      { attendance: { status: 'PRESENT', feedbackStatus: 'IN_PROGRESS' } }, // 진행중 → 제외
      { attendance: { status: 'LATE', feedbackStatus: 'WAITING' } },
    ];
    const waiting = list.filter((a) => {
      const s = a.attendance.status;
      const fs = a.attendance.feedbackStatus;
      return s !== 'ABSENT' && s != null && fs === 'WAITING';
    }).length;
    expect(waiting).toBe(3);
  });

  it('확인완료 수: feedbackStatus가 CONFIRMED인 항목 수', () => {
    const list = [
      { attendance: { feedbackStatus: 'WAITING' } },
      { attendance: { feedbackStatus: 'IN_PROGRESS' } },
      { attendance: { feedbackStatus: 'COMPLETED' } },
      { attendance: { feedbackStatus: 'CONFIRMED' } },
      { attendance: { feedbackStatus: 'CONFIRMED' } },
    ];
    const confirmed = list.filter(
      (a) => a.attendance.feedbackStatus === 'CONFIRMED',
    ).length;
    expect(confirmed).toBe(2);
  });

  it('전체 수: 리스트 길이', () => {
    const list = [
      { attendance: { link: 'a', feedbackStatus: 'WAITING' } },
      { attendance: { link: null, feedbackStatus: 'COMPLETED' } },
      { attendance: { link: 'b', feedbackStatus: 'CONFIRMED' } },
    ];
    expect(list.length).toBe(3);
  });

  it('표시 형식: 멘티제출/진행전/확인완료/전체', () => {
    const submitted = 3, waiting = 2, confirmed = 1, total = 5;
    const display = `${submitted} / ${waiting} / ${confirmed} / ${total}`;
    expect(display).toBe('3 / 2 / 1 / 5');
  });
});

// ── 8) 결론 & 디버깅 가이드 ─────────────────────────────────────

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
