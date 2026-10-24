import { RetrospectiveResponse } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';

export interface QuestionTab {
  questionId: number;
  label: string;
}

export const buildResponseTabs = (
  responses: RetrospectiveResponse[],
  roundId?: number,
): QuestionTab[] => {
  const ids: number[] = [];
  responses.forEach((r) =>
    r.answers.forEach((a) => {
      if (!ids.includes(a.questionId)) ids.push(a.questionId);
    }),
  );
  const tabs = ids
    .filter((id) => id !== roundId)
    .map((id, i) => ({ questionId: id, label: `공통 질문 ${i + 1}` }));
  if (roundId != null && ids.includes(roundId))
    tabs.push({ questionId: roundId, label: '회차별 질문' });
  return tabs;
};

export interface AnswerView {
  submitterName: string;
  submittedAt: string;
  answer: string;
}

interface Options {
  activeId: number | null;
  hasComment: (responseId: number) => boolean;
  onOpenComment: (response: RetrospectiveResponse) => void;
  onViewAnswer: (view: AnswerView) => void;
}

export const getResponseColumns = ({
  activeId,
  hasComment,
  onOpenComment,
  onViewAnswer,
}: Options): GridColDef<RetrospectiveResponse>[] => [
  { field: 'submitterName', headerName: '제출자', width: 140 },
  {
    field: 'submittedAt',
    headerName: '제출일',
    width: 170,
    renderCell: ({ row }) =>
      row.submitted ? (
        dayjs(row.submittedAt).format('YYYY.MM.DD HH:mm')
      ) : (
        <span className="text-neutral-40">제출 안 함</span>
      ),
  },
  {
    field: 'answer',
    headerName: '답변',
    flex: 1,
    minWidth: 280,
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => {
      const text = row.answers.find((a) => a.questionId === activeId)?.answer;
      return (
        <div className="flex h-full w-full min-w-0 items-center gap-3">
          <span
            className={`min-w-0 flex-1 truncate ${
              text ? 'text-neutral-10' : 'text-neutral-40'
            }`}
          >
            {text || '-'}
          </span>
          {text && text.length > 40 && (
            <button
              type="button"
              className="text-primary text-xsmall14 shrink-0 hover:underline"
              onClick={() =>
                onViewAnswer({
                  submitterName: row.submitterName,
                  submittedAt: row.submittedAt,
                  answer: text,
                })
              }
            >
              더보기
            </button>
          )}
        </div>
      );
    },
  },
  {
    field: 'commentExists',
    headerName: '코멘트 여부',
    width: 100,
    align: 'center',
    headerAlign: 'center',
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => {
      const has = hasComment(row.id);
      return (
        <span
          className={has ? 'text-primary font-semibold' : 'text-neutral-40'}
        >
          {has ? 'O' : 'X'}
        </span>
      );
    },
  },
  {
    field: 'commentAction',
    headerName: '코멘트 등록',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    sortable: false,
    filterable: false,
    renderCell: ({ row }) => {
      const has = hasComment(row.id);
      return (
        <div className="flex h-full items-center justify-center">
          <Button
            variant="outlined"
            color={has ? 'info' : 'primary'}
            size="small"
            disabled={!row.submitted}
            onClick={() => onOpenComment(row)}
          >
            {has ? '조회' : '등록'}
          </Button>
        </div>
      );
    },
  },
];
