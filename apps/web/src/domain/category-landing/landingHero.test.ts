import { resolveLandingHero } from './landingHero';

const content = { heroTitle: '고정 제목', heroDescription: '고정 설명' };

describe('resolveLandingHero', () => {
  it('어드민 값이 있으면 그것을 쓴다', () => {
    expect(
      resolveLandingHero(
        {
          placementType: 'LANDING',
          heroTitle: '어드민 제목',
          heroDescription: '어드민 설명',
        },
        content,
        '목록',
      ),
    ).toEqual({ title: '어드민 제목', description: '어드민 설명' });
  });

  it('어드민 값이 비면 고정 문구, 그것도 없으면 목록 이름', () => {
    expect(
      resolveLandingHero(
        { placementType: 'LANDING', heroTitle: '' },
        content,
        '목록',
      ),
    ).toEqual({ title: '고정 제목', description: '고정 설명' });
    expect(resolveLandingHero(undefined, undefined, '목록')).toEqual({
      title: '목록',
      description: undefined,
    });
  });

  it('제목만 어드민 값이면 설명은 고정 문구를 쓴다', () => {
    expect(
      resolveLandingHero(
        { placementType: 'LANDING', heroTitle: '새 제목' },
        content,
        '목록',
      ),
    ).toEqual({ title: '새 제목', description: '고정 설명' });
  });
});
