/**
 * errorDedupe 단위 테스트 — buildSignature / recordAndCheckFirst /
 * peekAll / clearAll / flushAll 동작 검증.
 *
 * 모듈 레벨 store 를 사용하므로 각 test 시작 전 clearAll() 호출하여 격리.
 */
import {
  ERROR_SIGNATURE_MAX_LENGTH,
  buildSignature,
  clearAll,
  flushAll,
  peekAll,
  recordAndCheckFirst,
} from './errorDedupe';

describe('errorDedupe', () => {
  beforeEach(() => {
    clearAll();
  });

  describe('buildSignature', () => {
    it('name 과 message 를 ::로 결합', () => {
      expect(buildSignature('TypeError', 'foo is undefined')).toBe(
        'TypeError::foo is undefined',
      );
    });

    it('message 가 ERROR_SIGNATURE_MAX_LENGTH 보다 길면 잘림', () => {
      const longMsg = 'x'.repeat(ERROR_SIGNATURE_MAX_LENGTH + 50);
      const sig = buildSignature('Err', longMsg);
      expect(sig).toBe(
        `Err::${'x'.repeat(ERROR_SIGNATURE_MAX_LENGTH)}`,
      );
      expect(sig.length).toBe(5 /* 'Err::' */ + ERROR_SIGNATURE_MAX_LENGTH);
    });

    it('짧은 message 는 그대로', () => {
      expect(buildSignature('Err', 'short')).toBe('Err::short');
    });

    it('동일 입력은 동일 signature', () => {
      const a = buildSignature('A', 'b');
      const b = buildSignature('A', 'b');
      expect(a).toBe(b);
    });
  });

  describe('recordAndCheckFirst', () => {
    it('첫 발생 → true 리턴', () => {
      const isFirst = recordAndCheckFirst('sig-1', {
        name: 'TypeError',
        message: 'first',
      });
      expect(isFirst).toBe(true);
    });

    it('같은 signature 재호출 → false 리턴', () => {
      recordAndCheckFirst('sig-1', { name: 'E', message: 'm' });
      const second = recordAndCheckFirst('sig-1', {
        name: 'E',
        message: 'm',
      });
      expect(second).toBe(false);
    });

    it('다른 signature → 각각 첫 발생으로 true', () => {
      expect(
        recordAndCheckFirst('sig-A', { name: 'A', message: '1' }),
      ).toBe(true);
      expect(
        recordAndCheckFirst('sig-B', { name: 'B', message: '2' }),
      ).toBe(true);
    });

    it('반복 호출 시 count 증가', () => {
      recordAndCheckFirst('sig-1', { name: 'E', message: 'm' });
      recordAndCheckFirst('sig-1', { name: 'E', message: 'm' });
      recordAndCheckFirst('sig-1', { name: 'E', message: 'm' });
      const entries = peekAll();
      expect(entries).toHaveLength(1);
      expect(entries[0].count).toBe(3);
    });

    it('첫 발생 시 sample 정보 저장', () => {
      recordAndCheckFirst('sig-1', {
        name: 'TypeError',
        message: 'm',
        url: 'https://example.com/foo',
        userAgent: 'test/1.0',
      });
      const [entry] = peekAll();
      expect(entry.name).toBe('TypeError');
      expect(entry.message).toBe('m');
      expect(entry.sampleUrl).toBe('https://example.com/foo');
      expect(entry.sampleUserAgent).toBe('test/1.0');
      expect(entry.count).toBe(1);
    });

    it('firstSeen 은 첫 발생, lastSeen 은 마지막 발생', async () => {
      recordAndCheckFirst('sig-1', { name: 'E', message: 'm' });
      const [first] = peekAll();
      const firstSeen = first.firstSeen;
      const firstLastSeen = first.lastSeen;

      // 시간차 보장 위해 1ms 대기
      await new Promise((r) => setTimeout(r, 5));
      recordAndCheckFirst('sig-1', { name: 'E', message: 'm' });

      const [updated] = peekAll();
      expect(updated.firstSeen).toBe(firstSeen);
      expect(
        new Date(updated.lastSeen).getTime() >=
          new Date(firstLastSeen).getTime(),
      ).toBe(true);
    });
  });

  describe('peekAll', () => {
    it('빈 store 에서 빈 배열', () => {
      expect(peekAll()).toEqual([]);
    });

    it('store 의 entries 모두 반환', () => {
      recordAndCheckFirst('a', { name: 'A', message: '1' });
      recordAndCheckFirst('b', { name: 'B', message: '2' });
      const entries = peekAll();
      expect(entries).toHaveLength(2);
      expect(entries.map((e) => e.signature).sort()).toEqual(['a', 'b']);
    });

    it('호출해도 store 는 비워지지 않음 (non-destructive)', () => {
      recordAndCheckFirst('a', { name: 'A', message: '1' });
      peekAll();
      peekAll();
      expect(peekAll()).toHaveLength(1);
    });
  });

  describe('clearAll', () => {
    it('store 비움', () => {
      recordAndCheckFirst('a', { name: 'A', message: '1' });
      recordAndCheckFirst('b', { name: 'B', message: '2' });
      clearAll();
      expect(peekAll()).toEqual([]);
    });

    it('비어있을 때 호출해도 안전', () => {
      expect(() => clearAll()).not.toThrow();
    });

    it('clear 후 다시 record 시 첫 발생으로 인식', () => {
      recordAndCheckFirst('a', { name: 'A', message: '1' });
      clearAll();
      const isFirstAgain = recordAndCheckFirst('a', {
        name: 'A',
        message: '1',
      });
      expect(isFirstAgain).toBe(true);
    });
  });

  describe('flushAll', () => {
    it('peek + clear 묶음 동작', () => {
      recordAndCheckFirst('a', { name: 'A', message: '1' });
      recordAndCheckFirst('b', { name: 'B', message: '2' });

      const flushed = flushAll();
      expect(flushed).toHaveLength(2);

      // 호출 후 store 는 비워져 있음
      expect(peekAll()).toEqual([]);
    });

    it('빈 store flush → 빈 배열', () => {
      expect(flushAll()).toEqual([]);
    });
  });

  describe('통합 시나리오', () => {
    it('첫 1번 send + 반복 2번 dedupe + flush 시 count: 3', () => {
      // 첫 발생
      const r1 = recordAndCheckFirst('sig-1', {
        name: 'E',
        message: 'm',
      });
      expect(r1).toBe(true);

      // 반복 — dedupe
      const r2 = recordAndCheckFirst('sig-1', {
        name: 'E',
        message: 'm',
      });
      const r3 = recordAndCheckFirst('sig-1', {
        name: 'E',
        message: 'm',
      });
      expect(r2).toBe(false);
      expect(r3).toBe(false);

      // digest 시점에 누적분 확인
      const flushed = flushAll();
      expect(flushed).toHaveLength(1);
      expect(flushed[0].count).toBe(3);
    });

    it('서로 다른 시그니처 3종 → 각자 카운트', () => {
      recordAndCheckFirst('a', { name: 'A', message: '1' }); // 1회
      recordAndCheckFirst('b', { name: 'B', message: '2' }); // 1회
      recordAndCheckFirst('b', { name: 'B', message: '2' }); // 2회
      recordAndCheckFirst('c', { name: 'C', message: '3' }); // 1회
      recordAndCheckFirst('c', { name: 'C', message: '3' }); // 2회
      recordAndCheckFirst('c', { name: 'C', message: '3' }); // 3회

      const entries = flushAll().sort((x, y) =>
        x.signature.localeCompare(y.signature),
      );
      expect(entries.map((e) => [e.signature, e.count])).toEqual([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ]);
    });
  });
});
