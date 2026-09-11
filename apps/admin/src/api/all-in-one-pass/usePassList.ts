import { useMutation, useQuery } from '@tanstack/react-query';

import { AllInOnePassListItem } from '@/domain/all-in-one-pass/types';
import { mockDelay, nextPassId, passStore } from './mock/passStore';

/**
 * 올인원패스 목록/노출/삭제/복제 훅.
 *
 * 페이지는 이 파일만 import 한다(프로그램의 api/program.ts 와 같은 역할).
 * 현재는 mock 스토어(./mock)를 읽고 쓰며, 백엔드 스펙이 나오면 각 queryFn/
 * mutationFn 본문만 axios 호출로 교체하고 ./mock 폴더를 삭제하면 된다.
 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

export const allInOnePassListQueryKey = 'allInOnePassList';

/** 개설 목록 (최신 개설순) */
export const useGetAllInOnePassListQuery = () =>
  useQuery({
    queryKey: [allInOnePassListQueryKey],
    queryFn: () =>
      mockDelay(
        [...passStore.list].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        ),
      ),
  });

/**
 * 노출 여부 토글. 단일 노출 규칙: 이미 노출 중인 다른 패스가 있으면 켤 수 없다.
 * (실서버도 동일하게 강제해야 하며, 화면의 사전 체크는 UX 보조용)
 */
export const usePatchAllInOnePassVisibleMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: ({ id, isVisible }: { id: number; isVisible: boolean }) => {
      const item = passStore.list.find((p) => p.id === id);
      if (!item) return Promise.reject(new Error('존재하지 않는 패스입니다.'));
      if (isVisible && passStore.list.some((p) => p.id !== id && p.isVisible)) {
        return Promise.reject(new Error('노출 중인 올인원패스가 존재합니다.'));
      }
      item.isVisible = isVisible;
      return mockDelay(item);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useDeleteAllInOnePassMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: (id: number) => {
      passStore.list = passStore.list.filter((p) => p.id !== id);
      return mockDelay(undefined);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useDuplicateAllInOnePassMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: (id: number) => {
      const src = passStore.list.find((p) => p.id === id);
      if (!src) return Promise.reject(new Error('존재하지 않는 패스입니다.'));
      const copy: AllInOnePassListItem = {
        ...src,
        id: nextPassId(),
        title: `${src.title} (복제)`,
        isVisible: false, // 복제본은 비노출로 생성 (단일 노출 규칙)
        currentApplicantCount: 0,
        createdAt: new Date().toISOString(),
      };
      passStore.list.push(copy);
      return mockDelay(copy);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
