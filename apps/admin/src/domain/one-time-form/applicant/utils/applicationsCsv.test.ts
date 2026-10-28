import { describe, expect, it } from 'vitest';

import type { AdminOneTimeFormApplications } from '@/api/one-time-form/oneTimeFormSchema';
import dayjs from '@/lib/dayjs';
import {
  seedOneTimeFormApplications,
  seedOneTimeFormOptionGroups,
  seedOneTimeFormQuestions,
} from '@/mocks/seed/oneTimeForm';

import {
  getApplicationsCsvFileName,
  toApplicationsCsvRows,
  toCsvString,
} from './applicationsCsv';

/** 시드를 A8 응답 모양으로 만든다(삭제된 질문·그룹 포함, 신청일시 내림차순) */
const a8Of = (
  formId: number,
  form: AdminOneTimeFormApplications['form'],
): AdminOneTimeFormApplications => ({
  form,
  questions: seedOneTimeFormQuestions
    .filter((q) => q.formId === formId)
    .map(({ questionId, type, title, sortOrder, isDeleted }) => ({
      questionId,
      type,
      title,
      sortOrder,
      isDeleted,
    })),
  optionGroups: seedOneTimeFormOptionGroups
    .filter((g) => g.formId === formId)
    .map(({ optionGroupId, title, sortOrder, isDeleted }) => ({
      optionGroupId,
      title,
      sortOrder,
      isDeleted,
    })),
  applications: seedOneTimeFormApplications
    .filter((a) => a.formId === formId)
    .sort((a, b) => b.createDate.localeCompare(a.createDate))
    .map(({ formId: _formId, ...application }) => application),
});

const form7 = a8Of(7, {
  formId: 7,
  title: '현직자와 함께하는 포트폴리오 집중 클래스',
  slug: 'portfolio-1115',
  isPaid: true,
});

const form8 = a8Of(8, {
  formId: 8,
  title: '무료 세미나',
  slug: 'seminar-1130',
  isPaid: false,
});

const FORM7_HEADER = [
  '신청 ID',
  '신청일시',
  '상태',
  '이름',
  '이메일',
  '전화번호',
  '참여 방식을 골라 주세요',
  '함께 신청하면 좋아요',
  '결제 금액',
  '환불 금액',
  '취소일시',
  '유저 ID',
  '가입 이메일',
  '학교',
  '전공',
  '학년',
  '희망 직군',
  '희망 직무',
  '희망 산업',
  '유입 경로(가입 시)',
  '마케팅 동의',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'referrer',
  '이전 질문 (삭제됨)',
  '희망 직무',
  '현재 상태',
  '참여 가능한 요일',
  '관심 분야',
  '졸업(예정)일',
  '관련 경력',
  '포트폴리오 링크',
  '신청 동기',
  '프로필 사진',
  '이력서',
];

/** 머리 행 기준으로 한 신청 행을 읽는다 */
const rowById = (data: AdminOneTimeFormApplications, applicationId: number) => {
  const [header, ...rows] = toApplicationsCsvRows(data);
  const row = rows.find((r) => r[0] === String(applicationId));
  return { header, row };
};

/** 이름이 하나뿐인 열만 쓴다(`희망 직무` 는 계정 열과 질문 열 두 개다) */
const cellOf = ({ header, row }: ReturnType<typeof rowById>, name: string) =>
  row[header.indexOf(name)];

