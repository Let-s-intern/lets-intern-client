import { oneTimeFormAnswersSchema } from '@/api/one-time-form/oneTimeFormSchema';
import { z } from 'zod';
import { clearUtm, getSessionStorage, type UtmStorage } from './utmStorage';

// 계약 11.4: 유료 폼 "다음"에서 입력값을 slug 별 sessionStorage 에 보관하고 U3 성공 때 지운다.
// 토스 왕복(같은 창) 뒤 /payment/result 가 이 값과 쿼리로 U3 를 부른다.

const applicationDraftSchema = z.object({
  name: z.string(),
  email: z.string(),
  phoneNum: z.string(),
  selectedOptionIds: z.array(z.number()),
  answers: oneTimeFormAnswersSchema,
  // "다음"에서는 아직 없다. 결제 단계에서 결제 버튼을 누를 때마다 새로 만들어 넣는다(11.3)
  orderId: z.string().nullable(),
  amount: z.number(),
});

export type OneTimeFormDraft = z.infer<typeof applicationDraftSchema>;

export const draftStorageKey = (slug: string) => `one-time-form:${slug}:draft`;

/** 저장소를 쓸 수 없으면 false. 호출한 쪽이 결제 단계로 넘어가지 않고 안내한다 */
export const saveDraft = (
  slug: string,
  draft: OneTimeFormDraft,
  storage: UtmStorage | null = getSessionStorage(),
): boolean => {
  if (!storage) return false;
  try {
    storage.setItem(draftStorageKey(slug), JSON.stringify(draft));
    return true;
  } catch {
    return false;
  }
};

/** 보관한 값. 없거나, 읽을 수 없거나, 형태가 다르면 null */
export const readDraft = (
  slug: string,
  storage: UtmStorage | null = getSessionStorage(),
): OneTimeFormDraft | null => {
  if (!storage) return null;
  try {
    const raw = storage.getItem(draftStorageKey(slug));
    if (raw === null) return null;
    const parsed = applicationDraftSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

export const clearDraft = (
  slug: string,
  storage: UtmStorage | null = getSessionStorage(),
): void => {
  try {
    storage?.removeItem(draftStorageKey(slug));
  } catch {
    // 지우지 못해도 다음 신청은 서버가 중복으로 막는다
  }
};

/** U3 성공 뒤 이 폼의 보관값(입력값과 UTM)을 모두 지운다 */
export const clearApplicationSession = (
  slug: string,
  storage: UtmStorage | null = getSessionStorage(),
): void => {
  clearDraft(slug, storage);
  clearUtm(slug, storage);
};
