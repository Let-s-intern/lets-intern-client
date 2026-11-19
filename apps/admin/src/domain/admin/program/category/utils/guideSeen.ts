/** 사용법 창을 본 적이 있는지. 브라우저마다 따로 기억한다 */
export const GUIDE_SEEN_KEY = 'admin-program-category-guide-seen';

type GuideStorage = Pick<Storage, 'getItem' | 'setItem'>;

const defaultStorage = (): GuideStorage | null => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

/** 저장소를 못 쓰면(사생활 보호 창 등) 본 것으로 친다. 매번 뜨는 것보다 안 뜨는 편이 낫다 */
export const hasSeenGuide = (
  storage: GuideStorage | null = defaultStorage(),
) => {
  try {
    if (!storage) return true;
    return storage.getItem(GUIDE_SEEN_KEY) === '1';
  } catch {
    return true;
  }
};

export const markGuideSeen = (
  storage: GuideStorage | null = defaultStorage(),
) => {
  try {
    storage?.setItem(GUIDE_SEEN_KEY, '1');
  } catch {
    // 기억하지 못해도 이번 화면에서는 닫힌다
  }
};
