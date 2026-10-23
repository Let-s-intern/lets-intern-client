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

/** `POST /api/v1/admin/company-logo` 본문. PATCH 는 같은 키를 선택으로 받는다. 이름이 겹치면 409 */
export interface CompanyLogoReq {
  name: string;
  imageUrl: string;
}
