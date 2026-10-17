import { useGetRetrospectiveRoundsQuery } from '@/api/all-in-one-pass/useRetrospectives';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { RetrospectiveRound } from '@/domain/all-in-one-pass/types';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  passId: number;
}

// 답변 가이드 입력칸은 질문보다 약하게(작은 글씨·회색)
const guideFieldSx = {
  '& .MuiInputBase-input': { fontSize: 13, color: '#4c4f56' },
};

/** A-4 회차별 질문·답변 가이드 수정 (회차는 BE 자동 생성) */
export default function RoundListSection({ passId }: Props) {
  const navigate = useNavigate();
  const {
    data: rounds = [],
    isLoading,
    error,
  } = useGetRetrospectiveRoundsQuery(passId);

  const [rows, setRows] = useState<RetrospectiveRound[]>([]);
  useEffect(() => {
    setRows(rounds);
  }, [rounds]);

  const update = (id: number, partial: Partial<RetrospectiveRound>) =>
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...partial } : r)),
    );

  const handleSave = () => {
    // TODO: API 연결 후 회차 질문·답변 가이드 저장(PATCH) 뮤테이션 연결
    // eslint-disable-next-line no-console
    console.log('[회고 회차 저장]', passId, rows);
  };

  // 마지막 회차 = 마무리 회고
  const finalRound = rows.length ? Math.max(...rows.map((r) => r.round)) : null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-small20 text-neutral-0 font-semibold">
          회차별 질문
        </h2>
        <p className="text-xsmall14 text-neutral-40">
          회차 수는 패스 기간에 따라 자동 생성됩니다. 질문 · 답변 가이드는 수정
          가능합니다.
        </p>
      </div>

      {isLoading ? (
        <LoadingContainer />
      ) : error ? (
        <div className="py-4 text-center">에러 발생</div>
      ) : rows.length === 0 ? (
        <EmptyContainer text="회차가 없습니다. (패스 기간을 확인해주세요)" />
      ) : (
        <>
          <Table size="small" sx={{ '& td, & th': { verticalAlign: 'top' } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 100 }}>회차</TableCell>
                <TableCell sx={{ width: 136 }}>노출 시점</TableCell>
                <TableCell>질문 · 답변 가이드</TableCell>
                <TableCell sx={{ width: 80 }} align="right">
                  응답 수
                </TableCell>
                <TableCell sx={{ width: 120 }} align="center">
                  응답 조회
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                const isFinal = row.round === finalRound;
                return (
                  <TableRow key={row.id}>
                    <TableCell sx={{ pt: 2.5 }}>
                      <span
                        className={`text-xsmall14 ${
                          isFinal ? 'text-primary' : 'text-neutral-0'
                        }`}
                      >
                        {isFinal ? '마무리 회고' : `${row.round}회차`}
                      </span>
                    </TableCell>

                    <TableCell
                      sx={{ pt: 2.5 }}
                      className="text-xsmall14 text-neutral-40"
                    >
                      {isFinal
                        ? '패스 종료 시점'
                        : `패스 시작일 + ${row.round * 2}주`}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <TextField
                          value={row.weeklyQuestion}
                          onChange={(e) =>
                            update(row.id, { weeklyQuestion: e.target.value })
                          }
                          placeholder="회차 질문을 입력하세요."
                          size="small"
                          fullWidth
                          multiline
                        />
                        <TextField
                          value={row.answerGuide}
                          onChange={(e) =>
                            update(row.id, { answerGuide: e.target.value })
                          }
                          placeholder="답변 가이드를 입력하세요."
                          size="small"
                          fullWidth
                          sx={guideFieldSx}
                        />
                      </div>
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{ pt: 2.5 }}
                      className="text-xsmall14 text-neutral-0"
                    >
                      {row.responseCount}
                    </TableCell>

                    <TableCell align="center" sx={{ pt: 2 }}>
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/all-in-one-pass/retrospectives/${row.id}/responses?passId=${passId}`,
                          )
                        }
                      >
                        응답 조회
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-end">
            <Button variant="contained" onClick={handleSave}>
              저장하기
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
