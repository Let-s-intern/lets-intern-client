import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  useAdminMentorPickListQuery,
  usePutAdminMentorPickMutation,
} from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import RankControl from '../ui/RankControl';
import { moveToRank, swap } from '../utils/reorder';
import MentorPickAddDialog, { type PickMentor } from './ui/MentorPickAddDialog';

const headerCellClass =
  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-neutral-40';
const bodyCellClass = 'px-4 py-3 text-sm text-neutral-10 align-middle';

const toIds = (mentors: PickMentor[]) =>
  mentors.map((mentor) => mentor.mentorId).join(',');

/**
 * 렛커 픽. 이 순서대로 웹 멘토 목록(/mentors)과 1:1 라이브 멘토링 목록 맨 위에 나간다.
 * 순위·추가·빼기는 화면에서만 바뀌고 「순서 저장」 을 눌러야 서버에 전체 교체로 저장된다.
 */
export default function MentorPickManager() {
  const { snackbar } = useAdminSnackbar();
  const { data, isLoading, isError } = useAdminMentorPickListQuery();
  const { mutate: savePicks, isPending: isSaving } =
    usePutAdminMentorPickMutation();

  const [picks, setPicks] = useState<PickMentor[]>(data ?? []);
  const [loadedData, setLoadedData] = useState(data);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // 불러오거나 저장 뒤 다시 불러오면 서버 순서로 맞춘다
  if (data !== loadedData) {
    setLoadedData(data);
    setPicks(data ?? []);
  }

  const isDirty = toIds(picks) !== toIds(data ?? []);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = () => {
    savePicks(
      { mentorIds: picks.map((pick) => pick.mentorId) },
      {
        onSuccess: () => snackbar('렛커 픽 순서를 저장했습니다.'),
        onError: (error) =>
          snackbar(
            (error as { message?: string }).message ??
              '렛커 픽 저장에 실패했습니다.',
          ),
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">렛커 픽</h2>
          <p className="text-xsmall14 text-neutral-40 mt-1">
            이 순서대로 웹 멘토 목록(/mentors)과 1:1 라이브 멘토링 목록 맨 위에
            노출됩니다. 「순서 저장」 을 눌러야 반영됩니다.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => setIsAddDialogOpen(true)}>
            멘토 추가
          </Button>
          <Button
            variant="contained"
            disabled={!isDirty || isSaving}
            onClick={handleSave}
          >
            {isSaving ? '저장 중...' : '순서 저장'}
          </Button>
        </div>
      </div>

      <div className="border-neutral-80 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[720px] border-collapse">
          <thead className="border-neutral-80 bg-neutral-95 border-b">
            <tr>
              <th className={headerCellClass}>순위</th>
              <th className={headerCellClass}>멘토</th>
              <th className={headerCellClass}>닉네임</th>
              <th className={headerCellClass}>공개</th>
              <th className={headerCellClass}>관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading || isError || picks.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-xsmall14 text-neutral-40 py-16 text-center"
                >
                  {isLoading
                    ? '불러오는 중...'
                    : isError
                      ? '목록을 불러오지 못했습니다.'
                      : '렛커 픽 멘토가 없습니다. 멘토 추가를 눌러 넣어 주세요.'}
                </td>
              </tr>
            ) : (
              picks.map((pick, index) => (
                <tr
                  key={pick.mentorId}
                  className="border-neutral-90 border-b last:border-b-0"
                >
                  <td className={bodyCellClass}>
                    <RankControl
                      rank={index + 1}
                      total={picks.length}
                      onRankChange={(rank) =>
                        setPicks((prev) => moveToRank(prev, index, rank))
                      }
                      onMoveUp={() =>
                        setPicks((prev) => swap(prev, index, index - 1))
                      }
                      onMoveDown={() =>
                        setPicks((prev) => swap(prev, index, index + 1))
                      }
                    />
                  </td>
                  <td className={bodyCellClass}>{pick.name}</td>
                  <td className={bodyCellClass}>{pick.nickname ?? '-'}</td>
                  <td className={bodyCellClass}>
                    {pick.isVisible === false ? (
                      <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                        비노출
                      </span>
                    ) : (
                      '공개'
                    )}
                  </td>
                  <td className={bodyCellClass}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      onClick={() =>
                        setPicks((prev) =>
                          prev.filter(
                            (mentor) => mentor.mentorId !== pick.mentorId,
                          ),
                        )
                      }
                    >
                      빼기
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAddDialogOpen ? (
        <MentorPickAddDialog
          pickedMentorIds={picks.map((pick) => pick.mentorId)}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={(mentors) => {
            setPicks((prev) => [...prev, ...mentors]);
            setIsAddDialogOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}
