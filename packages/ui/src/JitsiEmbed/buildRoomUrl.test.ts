import { describe, expect, it } from 'vitest';
import {
  buildJitsiRoomName,
  buildJitsiRoomUrl,
  type BuildJitsiRoomUrlInput,
} from './buildRoomUrl';

const baseInput: BuildJitsiRoomUrlInput = {
  baseUrl: 'https://meet.jit.si/',
  challengeName: '취준생을 위한 AI 활용 챌린지',
  missionName: '1주차 자소서 피드백',
  menteeName: '홍길동',
  startDate: '2026-05-21T19:00:00',
  feedbackId: 1234,
};

describe('buildJitsiRoomName', () => {
  it('재현성: 같은 입력은 같은 방 이름을 만든다', () => {
    expect(buildJitsiRoomName(baseInput)).toBe(buildJitsiRoomName(baseInput));
  });

  it('분리성: feedbackId가 다르면 방 이름이 다르다', () => {
    const a = buildJitsiRoomName(baseInput);
    const b = buildJitsiRoomName({ ...baseInput, feedbackId: 9999 });
    expect(a).not.toBe(b);
  });

  it('분리성: 시작 시간이 다르면 방 이름이 다르다', () => {
    const a = buildJitsiRoomName(baseInput);
    const b = buildJitsiRoomName({
      ...baseInput,
      startDate: '2026-05-22T19:00:00',
    });
    expect(a).not.toBe(b);
  });

  it('한국어 보존: 챌린지/미션/멘티 한국어가 그대로 들어있다', () => {
    const name = buildJitsiRoomName(baseInput);
    expect(name).toContain('취준생을위한AI활용챌린지');
    expect(name).toContain('1주차자소서피드백');
    expect(name).toContain('홍길동');
  });

  it('정규화: 공백과 특수문자(/?#:)를 제거한다', () => {
    const name = buildJitsiRoomName({
      ...baseInput,
      challengeName: 'AI / 활용 ? 챌린지 # : test',
    });
    expect(name).not.toMatch(/[\s/?#:]/);
  });

  it('포맷: YYYYMMDD-HHmm 토큰이 포함된다', () => {
    const name = buildJitsiRoomName(baseInput);
    expect(name).toContain('20260521-1900');
  });

  it('shortHash: 4자리 base36 문자열이 끝에 붙는다', () => {
    const name = buildJitsiRoomName(baseInput);
    const last = name.split('-').pop() ?? '';
    expect(last).toMatch(/^[0-9a-z]{4}$/);
  });

  it('길이 컷오프: 매우 긴 챌린지명도 80자 안에 들어간다', () => {
    const longChallenge = '아주' + '긴챌린지이름'.repeat(20);
    const name = buildJitsiRoomName({
      ...baseInput,
      challengeName: longChallenge,
    });
    expect(name.length).toBeLessThanOrEqual(80);
  });

  it('길이 컷오프: 챌린지명을 먼저 자르고 미션명은 유지한다', () => {
    const longChallenge = '챌린지'.repeat(50);
    const name = buildJitsiRoomName({
      ...baseInput,
      challengeName: longChallenge,
    });
    // 미션명/멘티명/날짜는 그대로 들어 있어야 함
    expect(name).toContain('1주차자소서피드백');
    expect(name).toContain('홍길동');
    expect(name).toContain('20260521-1900');
  });

  it('극단적으로 긴 미션명도 안전하게 자른다', () => {
    const longMission = '미션'.repeat(100);
    const name = buildJitsiRoomName({
      ...baseInput,
      missionName: longMission,
    });
    expect(name.length).toBeLessThanOrEqual(80);
    // 고정 영역(멘티명/날짜/해시)은 유지
    expect(name).toContain('홍길동');
    expect(name).toContain('20260521-1900');
  });

  it('잘못된 날짜는 invaliddate 토큰으로 대체된다', () => {
    const name = buildJitsiRoomName({
      ...baseInput,
      startDate: 'not-a-date',
    });
    expect(name).toContain('invaliddate');
  });
});

describe('buildJitsiRoomUrl', () => {
  it('baseUrl과 인코딩된 방 이름을 이어 붙인다', () => {
    const url = buildJitsiRoomUrl(baseInput);
    expect(url.startsWith('https://meet.jit.si/')).toBe(true);
  });

  it('baseUrl이 슬래시로 끝나지 않아도 자동으로 보완한다', () => {
    const url = buildJitsiRoomUrl({
      ...baseInput,
      baseUrl: 'https://meet.jit.si',
    });
    expect(url.startsWith('https://meet.jit.si/')).toBe(true);
  });

  it('한국어 방 이름이 URL 인코딩된다', () => {
    const url = buildJitsiRoomUrl(baseInput);
    // 한국어는 인코딩되어 % 시퀀스로 변환됨
    expect(url).toMatch(/%[0-9A-F]{2}/);
  });

  it('같은 입력으로 만든 URL은 동일하다 (멘티/멘토 화면 수렴 보장)', () => {
    expect(buildJitsiRoomUrl(baseInput)).toBe(buildJitsiRoomUrl(baseInput));
  });

  it('다른 baseUrl이어도 방 이름 부분은 동일하다 (primary/fallback 공통 방)', () => {
    const primary = buildJitsiRoomUrl(baseInput);
    const fallback = buildJitsiRoomUrl({
      ...baseInput,
      baseUrl: 'https://jitsi-letscareer.supabin.com/',
    });
    expect(primary.replace('https://meet.jit.si/', '')).toBe(
      fallback.replace('https://jitsi-letscareer.supabin.com/', ''),
    );
  });
});
