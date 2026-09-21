import {
  RetrospectiveCommonQuestion,
  RetrospectiveRound,
} from '@/domain/all-in-one-pass/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  isEdit: boolean;
  initial: RetrospectiveRound | null;
  commonQuestions: RetrospectiveCommonQuestion[];
  onSubmit: (values: { round: number; weeklyQuestion: string }) => void;
  onClose: () => void;
}

/** A-4 회차 추가/수정 모달 (회차 번호 + 주차별 질문 + 공통 질문 읽기전용) */
export default function RetrospectiveRoundModal({
  open,
  isEdit,
  initial,
  commonQuestions,
  onSubmit,
  onClose,
}: Props) {
  const [round, setRound] = useState('');
  const [weeklyQuestion, setWeeklyQuestion] = useState('');

  useEffect(() => {
    if (!open) return;
    setRound(initial ? String(initial.round) : '');
    setWeeklyQuestion(initial?.weeklyQuestion ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const roundNum = Number(round);
  const isValidRound =
    round.trim() !== '' && Number.isInteger(roundNum) && roundNum >= 1;
  const canSave = weeklyQuestion.trim() !== '' && isValidRound;

  const handleSubmit = () => {
    if (!canSave) return;
    onSubmit({ round: roundNum, weeklyQuestion: weeklyQuestion.trim() });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? `${round}회차 수정` : '회차 추가'}</DialogTitle>
      <DialogContent dividers className="flex flex-col gap-4">
        {/* 수정 시 회차 번호는 고정(제목에 표시). 생성 시에만 입력 */}
        {!isEdit && (
          <TextField
            label="회차"
            type="number"
            value={round}
            onChange={(e) => setRound(e.target.value)}
            size="small"
            className="w-40"
          />
        )}

        {/* 공통 질문 (읽기전용, 모든 회차에 자동 포함) */}
        <div className="flex flex-col gap-2">
          <span className="text-xsmall14 text-neutral-30 font-medium">
            공통 질문 (모든 회차 공통)
          </span>
          <div className="border-neutral-80 bg-neutral-95 flex flex-col gap-1 rounded-md border p-3">
            {commonQuestions.length === 0 ? (
              <span className="text-xsmall14 text-neutral-40">
                등록된 공통 질문이 없습니다.
              </span>
            ) : (
              commonQuestions.map((q, i) => (
                <span key={q.id} className="text-xsmall14 text-neutral-30">
                  Q{i + 1}. {q.question}
                </span>
              ))
            )}
          </div>
        </div>

        <TextField
          label="주차별 질문"
          placeholder="주차별 질문을 작성해주세요."
          value={weeklyQuestion}
          onChange={(e) => setWeeklyQuestion(e.target.value)}
          size="small"
          fullWidth
          multiline
          minRows={2}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          취소하기
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!canSave}>
          저장하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}
