import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  useAdminMentorReviewListQuery,
  usePutAdminMentorReviewOrder,
} from '@/api/mentor/mentor';
import type { AdminMentorReview } from '@/api/mentor/mentorSchema';

import RankControl from '../../ui/RankControl';
import { moveToRank, swap } from '../../utils/reorder';
import MentorReviewExposureRow from './MentorReviewExposureRow';

const COLUMNS = [
  '순위',
  '종류',
  '프로그램',
  '점수',
  '후기 내용',
  '작성일',
  '노출',
  '관리',
];

const reviewKey = (review: Pick<AdminMentorReview, 'source' | 'sourceId'>) =>
  `${review.source}-${review.sourceId}`;

/** 서버 순서 그대로의 노출 후기 키. 서버는 정한 순위 → 최신순으로 내려준다 */
const exposedKeysOf = (reviews: AdminMentorReview[] | undefined) =>
  (reviews ?? []).filter((review) => review.isExposed).map(reviewKey);

interface Props {
  mentorId: number;
}

/**
 * 멘토 페이지 후기 노출·순서. 노출 후기만 순위가 있고, 숨긴 후기는 순위 없이 아래에 둔다.
 * 순서는 화면에서만 바뀌고 「순서 저장」 을 눌러야 저장된다(LC-3502).
 */
export default function MentorReviewExposureSection({ mentorId }: Props) {
  const { data, isLoading } = useAdminMentorReviewListQuery(mentorId);
  const { mutate: saveOrder, isPending: isSavingOrder } =
    usePutAdminMentorReviewOrder(mentorId);
  const reviews = data ?? [];

  const [order, setOrder] = useState<string[]>(() => exposedKeysOf(data));
  const [loadedData, setLoadedData] = useState(data);

  /*
    다시 불러오면 노출 후기 목록에 맞춘다. 노출을 바꿔 다시 불러와도 저장하지 않은 순서는
    지키고, 새로 노출된 후기는 뒤에 붙이고, 숨긴 후기는 뺀다.
  */
  if (data !== loadedData) {
    setLoadedData(data);
    const exposedKeys = exposedKeysOf(data);
    setOrder((prev) => [
      ...prev.filter((key) => exposedKeys.includes(key)),
      ...exposedKeys.filter((key) => !prev.includes(key)),
    ]);
  }

  const isOrderDirty = order.join() !== exposedKeysOf(data).join();

  useEffect(() => {
    if (!isOrderDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isOrderDirty]);

  const reviewByKey = new Map(
    reviews.map((review) => [reviewKey(review), review]),
  );
  const exposedReviews = order
    .map((key) => reviewByKey.get(key))
    .filter((review): review is AdminMentorReview => review !== undefined);
  const hiddenReviews = reviews.filter((review) => !review.isExposed);

  const handleSaveOrder = () => {
    saveOrder(
      {
        items: exposedReviews.map(({ source, sourceId }) => ({
          source,
          sourceId,
        })),
      },
      { onError: () => alert('후기 순서를 저장하지 못했습니다.') },
    );
  };

  return (
    <div className="border-neutral-80 rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-medium18 font-semibold">멘토 페이지 후기</h2>
          <p className="text-xsmall14 text-neutral-40 mt-1">
            이 순서가 웹 멘토 프로필과 1:1 상세의 「추천순」 에 그대로 나옵니다.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xsmall14 text-neutral-40">
            노출 {exposedReviews.length} / 전체 {reviews.length}
          </span>
          <Button
            variant="contained"
            size="small"
            disabled={!isOrderDirty || isSavingOrder}
            onClick={handleSaveOrder}
          >
            {isSavingOrder ? '저장 중...' : '순서 저장'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-xsmall14 text-neutral-40 py-4 text-center">
          불러오는 중...
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-xsmall14 text-neutral-40 py-4 text-center">
          이 멘토의 공개 후기가 없습니다
        </div>
      ) : (
        // 좁은 화면에서는 페이지가 아니라 이 영역만 가로로 스크롤한다
        <div className="max-h-[40rem] overflow-auto">
          <table className="text-xsmall14 w-full min-w-[60rem]">
            <thead>
              <tr className="text-neutral-30 text-left">
                {COLUMNS.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-3 py-2 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exposedReviews.map((review, index) => (
                <MentorReviewExposureRow
                  key={reviewKey(review)}
                  mentorId={mentorId}
                  review={review}
                  rankControl={
                    <RankControl
                      rank={index + 1}
                      total={exposedReviews.length}
                      onRankChange={(rank) =>
                        setOrder((prev) => moveToRank(prev, index, rank))
                      }
                      onMoveUp={() =>
                        setOrder((prev) => swap(prev, index, index - 1))
                      }
                      onMoveDown={() =>
                        setOrder((prev) => swap(prev, index, index + 1))
                      }
                    />
                  }
                />
              ))}
              {hiddenReviews.map((review) => (
                <MentorReviewExposureRow
                  key={reviewKey(review)}
                  mentorId={mentorId}
                  review={review}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
