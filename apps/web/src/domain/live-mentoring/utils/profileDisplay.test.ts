import type { ChecklistItem } from '@/api/live-mentoring/liveMentoringSchema';
import {
  anonymousTitle,
  displayTitle,
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

describe('displayTitle / shouldShowImage', () => {
  it('프로필 노출이면 닉네임을 그대로 노출하고 이미지를 보여준다', () => {
    expect(displayTitle(base)).toBe('자소서장인');
    expect(shouldShowImage(base)).toBe(true);
  });

  it('프로필 비노출이면 익명 타이틀을 쓰고 이미지를 감춘다', () => {
    const hidden = { ...base, profileVisible: false };
    expect(displayTitle(hidden)).toBe('자소서장인의 1대1 라이브 멘토링');
    expect(anonymousTitle('홍길동')).toBe('홍길동의 1대1 라이브 멘토링');
    expect(shouldShowImage(hidden)).toBe(false);
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
