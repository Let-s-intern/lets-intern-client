import {
  buildSessionAnswer,
  getSelectedDays,
  getSelectedSessionCount,
  type LetsconSelection,
} from './applySelection';

const ONLINE: LetsconSelection = {
  day14: ['hr'],
  day15: ['iv'],
  mode: 'online',
};

describe('getSelectedSessionCount', () => {
  it('온라인은 고른 세션만 센다', () => {
    expect(getSelectedSessionCount(ONLINE)).toBe(2);
    expect(getSelectedSessionCount({ ...ONLINE, day14: [], day15: [] })).toBe(
      0,
    );
  });

  it('오프라인은 11/15 체크와 상관없이 두 세션을 포함한다', () => {
    expect(
      getSelectedSessionCount({ day14: [], day15: [], mode: 'offline' }),
    ).toBe(2);
  });
});

describe('buildSessionAnswer', () => {
  it('날짜별 세션과 참여 방식을 적는다', () => {
    expect(buildSessionAnswer(ONLINE)).toBe(
      '11/14 온라인: HR | 11/15 온라인: 대기업 면접관 관점',
    );
  });

  it('오프라인은 두 세션을 모두 적고, 고르지 않은 날은 없음으로 적는다', () => {
    expect(buildSessionAnswer({ day14: [], day15: [], mode: 'offline' })).toBe(
      '11/14 온라인: 없음 | 11/15 오프라인: 마케팅, 대기업 면접관 관점',
    );
  });
});

describe('getSelectedDays', () => {
  it('날짜별로 고른 세션을 묶는다', () => {
    expect(getSelectedDays(ONLINE)).toEqual([
      { label: '11/14 온라인', titles: ['HR'] },
      { label: '11/15 온라인', titles: ['대기업 면접관 관점'] },
    ]);
  });

  it('오프라인은 11/15 두 세션을 모두 보여 주고, 고르지 않은 날은 뺀다', () => {
    expect(getSelectedDays({ day14: [], day15: [], mode: 'offline' })).toEqual([
      { label: '11/15 오프라인', titles: ['마케팅', '대기업 면접관 관점'] },
    ]);
  });

  it('아무것도 고르지 않으면 빈 목록이다', () => {
    expect(getSelectedDays({ day14: [], day15: [], mode: 'online' })).toEqual(
      [],
    );
  });
});