describe('toApplicationsCsvRows', () => {
  it('폼 7 머리 행은 신청 → 계정 정보 → 유입 → 질문 답변 순서다', () => {
    const [header] = toApplicationsCsvRows(form7);

    expect(header).toEqual(FORM7_HEADER);
  });

  it('삭제된 옵션 그룹은 머리에 (삭제됨) 을 붙이고 sortOrder, ID 순으로 둔다', () => {
    const [header] = toApplicationsCsvRows({
      ...form7,
      optionGroups: [
        {
          optionGroupId: 40,
          title: '나중 그룹',
          sortOrder: 1,
          isDeleted: false,
        },
        {
          optionGroupId: 33,
          title: '지운 그룹',
          sortOrder: 1,
          isDeleted: true,
        },
        {
          optionGroupId: 50,
          title: '처음 그룹',
          sortOrder: 0,
          isDeleted: false,
        },
      ],
    });

    expect(header.slice(6, 9)).toEqual([
      '처음 그룹',
      '지운 그룹 (삭제됨)',
      '나중 그룹',
    ]);
  });

  it('결제한 신청은 옵션, 금액, 계정, 유입, 답을 채운다', () => {
    const [, ...rows] = toApplicationsCsvRows(form7);
    const row1042 = rows.find((r) => r[0] === '1042');

    expect(row1042).toEqual([
      '1042',
      '2026-11-02 13:24',
      '신청 완료',
      '김렛커',
      'letscareer@example.com',
      '010-1234-5678',
      '온라인 라이브',
      '포트폴리오 1:1 첨삭',
      '49000',
      '0',
      '',
      '58231',
      'letscareer@example.com',
      '렛츠대학교',
      '경영학과',
      '4학년',
      '개발',
      '프론트엔드',
      'IT',
      '인스타그램',
      '동의',
      'instagram',
      'paid',
      'portfolio_1115',
      'story_a',
      '',
      'https://event-xxx.vercel.app/',
      '삭제 전 답',
      '프론트엔드',
      '',
      '월; 수',
      '',
      '',
      '',
      '',
      '',
      '',
      '김렛커_이력서_최종.pdf',
    ]);
  });

  it('취소한 신청도 행으로 남고 상태, 환불 금액, 취소일시를 채운다', () => {
    const csv = rowById(form7, 1043);

    expect(cellOf(csv, '상태')).toBe('취소');
    expect(cellOf(csv, '결제 금액')).toBe('39000');
    expect(cellOf(csv, '환불 금액')).toBe('39000');
    expect(cellOf(csv, '취소일시')).toBe('2026-11-03 14:02');
    expect(cellOf(csv, '마케팅 동의')).toBe('미동의');
    expect(cellOf(csv, '학교')).toBe('');
    expect(cellOf(csv, '관심 분야')).toBe('면접 준비');
    expect(cellOf(csv, '프로필 사진')).toBe('프로필.png');
    expect(cellOf(csv, '이력서')).toBe('박서현_이력서.pdf');
    expect(csv.row.join('|')).not.toContain('one-time-form/attachment');
  });

  it('무료 폼 신청은 결제·환불 금액이 빈 칸이다', () => {
    const csv = rowById(form8, 1044);

    expect(csv.header).toContain('세미나에서 듣고 싶은 내용');
    expect(cellOf(csv, '결제 금액')).toBe('');
    expect(cellOf(csv, '환불 금액')).toBe('');
    expect(cellOf(csv, '상태')).toBe('신청 완료');
    expect(cellOf(csv, '세미나에서 듣고 싶은 내용')).toBe(
      '포트폴리오 첨삭 사례가 궁금해요.',
    );
  });

  it('계정이 없으면 계정 정보 열이 모두 빈 칸이다', () => {
    const [header, row] = toApplicationsCsvRows({
      ...form7,
      applications: [{ ...form7.applications[1], user: null }],
    });

    const from = header.indexOf('유저 ID');
    expect(row.slice(from, from + 10)).toEqual(Array(10).fill(''));
  });

  it('숫자 답은 숫자 그대로 쓴다', () => {
    const [, row] = toApplicationsCsvRows({
      ...form7,
      applications: [{ ...form7.applications[1], answers: { '106': 12 } }],
    });

    expect(row[FORM7_HEADER.indexOf('관련 경력')]).toBe('12');
  });
});

describe('toCsvString', () => {
  it('UTF-8 BOM 으로 시작하고 행을 CRLF 로 잇는다', () => {
    const csv = toCsvString([
      ['a', 'b'],
      ['1', '2'],
    ]);

    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv).toBe('﻿a,b\r\n1,2');
  });

  it('= + - @ 로 시작하는 값 앞에 작은따옴표를 붙인다', () => {
    const csv = toCsvString([['=SUM(A1)', '+82', '-1', '@cmd', 'a=b', '']]);

    expect(csv).toBe("﻿'=SUM(A1),'+82,'-1,'@cmd,a=b,");
  });

  it('탭, CR 로 시작하는 값도 막는다', () => {
    expect(toCsvString([['\tx']])).toBe("﻿'\tx");
    expect(toCsvString([['\rx']])).toBe('﻿"\'\rx"');
  });

  it('쉼표, 줄바꿈, 큰따옴표가 있는 값은 따옴표로 감싸고 따옴표를 두 번 쓴다', () => {
    const csv = toCsvString([
      ['서울, 강남', '첫 줄\n둘째 줄', '그는 "안녕" 했다', 'a\r\nb'],
    ]);

    expect(csv).toBe(
      '﻿"서울, 강남","첫 줄\n둘째 줄","그는 ""안녕"" 했다","a\r\nb"',
    );
  });

  it('수식 방지와 따옴표 감싸기를 함께 적용한다', () => {
    expect(toCsvString([['=HYPERLINK("x","y")']])).toBe(
      '﻿"\'=HYPERLINK(""x"",""y"")"',
    );
  });

  it('머리와 답에도 적용한다', () => {
    const rows = toApplicationsCsvRows({
      ...form7,
      questions: [
        {
          questionId: 1,
          type: 'SHORT_TEXT',
          title: '=질문',
          sortOrder: 0,
          isDeleted: false,
        },
      ],
      applications: [
        { ...form7.applications[1], answers: { '1': '@답, "인용"' } },
      ],
    });
    const lines = toCsvString(rows).split('\r\n');

    expect(lines[0].endsWith(",'=질문")).toBe(true);
    expect(lines[1].endsWith(',"\'@답, ""인용"""')).toBe(true);
  });
});

describe('getApplicationsCsvFileName', () => {
  it('slug_신청자_YYYYMMDD.csv', () => {
    expect(
      getApplicationsCsvFileName(
        'portfolio-1115',
        dayjs('2026-11-05T09:00:00'),
      ),
    ).toBe('portfolio-1115_신청자_20261105.csv');
  });
});
