import type { AdminBlogReview } from '@/api/review/review';
import type { PaymentMethodKey } from '@/data/getPaymentSearchParams';
import dayjs from '@/lib/dayjs';
import { bankTypeToText } from '@/utils/convert';

/**
 * 블로그 후기 CSV·인쇄 공통 컬럼 정의.
 * 화면 DataGrid 컬럼과 동일 순서·포맷(액션 제외). CSV/인쇄가 같은 소스를 쓰도록 한 곳에서 관리.
 */
export const BLOG_REVIEW_EXPORT_COLUMNS: {
  header: string;
  value: (review: AdminBlogReview) => string;
}[] = [
  {
    header: '추가일자',
    value: (r) =>
      r.postDate && !Number.isNaN(r.postDate.getTime())
        ? dayjs(r.postDate).format('YYYY-MM-DD HH:mm:ss')
        : '',
  },
  { header: '프로그램 구분', value: (r) => r.programType ?? '' },
  { header: '프로그램 명', value: (r) => r.programTitle ?? '' },
  { header: '이름', value: (r) => r.name ?? '' },
  { header: '연락처', value: (r) => r.phoneNum ?? '' },
  {
    header: '은행명',
    value: (r) =>
      r.accountType
        ? (bankTypeToText[r.accountType as PaymentMethodKey] ?? r.accountType)
        : '',
  },
  { header: '계좌번호', value: (r) => r.accountNum ?? '' },
  { header: '제목', value: (r) => r.title ?? '' },
  { header: '설명', value: (r) => r.description ?? '' },
  { header: 'URL', value: (r) => r.url ?? '' },
  { header: '운영진확인', value: (r) => (r.isConfirmed ? 'O' : 'X') },
  { header: '송금확인', value: (r) => (r.isRemittanceConfirmed ? 'O' : 'X') },
  { header: '노출여부', value: (r) => (r.isVisible ? 'O' : 'X') },
];

/** CSV 셀 이스케이프 — 쉼표·큰따옴표·개행 포함 시 큰따옴표로 감싸고 내부 따옴표 이스케이프. */
const escapeCsvValue = (value: string): string => {
  if (!/[",\n]/.test(value)) return value;
  return `"${value.replace(/"/g, '""')}"`;
};

export function buildBlogReviewCsv(reviews: AdminBlogReview[]): string {
  const header = BLOG_REVIEW_EXPORT_COLUMNS.map((c) =>
    escapeCsvValue(c.header),
  ).join(',');
  const body = reviews.map((review) =>
    BLOG_REVIEW_EXPORT_COLUMNS.map((c) => escapeCsvValue(c.value(review))).join(
      ',',
    ),
  );
  return [header, ...body].join('\n');
}

/** BOM 포함 CSV Blob 다운로드 (엑셀 한글 깨짐 방지). */
export function downloadBlogReviewCsv(reviews: AdminBlogReview[]): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + buildBlogReviewCsv(reviews)], {
    type: 'text/csv',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `blog-review-${dayjs().format('YYYYMMDD-HHmmss')}.csv`;
  // Firefox 등에서 DOM 미부착 <a> 의 click() 이 무시될 수 있어 body 에 붙였다 제거
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
