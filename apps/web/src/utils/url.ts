/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ProgramType } from '@/types/common';
import { blogCategory } from './convert';

const SUPPORTED_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'sms:',
  'tel:',
]);

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);

    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank';
    }
  } catch {
    return url;
  }
  return url;
}

// Source: https://stackoverflow.com/a/8234912/2013580
const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);
export function validateUrl(url: string): boolean {
  // TODO Fix UI for link insertion; it should never default to an invalid URL such as https://.
  // Maybe show a dialog where they user can type the URL before inserting it.
  return url === 'https://' || urlRegExp.test(url);
}

export function getBlogSlug(title?: string | null): string {
  return (
    title?.replace(/[ /]/g, '-').replace(/[?#&]/g, '') || ''
  ).toLowerCase();
}

export function getBlogPathname({
  id,
  title,
}: {
  id?: string | number | null;
  title?: string | null;
}): string {
  return `/blog/${id}/${encodeURIComponent(getBlogSlug(title))}`;
}

export function getProgramPathname({
  programType,
  title,
  id,
}: {
  programType?: ProgramType | null;
  title?: string | null;
  id?: string | number | null;
}) {
  const slug = (title?.replace(/[ /]/g, '-') || '').toLowerCase();
  return `/program/${programType}/${id}/${encodeURIComponent(slug)}`;
}

export function getBlogTitle({
  title,
  category,
}: {
  title?: string | null;
  category?: string | null;
}) {
  return `${title} | ${blogCategory[category || '']} - 렛츠커리어`;
}

export function getChallengeTitle({ title }: { title?: string | null }) {
  return `${title} | 챌린지 - 렛츠커리어`;
}

export function getLiveTitle({ title }: { title?: string | null }) {
  return `${title} | LIVE 클래스 - 렛츠커리어`;
}

export function getGuidebookTitle({ title }: { title?: string | null }) {
  return `${title} | 가이드북 - 렛츠커리어`;
}

export function getVodTitle({ title }: { title?: string | null }) {
  return `${title} | VOD - 렛츠커리어`;
}

export function getReportLandingTitle(title: string) {
  return `${title} | 서류 진단 - 렛츠커리어`;
}

export function getBaseUrlFromServer(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
}

/**
 * 정규 사이트 URL (canonical / og:url / JSON-LD url 용도).
 * 우선순위: NEXT_PUBLIC_SITE_URL → BASE_URL → 'http://localhost:3000'.
 * trailing slash 는 항상 제거된 형태로 반환한다.
 */
export function getCanonicalSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    'http://localhost:3000';
  return raw.replace(/\/+$/, '');
}

/**
 * pathname 을 받아 정규 사이트 URL 과 결합한다.
 * pathname 이 비어 있으면 사이트 URL 을 그대로 반환.
 */
export function getCanonicalUrl(pathname: string = ''): string {
  if (!pathname) return getCanonicalSiteUrl();
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${getCanonicalSiteUrl()}${normalized}`;
}

/**
 * robots 메타 결정.
 * 운영(production) 외 환경 또는 NO_INDEX === 'true' 면 noindex 강제.
 */
export function getRobotsMetadata(): 'index, follow' | 'noindex, nofollow' {
  const profile = process.env.NEXT_PUBLIC_PROFILE;
  const noIndex = process.env.NO_INDEX;
  if (noIndex === 'true' || profile !== 'production') {
    return 'noindex, nofollow';
  }
  return 'index, follow';
}

export function getLibraryPathname({
  id,
  title,
}: {
  id?: string | number | null;
  title?: string | null;
}): string {
  const slug = (title?.replace(/[ /]/g, '-') || '').toLowerCase();
  return `/library/${id}/${encodeURIComponent(slug)}`;
}

export function getLibraryTitle({ title }: { title?: string | null }) {
  return `${title} | 무료 자료집 - 렛츠커리어`;
}

export function getUniversalBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return getBaseUrlFromServer();
}

export function getUniversalLink(pathname: string): string {
  return `${typeof window !== 'undefined' ? window.location.origin : getBaseUrlFromServer()}${pathname}`;
}
