import { useSeminarVods } from '@/api/all-in-one-pass/useSeminarVods';
import { PassFormInput } from '@/domain/all-in-one-pass/types';

/** 3개 미만 선택 시 자동으로 넣는 기본 VOD id (모달·저장 공용) */
export const DEFAULT_VOD_IDS = [25, 27, 34];

/**
 * 저장 직전 VOD 자동 보정 — 모달을 안 열고 저장해도 기본값이 들어가게 한다.
 *
 * 훅이 seminar-vod 목록을 폼 레벨에서 미리 fetch 하므로, 모달을 띄우지 않아도
 * 개수(vodCount)와 기본 VOD 데이터를 확보한다. 저장 직전 input 에 아래를 적용:
 *  - vods 가 3개가 아니면(0·1·2) 기본 VOD(25·27·34)로 채운다.
 *  - vodCount 는 전체 목록 길이로 맞춘다(랜딩 "VOD N종" 표기용).
 *
 * 목록이 아직 로드 전이면 보정 없이 그대로 둔다(진입 시 미리 받으므로 저장 시점엔 보통 로드됨).
 */
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
