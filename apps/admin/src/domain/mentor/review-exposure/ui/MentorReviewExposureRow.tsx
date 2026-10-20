import { Switch } from '@mui/material';
import dayjs from 'dayjs';
import { useState } from 'react';

import { usePatchAdminMentorReviewExposure } from '@/api/mentor/mentor';
import type { AdminMentorReview } from '@/api/mentor/mentorSchema';
import { MENTOR_REVIEW_TYPE_LABEL } from '../constants/mentorReviewTypeLabel';

interface Props {
  mentorId: number;
  review: AdminMentorReview;
}

export default function MentorReviewExposureRow({ mentorId, review }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  // 행마다 뮤테이션을 따로 두어 바꾸는 중인 행의 스위치만 막는다
  const patchExposure = usePatchAdminMentorReviewExposure(mentorId);

  // 요청 중에는 바꾼 값을 보이고, 실패하면 서버 값으로 돌아간다
  const isExposed = patchExposure.isPending
    ? patchExposure.variables.isExposed
    : review.isExposed;

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
      <td className="px-3 py-2">{review.programTitle ?? '-'}</td>
      <td className="whitespace-nowrap px-3 py-2">{review.score ?? '-'}</td>
      <td className="px-3 py-2">
        {review.review ? (
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`whitespace-pre-wrap text-left ${isExpanded ? '' : 'line-clamp-2'}`}
          >
            {review.review}
          </button>
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
    </tr>
  );
}
