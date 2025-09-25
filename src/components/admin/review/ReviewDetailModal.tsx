import { Row } from '@/components/admin/pages/review/AdminChallengeReviewListPage';
import { Box, Button, Modal, Typography } from '@mui/material';

interface ReviewDetailModalProps {
  onClose: () => void;
  selectedRow: Row | null;
  goal?: boolean;
  worry?: boolean;
  mission?: boolean;
}

const ReviewDetailModal = ({
  onClose,
  selectedRow,
  goal,
  worry,
  mission,
}: ReviewDetailModalProps) => {
  return (
    <Modal open={selectedRow !== null} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          maxHeight: '80vh',
          overflowY: 'auto',
          bgcolor: 'white',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Typography variant="h6" gutterBottom>
          리뷰 상세 정보
        </Typography>
        {selectedRow ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="body1">
              <strong>이름:</strong> {selectedRow.reviewInfo.name}
            </Typography>
            {mission ? (
              <>
                <Typography variant="body1">
                  <strong>챌린지 명:</strong>{' '}
                  {selectedRow.reviewInfo.challengeTitle}
                </Typography>
                <Typography variant="body1">
                  <strong>미션 회차:</strong> {selectedRow.reviewInfo.missionTh}
                  회차
                </Typography>
                <Typography variant="body1">
                  <strong>미션 명:</strong>{' '}
                  {selectedRow.reviewInfo.missionTitle}
                </Typography>
                <Typography variant="body1">
                  <strong>미션 소감:</strong> {selectedRow.reviewInfo.review}
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="body1">
                  <strong>프로그램 명:</strong> {selectedRow.reviewInfo.title}
                </Typography>
                <Typography variant="body1">
                  <strong>만족도 점수:</strong> {selectedRow.reviewInfo.score}
                </Typography>
                <Typography variant="body1">
                  <strong>NPS 점수:</strong> {selectedRow.reviewInfo.npsScore}
                </Typography>
              </>
            )}
            {goal && (
              <>
                <Typography variant="body1">
                  <strong>목표:</strong>{' '}
                  {selectedRow.reviewItemList?.find(
                    (item) => item.questionType === 'GOAL',
                  )?.answer || '-'}
                </Typography>
                <Typography variant="body1">
                  <strong>목표 달성 여부:</strong>{' '}
                  {selectedRow.reviewItemList?.find(
                    (item) => item.questionType === 'GOAL_RESULT',
                  )?.answer || '-'}
                </Typography>
              </>
            )}
            {worry && (
              <>
                <Typography variant="body1">
                  <strong>고민:</strong>{' '}
                  {selectedRow.reviewItemList?.find(
                    (item) => item.questionType === 'WORRY',
                  )?.answer || '-'}
                </Typography>
                <Typography variant="body1">
                  <strong>고민 해결 여부:</strong>{' '}
                  {selectedRow.reviewItemList?.find(
                    (item) => item.questionType === 'WORRY_RESULT',
                  )?.answer || '-'}
                </Typography>
              </>
            )}
            {!mission && (
              <>
                <Typography variant="body1">
                  <strong>좋았던 점:</strong>{' '}
                  {selectedRow.reviewItemList?.find(
                    (item) => item.questionType === 'GOOD_POINT',
                  )?.answer || '-'}
                </Typography>
                <Typography variant="body1">
                  <strong>아쉬웠던 점:</strong>{' '}
                  {selectedRow.reviewItemList?.find(
                    (item) => item.questionType === 'BAD_POINT',
                  )?.answer || '-'}
                </Typography>
              </>
            )}
          </Box>
        ) : (
          <Typography>데이터를 불러오는 중...</Typography>
        )}
        <Button onClick={onClose} sx={{ mt: 2 }} variant="contained">
          닫기
        </Button>
      </Box>
    </Modal>
  );
};

export default ReviewDetailModal;
