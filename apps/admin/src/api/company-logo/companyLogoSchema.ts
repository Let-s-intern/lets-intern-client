import { z } from 'zod';

/** 회사 로고 라이브러리 1건 — `GET /api/v1/admin/company-logo` 의 `companyLogoList[]` */
export const companyLogoSchema = z.object({
  id: z.number(),
  name: z.string(),
  imageUrl: z.string(),
});

export type CompanyLogo = z.infer<typeof companyLogoSchema>;

/** `GET /api/v1/admin/company-logo` 응답. 이름 오름차순 */
export const companyLogoListSchema = z.object({
  companyLogoList: z.array(companyLogoSchema),
});

/**
 * 로고 후보 1건 — `POST /api/v1/admin/company-logo/favicon/candidates` 의 `candidates[]`.
 * 서버가 사이트에서 찾은 아이콘 주소다(아직 올리지 않음). 큰 것부터 온다.
 * format·source 는 화면 라벨에만 쓰므로, 서버가 값을 늘려도 깨지지 않게 문자열로 받는다.
 */
export const companyLogoFaviconCandidateSchema = z.object({
  url: z.string(),
  /** PNG · ICO · GIF · JPEG · WEBP */
  format: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  byteSize: z.number(),
  /** APPLE_TOUCH_ICON · ICON · DEFAULT_APPLE_TOUCH_ICON · FAVICON_ICO */
  source: z.string(),
});

export type CompanyLogoFaviconCandidate = z.infer<
  typeof companyLogoFaviconCandidateSchema
>;

export const companyLogoFaviconCandidatesSchema = z.object({
  candidates: z.array(companyLogoFaviconCandidateSchema),
  /** 사이트에서 읽은 이름. 등록 창의 회사명 기본값으로 쓴다. 못 읽었거나 서버 배포 전이면 없다 */
  siteName: z.string().nullish(),
});

/** `POST /api/v1/admin/company-logo/favicon` 응답. 고른 후보를 올린 주소. 로고 행은 만들지 않는다 */
export const companyLogoFaviconSchema = z.object({
  imageUrl: z.string(),
});

/** `POST /api/v1/admin/company-logo` 응답 */
export const companyLogoCreatedSchema = z.object({ id: z.number() });

/** `POST /api/v1/admin/company-logo` 본문. PATCH 는 같은 키를 선택으로 받는다. 이름이 겹치면 409 */
export interface CompanyLogoReq {
  name: string;
  imageUrl: string;
}
