import {
  useGetNoticeChallenges,
  useUpdateNoticeChallengeMutation,
} from '@/api/challenge/noticeTemplate';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  noticeId: number;
  onClose: () => void;
}

const ExposureModal = ({ noticeId, onClose }: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const challengesQuery = useGetNoticeChallenges(noticeId);
  const updateMutation = useUpdateNoticeChallengeMutation();

  const challengeList = challengesQuery.data?.challengeList ?? [];
  const allIds = challengeList.map((c) => c.id);
  const isAllSelected =
    allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const isSomeSelected =
    !isAllSelected && allIds.some((id) => selectedIds.includes(id));

  useEffect(() => {
    if (!challengesQuery.data) return;
    setSelectedIds(
      challengesQuery.data.challengeList
        .filter((c) => c.isVisible)
        .map((c) => c.id),
    );
  }, [challengesQuery.data]);

  const selectAllRef = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = isSomeSelected;
    },
    [isSomeSelected],
  );

  const handleToggle = (id: number, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((v) => v !== id),
    );
  };

  const handleToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? [...allIds] : []);
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        noticeId,
        challengeIdList: selectedIds,
      });
      onClose();
    } catch {
      alert('노출 영역을 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-semibold">노출 영역 관리</h2>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="rounded bg-[#4F5BDB] px-5 py-2 text-sm font-medium text-white hover:opacity-80 disabled:bg-neutral-300"
            >
              저장
            </button>
            <button
              onClick={onClose}
              className="rounded bg-neutral-400 px-5 py-2 text-sm font-medium text-white hover:opacity-80"
            >
              취소
            </button>
          </div>
        </div>
        <div className="mx-3 flex-1 overflow-auto">
          {challengesQuery.isLoading ? (
            <LoadingContainer />
          ) : (
            <table className="min-w-full table-auto">
              <thead className="sticky top-0 bg-neutral-100">
                <tr className="border-y text-sm text-zinc-600">
                  <th className="w-25 px-4 py-3 text-center font-medium">
                    노출 여부
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    챌린지 제목
                  </th>
                  <th className="w-56 px-4 py-3 text-center font-medium">
                    챌린지 기간
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b text-sm">
                  <td className="px-4 py-3 text-center">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="h-4 w-4 accent-[#4F5BDB]"
                      checked={isAllSelected}
                      onChange={(e) => handleToggleAll(e.target.checked)}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium" colSpan={2}>
                    전체선택
                  </td>
                </tr>
                {challengeList.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b text-sm hover:bg-neutral-50"
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#4F5BDB]"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) =>
                          handleToggle(item.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-3">{item.title ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-zinc-500">
                      {item.startDate?.slice(0, 10) ?? '-'} ~{' '}
                      {item.endDate?.slice(0, 10) ?? '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExposureModal;
