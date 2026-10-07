import { describe, expect, it } from 'vitest';

import type { VodIdSchema } from '@/schema';

import {
  buildCreateVodReq,
  buildUpdateVodReq,
  initialVodInput,
  vodToFormInput,
} from './vodMapping';

const vodWithMentor = (mentorId: number | null | undefined): VodIdSchema => ({
  vodInfo: { id: 1, title: 'VOD', mentorId },
});

/**
 * VOD 멘토 계정 연결(mentor_user_id)은 멘토 정산 기준이다.
 * 상세 응답 -> 폼 -> 생성·수정 요청으로 mentorId 가 끊기지 않아야 한다.
 */
describe('vodMapping - mentorId', () => {
  it('새 VOD 폼은 멘토가 선택되지 않은 상태다', () => {
    expect(initialVodInput.mentorId).toBeNull();
  });

  it('상세 응답의 mentorId 를 폼으로 옮긴다', () => {
    expect(vodToFormInput(vodWithMentor(21)).mentorId).toBe(21);
  });

  it('멘토가 없는 VOD 는 폼에서 null 이다', () => {
    expect(vodToFormInput(vodWithMentor(null)).mentorId).toBeNull();
    expect(vodToFormInput(vodWithMentor(undefined)).mentorId).toBeNull();
  });

  it('폼의 mentorId 를 생성·수정 요청에 싣는다', () => {
    const input = { ...initialVodInput, mentorId: 21 };

    expect(buildCreateVodReq(input).mentorId).toBe(21);
    expect(buildUpdateVodReq(1, input).mentorId).toBe(21);
  });

  it('멘토를 고르지 않으면 요청에 null 을 보내지 않는다', () => {
    expect(buildCreateVodReq(initialVodInput).mentorId).toBeUndefined();
    expect(buildUpdateVodReq(1, initialVodInput).mentorId).toBeUndefined();
  });

  it('VOD 복제(상세 -> 폼 -> 생성 요청)에서 멘토가 이어진다', () => {
    const req = buildCreateVodReq(vodToFormInput(vodWithMentor(21)));

    expect(req.mentorId).toBe(21);
  });
});
