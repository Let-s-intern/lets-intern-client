import {
  clearApplicationSession,
  clearDraft,
  draftStorageKey,
  readDraft,
  saveDraft,
  type OneTimeFormDraft,
} from './applicationDraft';
import { readUtm, saveUtmOnce, type UtmStorage } from './utmStorage';

const createFakeStorage = (): UtmStorage & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => {
      data.set(key, value);
    },
    removeItem: (key) => {
      data.delete(key);
    },
  };
};

const throwingStorage: UtmStorage = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
  removeItem: () => {
    throw new Error('SecurityError');
  },
};

// 계약 U3 요청 예시(신청 1042)
const DRAFT: OneTimeFormDraft = {
  name: '김렛커',
  email: 'letscareer@example.com',
  phoneNum: '010-1234-5678',
  selectedOptionIds: [311, 321],
  answers: {
    '101': '프론트엔드',
    '103': ['월', '수'],
    '106': 12,
    '110': {
      key: 'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf',
      name: '김렛커_이력서_최종.pdf',
    },
  },
  orderId: null,
  amount: 49000,
};

describe('applicationDraft', () => {
  it('키는 one-time-form:{slug}:draft 다', () => {
    expect(draftStorageKey('portfolio-1115')).toBe(
      'one-time-form:portfolio-1115:draft',
    );
  });

  it('저장한 값을 다시 읽는다(새로고침 뒤에도 같은 창 저장소에 남는다)', () => {
    const storage = createFakeStorage();
    expect(saveDraft('portfolio-1115', DRAFT, storage)).toBe(true);

    expect(
      JSON.parse(storage.data.get('one-time-form:portfolio-1115:draft')!),
    ).toEqual(DRAFT);
    expect(readDraft('portfolio-1115', storage)).toEqual(DRAFT);
  });

  it('주문번호를 넣어 다시 저장하면 덮어쓴다', () => {
    const storage = createFakeStorage();
    saveDraft('portfolio-1115', DRAFT, storage);
    saveDraft(
      'portfolio-1115',
      { ...DRAFT, orderId: 'letsXk29Pq8812' },
      storage,
    );

    expect(readDraft('portfolio-1115', storage)?.orderId).toBe(
      'letsXk29Pq8812',
    );
  });

  it('다른 폼의 값과 섞이지 않는다', () => {
    const storage = createFakeStorage();
    saveDraft('portfolio-1115', DRAFT, storage);
    saveDraft(
      'zero-test',
      { ...DRAFT, selectedOptionIds: [911], answers: {}, amount: 0 },
      storage,
    );

    expect(readDraft('portfolio-1115', storage)).toEqual(DRAFT);
    expect(readDraft('zero-test', storage)?.selectedOptionIds).toEqual([911]);
    expect(readDraft('seminar-1130', storage)).toBeNull();

    clearDraft('zero-test', storage);
    expect(readDraft('portfolio-1115', storage)).toEqual(DRAFT);
  });

  it('깨진 JSON 이나 형태가 다른 값은 null 이다', () => {
    const storage = createFakeStorage();
    storage.setItem(draftStorageKey('portfolio-1115'), '{not json');
    expect(readDraft('portfolio-1115', storage)).toBeNull();

    storage.setItem(
      draftStorageKey('portfolio-1115'),
      JSON.stringify({ ...DRAFT, amount: '49000' }),
    );
    expect(readDraft('portfolio-1115', storage)).toBeNull();

    storage.setItem(
      draftStorageKey('portfolio-1115'),
      JSON.stringify({ name: '김렛커' }),
    );
    expect(readDraft('portfolio-1115', storage)).toBeNull();
  });

  it('저장소가 던지거나 없으면 저장은 false, 읽기는 null, 지우기는 조용히 넘어간다', () => {
    expect(saveDraft('portfolio-1115', DRAFT, throwingStorage)).toBe(false);
    expect(readDraft('portfolio-1115', throwingStorage)).toBeNull();
    expect(() => clearDraft('portfolio-1115', throwingStorage)).not.toThrow();
    expect(() =>
      clearApplicationSession('portfolio-1115', throwingStorage),
    ).not.toThrow();

    expect(saveDraft('portfolio-1115', DRAFT, null)).toBe(false);
    expect(readDraft('portfolio-1115', null)).toBeNull();
  });

  it('신청 완료 후 이 폼의 입력값과 UTM 을 함께 지우고 다른 폼은 남긴다', () => {
    const storage = createFakeStorage();
    const utm = {
      utmSource: 'instagram',
      utmMedium: 'paid',
      utmCampaign: 'portfolio_1115',
      utmContent: 'story_a',
      utmTerm: null,
      referrer: 'https://event-xxx.vercel.app/',
    };
    saveDraft('portfolio-1115', DRAFT, storage);
    saveUtmOnce('portfolio-1115', utm, storage);
    saveDraft('zero-test', DRAFT, storage);

    clearApplicationSession('portfolio-1115', storage);

    expect(readDraft('portfolio-1115', storage)).toBeNull();
    expect(readUtm('portfolio-1115', storage)).toBeNull();
    expect(readDraft('zero-test', storage)).toEqual(DRAFT);
  });
});
