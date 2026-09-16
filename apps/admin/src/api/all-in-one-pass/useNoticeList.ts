import { AllInOnePassNotice, NoticeType } from '@/domain/all-in-one-pass/types';
import { useQuery } from '@tanstack/react-query';
import { noticeFixtures } from './mock/noticeFixtures';
import { mockDelay } from './mock/passStore';

/**
 * A-3 공지·가이드 목록 훅 (읽기 전용).
 *
 * 저장(생성/수정/삭제)은 API 연결 후 붙인다. 현재는 mock 시드
 * (./mock/noticeFixtures)를 읽으며, 스펙이 나오면 queryFn 본문만 교체한다.
 */

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
        noticeFixtures
          .filter((n) => (type ? n.type === type : true))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      ),
  });
