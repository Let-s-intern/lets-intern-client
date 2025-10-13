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

export function getBlogPathname({
  id,
  title,
}: {
  id?: string | number | null;
  title?: string | null;
}): string {
  return `/blog/${id}/${encodeURIComponent(title?.replace(/[ /]/g, '-') || '')}`;
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
  return `/program/${programType}/${id}/${encodeURIComponent(title?.replace(/[ /]/g, '-') || '')}`;
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

export function getReportLandingTitle(title: string) {
  return `${title} | 서류 진단 - 렛츠커리어`;
}

export function getBaseUrlFromServer(): string {
  return process.env.BASE_URL || 'http://localhost:3000';
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
