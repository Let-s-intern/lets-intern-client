import { Box, Button, Modal, Typography } from '@mui/material';

// 모달 스타일
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxHeight: '100vh', // 뷰포트 높이의 90%로 제한
  bgcolor: 'background.paper',
  // borderRadius: 2,
  boxShadow: 24,
  display: 'flex',
  flexDirection: 'column', // 컨텐츠를 세로로 배치
};

// 헤더 스타일
const headerStyle = {
  p: 2,
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'space-between',
};

// 컨텐츠 스타일
const contentStyle = {
  flex: 1, // 남은 공간 차지
  overflow: 'auto', // 스크롤 활성화
};

// 푸터 스타일
const footerStyle = {
  p: 2,
  borderTop: 1,
  borderColor: 'divider',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 1,
};

const PreviewModal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ onClose, children, open }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* 헤더 영역 - 고정 */}
        <Box sx={headerStyle}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            fontWeight="bold"
          >
            미리보기
          </Typography>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
        </Box>

        {/* 컨텐츠 영역 - 스크롤 가능 */}
        <Box sx={contentStyle}>{children}</Box>

        {/* 푸터 영역 - 고정 */}
        <Box sx={footerStyle}>
          <Button onClick={onClose} variant="outlined">
            닫기
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PreviewModal;
