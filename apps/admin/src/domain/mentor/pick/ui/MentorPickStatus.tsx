import { Button } from '@mui/material';
import { useState } from 'react';

import { useAdminMentorPickListQuery } from '@/api/mentor/mentor';

import MentorPickRankDialog from './MentorPickRankDialog';

interface Props {
  mentorId: number;
}

/** 멘토 상세에 붙는 렛커 픽 순위 표시와 「순위 수정」 창 */
export default function MentorPickStatus({ mentorId }: Props) {
  const { data: picks, isLoading } = useAdminMentorPickListQuery();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isLoading || !picks) return null;

  const index = picks.findIndex((pick) => pick.mentorId === mentorId);
  const isPicked = index >= 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xsmall14 text-neutral-30 font-medium">
        {isPicked ? `렛커 픽 ${index + 1}위` : '렛커 픽 미등록'}
      </span>
      <Button
        variant="outlined"
        size="small"
        onClick={() => setIsDialogOpen(true)}
      >
        {isPicked ? '순위 수정' : '렛커 픽 관리'}
      </Button>
      {isDialogOpen ? (
        <MentorPickRankDialog
          mentorId={mentorId}
          initialPicks={picks}
          onClose={() => setIsDialogOpen(false)}
        />
      ) : null}
    </div>
  );
}
