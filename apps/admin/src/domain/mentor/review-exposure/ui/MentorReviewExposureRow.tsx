import { Button, Switch } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

import { usePatchAdminMentorReviewExposure } from '@/api/mentor/mentor';
import type { AdminMentorReview } from '@/api/mentor/mentorSchema';
import { MENTOR_REVIEW_TYPE_LABEL } from '../constants/mentorReviewTypeLabel';
import MentorReviewEditDialog from './MentorReviewEditDialog';

interface Props {
  mentorId: number;
  review: AdminMentorReview;
}

export default function MentorReviewExposureRow({ mentorId, review }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  // 행마다 뮤테이션을 따로 두어 바꾸는 중인 행의 스위치만 막는다
  const patchExposure = usePatchAdminMentorReviewExposure(mentorId);

  // 요청 중에는 바꾼 값을 보이고, 실패하면 서버 값으로 돌아간다
  const isExposed = patchExposure.isPending
    ? patchExposure.variables.isExposed
    : review.isExposed;

  // 실제로 잘렸을 때만 더보기를 보인다. 폭이 바뀌면 다시 잰다
  useEffect(() => {
    const element = contentRef.current;
    if (!element || isExpanded) return;
    const measure = () =>
      setIsClamped(element.scrollHeight > element.clientHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [review.review, isExpanded]);

  const handleToggle = (checked: boolean) => {
    patchExposure.mutate(
      { source: review.source, sourceId: review.sourceId, isExposed: checked },
      {
        onError: () => alert('노출 설정을 바꾸지 못했습니다.'),
      },
    );
  };

  return (
    <tr className="border-neutral-80 border-t align-top">
      <td className="whitespace-nowrap px-3 py-2">
        {MENTOR_REVIEW_TYPE_LABEL[review.type]}
      </td>
      <td className="max-w-[12rem] break-keep px-3 py-2">
        {review.programTitle ?? '-'}
      </td>
      <td className="whitespace-nowrap px-3 py-2">
        {review.score !== null ? review.score.toFixed(1) : '-'}
        {review.isEdited ? (
          <span className="text-xxsmall12 border-neutral-70 text-neutral-40 ml-1.5 rounded-full border px-1.5 py-0.5">
            수정됨
          </span>
        ) : null}
      </td>
      <td className="w-full min-w-[20rem] px-3 py-2">
        {review.review ? (
          <>
            <p
              ref={contentRef}
              className={`whitespace-pre-wrap ${isExpanded ? '' : 'line-clamp-3'}`}
            >
              {review.review}
            </p>
            {isClamped || isExpanded ? (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="text-neutral-40 text-xxsmall12 mt-1 underline"
              >
                {isExpanded ? '접기' : '더보기'}
              </button>
            ) : null}
          </>
        ) : (
          '-'
        )}
      </td>
      <td className="whitespace-nowrap px-3 py-2">
        {review.createDate
          ? dayjs(review.createDate).format('YYYY.MM.DD')
          : '-'}
      </td>
      <td className="px-3 py-2">
        <Switch
          checked={isExposed}
          disabled={patchExposure.isPending}
          onChange={(e) => handleToggle(e.target.checked)}
          inputProps={{ 'aria-label': '노출' }}
        />
      </td>
      <td className="whitespace-nowrap px-3 py-2">
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsEditOpen(true)}
        >
          수정
        </Button>
        {isEditOpen ? (
          <MentorReviewEditDialog
            mentorId={mentorId}
            review={review}
            onClose={() => setIsEditOpen(false)}
          />
        ) : null}
      </td>
    </tr>
  );
}
