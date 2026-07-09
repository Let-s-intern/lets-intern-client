import type { CSSProperties } from 'react';

import type { ChecklistItem } from '@/api/live-mentoring/liveMentoringSchema';

/**
 * 프로필 노출 상태별 렌더 규칙 (PRD §5, mentor 앱과 동일 규칙).
 *
 * - `profileVisible === false` → 이미지·실명을 감추고 "{nickname}의 1대1 라이브 멘토링" 익명 타이틀.
 * - `mosaicEnabled` → 이미지에 `filter: blur(${mosaicBlur}px)` (닉네임은 노출).
 */

export interface ProfileDisplayInput {
  nickname: string;
  profileVisible: boolean;
  mosaicEnabled: boolean;
  mosaicBlur: number;
}

/** 프로필 비노출 시 이미지 대신 노출할 익명 타이틀. */
export const anonymousTitle = (nickname: string): string =>
  `${nickname}의 1대1 라이브 멘토링`;

/** 카드/상세에서 노출할 대표 타이틀(닉네임 또는 익명 타이틀). */
export const displayTitle = (profile: ProfileDisplayInput): string =>
  profile.profileVisible ? profile.nickname : anonymousTitle(profile.nickname);

/** 프로필 이미지를 노출할지 여부(비노출이면 이미지 자리에 익명 타이틀). */
export const shouldShowImage = (profile: ProfileDisplayInput): boolean =>
  profile.profileVisible;

/** 모자이크 블러 인라인 스타일(미적용이면 undefined). */
export const mosaicStyle = (
  profile: Pick<ProfileDisplayInput, 'mosaicEnabled' | 'mosaicBlur'>,
): CSSProperties | undefined =>
  profile.mosaicEnabled
    ? { filter: `blur(${profile.mosaicBlur}px)` }
    : undefined;

/**
 * 공개 화면에 노출할 체크리스트 항목만 필터링 (PRD §6, mentor 앱과 동일 규칙).
 * `HIDDEN` 제외, `CUSTOM` + customText 면 customText, 아니면 label.
 */
export const visibleChecklist = (
  checklist: ChecklistItem[],
): { id: number; text: string }[] =>
  checklist
    .filter((item) => item.mode !== 'HIDDEN')
    .map((item) => ({
      id: item.id,
      text:
        item.mode === 'CUSTOM' && item.customText
          ? item.customText
          : item.label,
    }));
