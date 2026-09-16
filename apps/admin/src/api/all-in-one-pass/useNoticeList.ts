import { NoticeType } from '@/domain/all-in-one-pass/types';
import { useQuery } from '@tanstack/react-query';
import { mockDelay } from './mock/passStore';
import { noticeStore } from './mock/noticeStore';

/**
 * A-3 공지·가이드 목록 훅.
 *
 * 페이지는 이 파일만 import 한다. 현재는 mock 스토어(./mock/noticeStore)를
 * 읽으며, 백엔드 스펙이 나오면 queryFn 본문만 axios 호출로 교체하면 된다.
 */

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
