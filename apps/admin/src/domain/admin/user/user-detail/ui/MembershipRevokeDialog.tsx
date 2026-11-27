import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

interface Props {
  programTitle: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/**
 * 올인원패스 수동 환불 확인 창.
 * 이 호출은 이용 권한 회수와 환불 표시만 한다. 돈은 토스에서 따로 환불해야 하므로,
 * 일반 환불처럼 읽혀 실제 환불이 끝난 줄 알지 않게 문구를 그대로 보인다.
 */
const MembershipRevokeDialog = ({
  programTitle,
  isSubmitting,
  onConfirm,
  onClose,
}: Props) => (
  <Dialog open onClose={onClose} fullWidth maxWidth="xs">
    <DialogTitle>이용 권한 회수(수동 환불)</DialogTitle>
    <DialogContent>
      <p className="mb-2 text-sm font-medium">{programTitle}</p>
      <p className="text-sm">
        이용 권한을 회수하고 환불 표시만 합니다. 결제 금액의 실제 환불은
        토스에서 따로 처리해야 합니다.
      </p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} disabled={isSubmitting}>
        닫기
      </Button>
      <Button color="error" onClick={onConfirm} disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : '이용 권한 회수'}
      </Button>
    </DialogActions>
  </Dialog>
);

export default MembershipRevokeDialog;
