import type { CompanyLogoFaviconCandidate } from '@/api/company-logo/companyLogoSchema';

/** 일괄 등록 표의 한 행 = 사이트 하나 */
export interface BulkRow {
  key: string;
  siteUrl: string;
  host: string;
  status:
    | 'loading'
    | 'ready'
    | 'fetchFailed'
    | 'saving'
    | 'saved'
    | 'saveFailed';
  error: string | null;
  candidates: CompanyLogoFaviconCandidate[];
  /** 올릴 후보. 기본은 가장 큰 후보(첫 번째) */
  candidateUrl: string;
  name: string;
  checked: boolean;
  /** 이미 올린 후보. 등록만 실패해 다시 저장할 때 같은 후보면 다시 올리지 않는다 */
  uploaded: { candidateUrl: string; imageUrl: string } | null;
}
