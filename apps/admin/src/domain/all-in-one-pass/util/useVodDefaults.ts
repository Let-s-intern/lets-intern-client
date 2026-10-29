import { useSeminarVods } from '@/api/all-in-one-pass/useSeminarVods';
import { PassFormInput } from '@/domain/all-in-one-pass/types';

/** 3개 미만 선택 시 자동으로 넣는 기본 VOD id (모달·저장 공용) */
export const DEFAULT_VOD_IDS = [25, 27, 34];

/** 저장 직전 VOD 자동 보정 — vods가 3개가 아니면 기본 VOD(DEFAULT_VOD_IDS)로 채우고 vodCount는 전체 목록 길이로 맞춤. 모달 안 열고 저장해도 기본값 반영. */
export function useVodDefaults() {
  const { data } = useSeminarVods();
  const list = data ?? [];

  return (input: PassFormInput): PassFormInput => {
    if (list.length === 0) return input;

    const vods =
      input.landing.vods.length === 3
        ? input.landing.vods
        : DEFAULT_VOD_IDS.flatMap((id) => {
            const v = list.find((x) => x.id === id);
            return v
              ? [
                  {
                    title: v.title,
                    thumbnail: v.thumbnailUrl,
                    description: v.description,
                  },
                ]
              : [];
          });

    return {
      ...input,
      landing: { ...input.landing, vods, vodCount: list.length },
    };
  };
}
