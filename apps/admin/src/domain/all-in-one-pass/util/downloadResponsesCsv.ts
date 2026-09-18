import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';

interface QuestionColumn {
  questionId: number;
  label: string;
}

const escapeCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export const downloadResponsesCsv = (
  responses: RetrospectiveResponse[],
  questions: QuestionColumn[],
  roundNumber?: number,
) => {
  const labelOf = (qid: number) =>
    responses.flatMap((r) => r.answers).find((a) => a.questionId === qid)
      ?.questionLabel ?? '';

  const header = [
    '제출자',
    '올인원 패스',
    '제출일',
    ...questions.map((q) => `${q.label}: ${labelOf(q.questionId)}`),
  ];
  const lines = responses.map((r) => {
    const byId = new Map(r.answers.map((a) => [a.questionId, a.answer]));
    return [
      r.submitterName,
      r.passName,
      dayjs(r.submittedAt).format('YYYY-MM-DD'),
      ...questions.map((q) => byId.get(q.questionId) ?? ''),
    ];
  });

  const csv = [header, ...lines]
    .map((row) => row.map((cell) => escapeCell(String(cell))).join(','))
    .join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `회고응답_${roundNumber ?? ''}회차.csv`;
  a.click();
  URL.revokeObjectURL(url);
};
