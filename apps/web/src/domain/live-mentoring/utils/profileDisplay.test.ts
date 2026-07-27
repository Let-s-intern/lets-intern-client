import type { ChecklistItem } from '@/api/live-mentoring/liveMentoringSchema';
import {
  imagePlaceholderTitle,
  mosaicStyle,
  shouldShowImage,
  visibleChecklist,
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

describe('visibleChecklist', () => {
  const checklist: ChecklistItem[] = [
    { id: 1, label: '기본항목', mode: 'SHOWN' },
    { id: 2, label: '숨김항목', mode: 'HIDDEN' },
    { id: 3, label: '기본라벨', mode: 'CUSTOM', customText: '커스텀문구' },
    { id: 4, label: '커스텀인데빈값', mode: 'CUSTOM' },
  ];

  it('HIDDEN 은 제외하고, CUSTOM+customText 는 customText 를 쓴다', () => {
    expect(visibleChecklist(checklist)).toEqual([
      { id: 1, text: '기본항목' },
      { id: 3, text: '커스텀문구' },
      { id: 4, text: '커스텀인데빈값' },
    ]);
  });
});
