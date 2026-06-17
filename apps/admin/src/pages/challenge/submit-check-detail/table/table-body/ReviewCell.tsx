import { challengeSubmitDetailCellWidthList } from '@/utils/tableCellWidthList';
import { Box, Modal, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';

interface ReviewCellProps {
  review: string | undefined;
  cellWidthListIndex: number;
}

const ReviewCell = ({ review, cellWidthListIndex }: ReviewCellProps) => {
  const [isReviewShown, setIsReviewShown] = useState(false);

  return (
    <>
      <div
        className={clsx(
          'my-auto cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap border-r border-[#D9D9D9] p-3 text-center text-sm',
          challengeSubmitDetailCellWidthList[cellWidthListIndex],
        )}
        onClick={() => setIsReviewShown(true)}
      >
        {review || '-'}
      </div>
      <Modal open={isReviewShown} onClose={() => setIsReviewShown(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: 24,
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            미션 소감
          </Typography>
          {review || '-'}
        </Box>
      </Modal>
    </>
  );
};

export default ReviewCell;
