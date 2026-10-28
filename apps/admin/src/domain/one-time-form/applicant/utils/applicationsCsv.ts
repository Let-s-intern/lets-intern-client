import type {
  AdminOneTimeFormApplication,
  AdminOneTimeFormApplications,
} from '@/api/one-time-form/oneTimeFormSchema';
import dayjs from '@/lib/dayjs';

/**
 * 신청자 CSV(PRD 6절, 계약 14.2). A8 응답 하나로 모든 열을 만든다.
 *
 * 열 순서: 신청(옵션 그룹마다 한 열) → 계정 정보 → 유입 → 질문 답변.
 * 삭제된 질문·옵션 그룹도 열로 남기고 머리에 ` (삭제됨)` 을 붙인다.
 */

type CellValue = string | number | null | undefined;

export interface ApplicationsCsvColumn {
  header: string;
  value: (application: AdminOneTimeFormApplication) => CellValue;
}

type User = NonNullable<AdminOneTimeFormApplication['user']>;

const MULTI_VALUE_SEPARATOR = '; ';

const formatDateTime = (value: string | null) =>
  value === null ? null : dayjs(value).format('YYYY-MM-DD HH:mm');

const withDeletedMark = (title: string, isDeleted: boolean) =>
  isDeleted ? `${title} (삭제됨)` : title;

/** 계정이 없으면(탈퇴) 계정 정보 열은 모두 빈 칸 */
const userColumn = (
  header: string,
  pick: (user: User) => CellValue,
): ApplicationsCsvColumn => ({
  header,
  value: ({ user }) => (user === null ? null : pick(user)),
});

const isAttachment = (value: unknown): value is { name: string } =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  typeof (value as { name?: unknown }).name === 'string';

/** 체크박스는 `; ` 로 잇고, 첨부는 원본 파일명만 쓴다(key·URL 은 쓰지 않는다) */
const toAnswerCell = (value: unknown): CellValue => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (Array.isArray(value)) return value.join(MULTI_VALUE_SEPARATOR);
  if (isAttachment(value)) return value.name;
  return JSON.stringify(value);
};

export const buildApplicationsCsvColumns = (
  data: AdminOneTimeFormApplications,
): ApplicationsCsvColumn[] => {
  const optionGroupColumns = [...data.optionGroups]
    .sort(
      (a, b) => a.sortOrder - b.sortOrder || a.optionGroupId - b.optionGroupId,
    )
    .map(
      (group): ApplicationsCsvColumn => ({
        header: withDeletedMark(group.title, group.isDeleted),
        value: ({ selectedOptions }) =>
          selectedOptions
            .filter((option) => option.optionGroupId === group.optionGroupId)
            .map((option) => option.optionName)
            .join(MULTI_VALUE_SEPARATOR),
      }),
    );

  const answerColumns = [...data.questions]
    .sort((a, b) => a.sortOrder - b.sortOrder || a.questionId - b.questionId)
    .map(
      (question): ApplicationsCsvColumn => ({
        header: withDeletedMark(question.title, question.isDeleted),
        value: ({ answers }) =>
          toAnswerCell(answers[String(question.questionId)]),
      }),
    );

  return [
    // 1. 신청
    { header: '신청 ID', value: (a) => a.applicationId },
    { header: '신청일시', value: (a) => formatDateTime(a.createDate) },
    { header: '상태', value: (a) => (a.isCanceled ? '취소' : '신청 완료') },
    { header: '이름', value: (a) => a.name },
    { header: '이메일', value: (a) => a.email },
    { header: '전화번호', value: (a) => a.phoneNum },
    ...optionGroupColumns,
    { header: '결제 금액', value: (a) => a.payment?.paidAmount },
    { header: '환불 금액', value: (a) => a.payment?.refundAmount },
    { header: '취소일시', value: (a) => formatDateTime(a.canceledAt) },
    // 2. 계정 정보
    userColumn('유저 ID', (u) => u.userId),
    userColumn('가입 이메일', (u) => u.email),
    userColumn('학교', (u) => u.university),
    userColumn('전공', (u) => u.major),
    userColumn('학년', (u) => u.grade),
    userColumn('희망 직군', (u) => u.wishField),
    userColumn('희망 직무', (u) => u.wishJob),
    userColumn('희망 산업', (u) => u.wishIndustry),
    userColumn('유입 경로(가입 시)', (u) => u.inflowPath),
    userColumn('마케팅 동의', (u) => (u.marketingAgree ? '동의' : '미동의')),
    // 3. 유입
    { header: 'utm_source', value: (a) => a.utmSource },
    { header: 'utm_medium', value: (a) => a.utmMedium },
    { header: 'utm_campaign', value: (a) => a.utmCampaign },
    { header: 'utm_content', value: (a) => a.utmContent },
    { header: 'utm_term', value: (a) => a.utmTerm },
    { header: 'referrer', value: (a) => a.referrer },
    // 4. 질문 답변
    ...answerColumns,
  ];
};

/** 머리 행과 신청 행. 취소한 신청도 행으로 남는다. 빈 값은 빈 문자열이다 */
export const toApplicationsCsvRows = (
  data: AdminOneTimeFormApplications,
): string[][] => {
  const columns = buildApplicationsCsvColumns(data);
  return [
    columns.map((column) => column.header),
    ...data.applications.map((application) =>
      columns.map((column) => {
        const value = column.value(application);
        return value === null || value === undefined ? '' : String(value);
      }),
    ),
  ];
};

/** `portfolio-1115_신청자_20261102.csv` */
export const getApplicationsCsvFileName = (slug: string, date = dayjs()) =>
  `${slug}_신청자_${date.format('YYYYMMDD')}.csv`;

const UTF8_BOM = '﻿';

/** 스프레드시트가 수식으로 읽는 시작 문자(CSV injection). 탭·CR 도 함께 막는다 */
const FORMULA_START = /^[=+\-@\t\r]/;
const NEEDS_QUOTING = /[",\r\n]/;

const escapeCell = (cell: string) => {
  const safe = FORMULA_START.test(cell) ? `'${cell}` : cell;
  return NEEDS_QUOTING.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

/** RFC 4180. 엑셀이 한글을 읽도록 UTF-8 BOM 을 앞에 붙인다 */
export const toCsvString = (rows: string[][]) =>
  UTF8_BOM + rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');
