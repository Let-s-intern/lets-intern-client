import { AllInOnePassNotice, NoticeType } from '@/domain/all-in-one-pass/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { nextNoticeId, noticeStore } from './mock/noticeStore';
import { mockDelay } from './mock/passStore';

/* A-3 공지·가이드 목록/생성/수정/삭제 훅 */

type MutationCallbacks = {
  successCallback?: () => void;
  errorCallback?: (error: Error) => void;
};

/** 공지·가이드 입력값(유형·제목·내용) */
export type NoticeFormValues = Pick<
  AllInOnePassNotice,
  'type' | 'title' | 'content'
>;

export const allInOnePassNoticeListQueryKey = 'allInOnePassNoticeList';

/** 공지·가이드 목록 (최신 생성순). type 지정 시 해당 유형만. */
export const useGetAllInOnePassNoticeListQuery = (type?: NoticeType) =>
  useQuery({
    queryKey: [allInOnePassNoticeListQueryKey, type ?? 'ALL'],
    queryFn: () =>
      mockDelay(
        noticeStore.list
          .filter((n) => (type ? n.type === type : true))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      ),
  });

export const useCreateAllInOnePassNoticeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: (values: NoticeFormValues) => {
      const created: AllInOnePassNotice = {
        ...values,
        id: nextNoticeId(),
        createdAt: new Date().toISOString(),
        linkedPassIds: [], // 노출 영역은 별도 모달에서 설정
      };
      noticeStore.list.push(created);
      return mockDelay(created);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useUpdateAllInOnePassNoticeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: ({ id, values }: { id: number; values: NoticeFormValues }) => {
      const item = noticeStore.list.find((n) => n.id === id);
      if (!item) return Promise.reject(new Error('존재하지 않는 공지입니다.'));
      Object.assign(item, values);
      return mockDelay(item);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });

export const useDeleteAllInOnePassNoticeMutation = ({
  successCallback,
  errorCallback,
}: MutationCallbacks = {}) =>
  useMutation({
    mutationFn: (id: number) => {
      noticeStore.list = noticeStore.list.filter((n) => n.id !== id);
      return mockDelay(undefined);
    },
    onSuccess: successCallback,
    onError: errorCallback,
  });
