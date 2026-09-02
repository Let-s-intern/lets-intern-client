import type { CSSProperties } from 'react';

/**
 * 프로필 노출 상태별 렌더 규칙 (PRD §5, mentor 앱과 동일 규칙).
 *
 * `profileVisible`은 **프로필 이미지 노출 여부만** 제어한다(닉네임 등 나머지는 항상 노출).
 * - `profileVisible === false` → 이미지 자리에 "{nickname} 멘토님의 멘토링" 문구.
 * - `profileVisible === true` + `mosaicEnabled` → 이미지에 `filter: blur(${mosaicBlur}px)`.
 */

export interface ProfileDisplayInput {
  nickname: string;
  profileVisible: boolean;
  mosaicEnabled: boolean;
  mosaicBlur: number;
}

/** 프로필 이미지를 끈 경우, 이미지 자리에 표시할 문구. */
export const imagePlaceholderTitle = (nickname: string): string =>
  `${nickname} 멘토님의 멘토링`;

/** 프로필 이미지를 노출할지 여부(끄면 이미지 대신 placeholder 문구). */
export const shouldShowImage = (
  profile: Pick<ProfileDisplayInput, 'profileVisible'>,
): boolean => profile.profileVisible;

/** 모자이크 블러 인라인 스타일(미적용이면 undefined). */
export const mosaicStyle = (
  profile: Pick<ProfileDisplayInput, 'mosaicEnabled' | 'mosaicBlur'>,
): CSSProperties | undefined =>
  profile.mosaicEnabled
    ? { filter: `blur(${profile.mosaicBlur}px)` }
    : undefined;
