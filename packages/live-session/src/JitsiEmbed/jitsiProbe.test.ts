import { afterEach, describe, expect, it } from 'vitest';

import {
  pickNextBase,
  probeJitsiExternalApi,
  safeHost,
} from './jitsiHealthCheck';

describe('safeHost', () => {
  it('URL에서 host를 뽑는다', () => {
    expect(safeHost('https://jitsi-a.example.com/room-x')).toBe(
      'jitsi-a.example.com',
    );
    expect(safeHost('https://jitsi-b.example.com/')).toBe(
      'jitsi-b.example.com',
    );
  });

  it('파싱 불가한 값은 null', () => {
    expect(safeHost('not-a-url')).toBeNull();
    expect(safeHost('')).toBeNull();
  });
});

describe('pickNextBase', () => {
  const A = 'https://jitsi-a.example.com/';
  const B = 'https://jitsi-b.example.com/';

  it('아직 시도하지 않은 첫 우선순위 base를 고른다', () => {
    expect(pickNextBase([A, B], new Set())).toBe(A);
  });

  it('시도한 host는 건너뛰고 다음을 고른다', () => {
    expect(pickNextBase([A, B], new Set(['jitsi-a.example.com']))).toBe(B);
  });

  it('모두 시도했으면 null', () => {
    const tried = new Set(['jitsi-a.example.com', 'jitsi-b.example.com']);
    expect(pickNextBase([A, B], tried)).toBeNull();
  });

  it('빈 값/undefined 후보는 무시한다', () => {
    expect(pickNextBase([undefined, '', '  ', B], new Set())).toBe(B);
  });

  it('trailing slash가 없어도 정규화해서 반환한다', () => {
    expect(pickNextBase(['https://jitsi-a.example.com'], new Set())).toBe(A);
  });
});

describe('probeJitsiExternalApi', () => {
  afterEach(() => {
    delete (window as { JitsiMeetExternalAPI?: unknown }).JitsiMeetExternalAPI;
  });

  it('host를 파싱할 수 없으면 false', async () => {
    await expect(probeJitsiExternalApi('not-a-url')).resolves.toBe(false);
  });

  it('이미 external_api가 로드돼 있으면(window.JitsiMeetExternalAPI) 즉시 true', async () => {
    (window as { JitsiMeetExternalAPI?: unknown }).JitsiMeetExternalAPI =
      function () {};
    await expect(
      probeJitsiExternalApi('https://jitsi-a.example.com/room-x'),
    ).resolves.toBe(true);
  });

  it('타임아웃이 지나면 false로 resolve한다(스크립트 미로드)', async () => {
    // jsdom 은 <script> 를 실제 로드하지 않아 onload/onerror 가 뜨지 않는다.
    // 짧은 타임아웃을 주면 그 시간 뒤 false 로 귀결된다.
    await expect(
      probeJitsiExternalApi('https://jitsi-dead.example.com/room-x', 10),
    ).resolves.toBe(false);
  });
});
