import {
  imagePlaceholderTitle,
  mosaicStyle,
  shouldShowImage,
} from './profileDisplay';

const base = {
  nickname: '자소서장인',
  profileVisible: true,
  mosaicEnabled: false,
  mosaicBlur: 0,
};

describe('shouldShowImage / imagePlaceholderTitle', () => {
  it('프로필 노출이면 이미지를 보여준다', () => {
    expect(shouldShowImage(base)).toBe(true);
  });

  it('프로필 비노출이면 이미지를 감추고 이미지 자리에 "○○ 멘토님의 멘토링" 문구', () => {
    const hidden = { ...base, profileVisible: false };
    expect(shouldShowImage(hidden)).toBe(false);
    expect(imagePlaceholderTitle('홍길동')).toBe('홍길동 멘토님의 멘토링');
  });
});

describe('mosaicStyle', () => {
  it('모자이크 on 이면 blur 강도(px)를 인라인 filter 로 반환', () => {
    expect(mosaicStyle({ mosaicEnabled: true, mosaicBlur: 8 })).toEqual({
      filter: 'blur(8px)',
    });
  });

  it('모자이크 off 이면 undefined', () => {
    expect(
      mosaicStyle({ mosaicEnabled: false, mosaicBlur: 8 }),
    ).toBeUndefined();
  });
});
