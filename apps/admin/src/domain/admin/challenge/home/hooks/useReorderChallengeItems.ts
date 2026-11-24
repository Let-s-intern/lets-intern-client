import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import axios from '@/utils/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const REORDER_TARGETS = {
  notice: {
    path: 'notice',
    bodyKey: 'challengeNoticeIdList',
    listKey: 'challengeNoticeList',
  },
  guide: {
    path: 'guide',
    bodyKey: 'challengeGuideIdList',
    listKey: 'challengeGuideList',
  },
} as const;

type ReorderTarget = keyof typeof REORDER_TARGETS;

type ListQueryData = Record<string, unknown>;

/**
 * 공지, 가이드 순서를 저장한다. 놓은 순서를 목록 캐시에 먼저 반영하고(낙관적 갱신),
 * PUT 이 실패하면 캐시를 원래대로 돌리고 알림을 띄운다. 성공하면 목록을 다시 불러온다.
 */
export const useReorderChallengeItems = <T extends { id?: number }>({
  target,
  challengeId,
  queryKey,
}: {
  target: ReorderTarget;
  challengeId?: number;
  queryKey: readonly unknown[];
}) => {
  const queryClient = useQueryClient();
  const { snackbar } = useAdminSnackbar();
  const { path, bodyKey, listKey } = REORDER_TARGETS[target];

  return useMutation({
    mutationFn: (orderedItems: T[]) =>
      axios.put(`/admin/challenge/${challengeId}/${path}/order`, {
        [bodyKey]: orderedItems.map((item) => item.id),
      }),
    onMutate: async (orderedItems) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ListQueryData>(queryKey);
      queryClient.setQueryData<ListQueryData>(queryKey, (old) =>
        old ? { ...old, [listKey]: orderedItems } : old,
      );
      return { previous };
    },
    onError: (_error, _orderedItems, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      snackbar('순서 저장에 실패했습니다. 원래 순서로 되돌렸습니다.');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
