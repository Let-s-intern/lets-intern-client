import { resolveChallengeThumbnail } from './challengeThumbnail';

describe('챌린지 기본 썸네일', () => {
  it('제목이 그려진 배경은 그대로, 없는 배경은 화면 제목을 얹는다', () => {
    expect(
      resolveChallengeThumbnail(
        '[대학생·무경력자 Ver] 이력서 1주 완성 챌린지 25기',
        '이력서 1주 완성 챌린지',
      ),
    ).toEqual({
      src: '/images/challenge-default-thumbnail/career-start-ver.png',
    });
    expect(
      resolveChallengeThumbnail(
        '포트폴리오 10일 완성 챌린지 43기',
        '포트폴리오 10일 완성 챌린지',
      ),
    ).toMatchObject({ overlayTitle: '포트폴리오 10일 완성 챌린지' });
    expect(
      resolveChallengeThumbnail('대기업 자기소개서 완성 챌린지 13기', 'x')?.src,
    ).toContain('large-corp');
  });

  it('직무·면접처럼 기본 이미지가 없으면 null', () => {
    expect(
      resolveChallengeThumbnail('마케팅 서류 완성 올인원 챌린지 11기', 'x'),
    ).toBeNull();
    expect(
      resolveChallengeThumbnail('PM/서비스기획 취뽀 서류 완성 챌린지 4기', 'x'),
    ).toBeNull();
    expect(
      resolveChallengeThumbnail('면접 준비 7일 끝장 챌린지 10기', 'x'),
    ).toBeNull();
  });
});
