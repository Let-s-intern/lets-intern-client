import { describe, expect, it } from 'vitest';

import { getVodIdSchema } from './schema';

// 회귀 방지: vodInfoSchema 에 mentorId 가 없으면 zod 가 필드를 버려
// VOD 수정 화면이 늘 멘토 미연결로 보인다.
describe('getVodIdSchema - vodInfo.mentorId', () => {
  const parseVodInfo = (vodInfo: Record<string, unknown>) =>
    getVodIdSchema.parse({ vodInfo: { id: 1, ...vodInfo } }).vodInfo;

  it('연결된 멘토의 mentorId 를 버리지 않는다', () => {
    expect(parseVodInfo({ mentorId: 21 }).mentorId).toBe(21);
  });

  it('멘토가 연결되지 않은 VOD 는 mentorId 가 null 이다', () => {
    expect(parseVodInfo({ mentorId: null }).mentorId).toBeNull();
  });

  it('mentorId 가 없는 응답도 파싱된다', () => {
    expect(parseVodInfo({}).mentorId).toBeUndefined();
  });
});
