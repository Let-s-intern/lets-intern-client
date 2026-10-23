import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

import {
  useAdminUserMentorListQuery,
  usePutAdminMentorPickMutation,
} from '@/api/mentor/mentor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { twMerge } from '@/lib/twMerge';

import RankControl from '../../ui/RankControl';
import { moveToRank, swap } from '../../utils/reorder';
import type { PickMentor } from './MentorPickAddDialog';

const LEAVE_MESSAGE = '저장하지 않은 변경 사항이 있습니다. 닫을까요?';

const toIds = (mentors: PickMentor[]) =>
  mentors.map((mentor) => mentor.mentorId).join(',');

interface Props {
  /** 지금 보고 있는 멘토. 강조하고, 픽이 아니면 맨 뒤에 넣을 수 있게 한다 */
  mentorId: number;
  /** 열 때의 픽 목록(순서대로). 열려 있는 동안은 이 값으로 시작한 화면 상태만 바꾼다 */
  initialPicks: PickMentor[];
  onClose: () => void;
}

/**
 * 멘토 상세에서 렛커 픽 순위를 바로 고치는 창. 렛커 픽 화면과 같은 전체 교체 저장(PUT)을 쓴다.
 * 열 때마다 새로 마운트한다.
 */
export default function MentorPickRankDialog({
  mentorId,
  initialPicks,
  onClose,
}: Props) {
  const { snackbar } = useAdminSnackbar();
  const { data: mentorList } = useAdminUserMentorListQuery();
  const { mutate: savePicks, isPending: isSaving } =
    usePutAdminMentorPickMutation();

  const [picks, setPicks] = useState<PickMentor[]>(initialPicks);
  const currentRowRef = useRef<HTMLTableRowElement>(null);

  const isDirty = toIds(picks) !== toIds(initialPicks);
  const isPicked = picks.some((pick) => pick.mentorId === mentorId);

  // 열리면 이 멘토 행이 보이게 한다
  useEffect(() => {
    currentRowRef.current?.scrollIntoView?.({ block: 'center' });
  }, []);

  const handleClose = () => {
    if (isDirty && !window.confirm(LEAVE_MESSAGE)) return;
    onClose();
  };

  const handleAddCurrent = () => {
    const mentor = mentorList?.mentorList.find((item) => item.id === mentorId);
    setPicks((prev) => [
      ...prev,
      {
        mentorId,
        name: mentor?.name ?? `멘토 #${mentorId}`,
        nickname: mentor?.nickname ?? null,
        isVisible: mentor?.isVisible ?? null,
      },
    ]);
  };

  const handleSave = () => {
    savePicks(
      { mentorIds: picks.map((pick) => pick.mentorId) },
      {
        onSuccess: () => {
          snackbar('렛커 픽 순서를 저장했습니다.');
          onClose();
        },
        onError: () => snackbar('렛커 픽 저장에 실패했습니다.'),
      },
    );
  };

  return (
    <Dialog open onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-base font-semibold">
        렛커 픽 순위 수정
      </DialogTitle>
      <DialogContent>
        {!isPicked ? (
          <Button
            variant="outlined"
            className="mb-3"
            onClick={handleAddCurrent}
          >
            이 멘토를 렛커 픽에 추가
          </Button>
        ) : null}
        {picks.length === 0 ? (
          <p className="text-xsmall14 text-neutral-40 py-8 text-center">
            렛커 픽 멘토가 없습니다.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead className="border-neutral-80 border-b">
              <tr className="text-neutral-40 text-left text-xs">
                <th className="px-3 py-2 font-medium">순위</th>
                <th className="px-3 py-2 font-medium">멘토</th>
                <th className="px-3 py-2 font-medium">닉네임</th>
                <th className="px-3 py-2 font-medium">공개</th>
                <th className="px-3 py-2 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {picks.map((pick, index) => {
                const isCurrent = pick.mentorId === mentorId;
                return (
                  <tr
                    key={pick.mentorId}
                    ref={isCurrent ? currentRowRef : undefined}
                    aria-current={isCurrent ? 'true' : undefined}
                    className={twMerge(
                      'border-neutral-90 border-b text-sm last:border-b-0',
                      isCurrent && 'bg-primary-10',
                    )}
                  >
                    <td className="px-3 py-2">
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
                    <td className="px-3 py-2">
                      {pick.name}
                      {isCurrent ? (
                        <span className="text-primary ml-2 text-xs font-semibold">
                          이 멘토
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{pick.nickname ?? '-'}</td>
                    <td className="px-3 py-2">
                      {pick.isVisible === false ? (
                        <span className="rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                          비노출
                        </span>
                      ) : (
                        '공개'
                      )}
                    </td>
                    <td className="px-3 py-2">
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
                );
              })}
            </tbody>
          </table>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          취소
        </Button>
        <Button
          variant="contained"
          disabled={!isDirty || isSaving}
          onClick={handleSave}
        >
          {isSaving ? '저장 중...' : '순서 저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
