import { describe, expect, it } from 'vitest';

import {
  buildJitsiRoomName,
  buildJitsiRoomUrl,
  type BuildJitsiRoomUrlInput,
} from './buildRoomUrl';

const BASE = 'https://meet.jit.si/';
const FALLBACK = 'https://jitsi-letscareer.supabin.com/';
const SALT = 'lc-prod-salt-2026';

function makeInput(
  overrides: Partial<BuildJitsiRoomUrlInput> = {},
): BuildJitsiRoomUrlInput {
  return {
    baseUrl: BASE,
    feedbackId: 1234,
    salt: SALT,
    ...overrides,
  };
}

describe('buildJitsiRoomName', () => {
  it('"letscareer-livefeedback-" prefix + 12자리 base36 해시 형태로 생성된다', () => {
    const name = buildJitsiRoomName(makeInput());
    expect(name).toMatch(/^letscareer-livefeedback-[0-9a-z]{12}$/);
  });

  it('회사명 prefix를 포함해 다른 조직과의 우연 충돌을 회피한다', () => {
    const name = buildJitsiRoomName(makeInput());
    expect(name.startsWith('letscareer-livefeedback-')).toBe(true);
  });

  it('같은 입력 → 항상 같은 이름 (재현성: 양측 수렴의 핵심)', () => {
    const a = buildJitsiRoomName(makeInput());
    const b = buildJitsiRoomName(makeInput());
    expect(a).toBe(b);
  });

  it('feedbackId가 다르면 이름도 다르다', () => {
    const a = buildJitsiRoomName(makeInput({ feedbackId: 100 }));
    const b = buildJitsiRoomName(makeInput({ feedbackId: 101 }));
    expect(a).not.toBe(b);
  });

  it('salt가 다르면 이름도 다르다 (env 격리)', () => {
    const a = buildJitsiRoomName(makeInput({ salt: 'salt-a' }));
    const b = buildJitsiRoomName(makeInput({ salt: 'salt-b' }));
    expect(a).not.toBe(b);
  });

  it('1000개의 연속 feedbackId에서 충돌이 발생하지 않는다', () => {
    const names = new Set<string>();
    for (let id = 1; id <= 1000; id += 1) {
      names.add(buildJitsiRoomName(makeInput({ feedbackId: id })));
    }
    expect(names.size).toBe(1000);
  });

  it('baseUrl은 이름에 영향을 주지 않는다 (primary/fallback 방 동일성 보장)', () => {
    const primary = buildJitsiRoomName(makeInput({ baseUrl: BASE }));
    const fallback = buildJitsiRoomName(makeInput({ baseUrl: FALLBACK }));
    expect(primary).toBe(fallback);
  });
});

describe('buildJitsiRoomUrl', () => {
  it('baseUrl에 슬래시가 있으면 그대로 이어 붙인다', () => {
    const url = buildJitsiRoomUrl(makeInput());
    expect(url.startsWith('https://meet.jit.si/letscareer-livefeedback-')).toBe(
      true,
    );
  });

  it('baseUrl 끝에 슬래시가 없어도 자동으로 추가한다', () => {
    const url = buildJitsiRoomUrl(makeInput({ baseUrl: 'https://meet.jit.si' }));
    expect(url).toMatch(
      /^https:\/\/meet\.jit\.si\/letscareer-livefeedback-[0-9a-z]{12}$/,
    );
  });

  it('primary와 fallback URL의 방 이름은 동일하다 (서버만 다른 같은 방)', () => {
    const primary = buildJitsiRoomUrl(makeInput({ baseUrl: BASE }));
    const fallback = buildJitsiRoomUrl(makeInput({ baseUrl: FALLBACK }));
    expect(primary.replace(BASE, '')).toBe(fallback.replace(FALLBACK, ''));
  });

  it('어드민 시나리오: feedbackId + salt만 알면 같은 URL을 재구성할 수 있다', () => {
    const mentee = buildJitsiRoomUrl({
      baseUrl: BASE,
      feedbackId: 5678,
      salt: SALT,
    });
    const mentor = buildJitsiRoomUrl({
      baseUrl: BASE,
      feedbackId: 5678,
      salt: SALT,
    });
    const admin = buildJitsiRoomUrl({
      baseUrl: BASE,
      feedbackId: 5678,
      salt: SALT,
    });
    expect(mentee).toBe(mentor);
    expect(mentor).toBe(admin);
  });
});
