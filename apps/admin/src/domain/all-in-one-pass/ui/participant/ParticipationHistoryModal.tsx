import { useGetParticipationPeriodsQuery } from '@/api/all-in-one-pass/useActiveParticipants';
import dayjs from '@/lib/dayjs';
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { ActivePassParticipant } from '../../types';

interface Props {
  participant: ActivePassParticipant | null;
  onClose: () => void;
}

export default function ParticipationHistoryModal({
  participant,
  onClose,
}: Props) {
  const open = participant !== null;
  const { data: periods = [], isLoading } = useGetParticipationPeriodsQuery(
    participant?.id,
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      slotProps={{ paper: { sx: { width: 800, maxWidth: '92vw' } } }}
    >
      <DialogTitle className="flex items-center justify-between">
        <span className="text-small18 font-semibold">
          {participant?.name}님 참여 기간 내역
        </span>
        <IconButton onClick={onClose} size="small">
          <IoClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="p-0">
        {periods.length > 0 ? (
          <Table stickyHeader sx={{ '& td, & th': { py: 2 } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 110 }}>구분</TableCell>
                <TableCell sx={{ width: 140 }}>주문번호</TableCell>
                <TableCell sx={{ width: 120 }}>결제일</TableCell>
                <TableCell sx={{ width: 120 }}>결제 금액</TableCell>
                <TableCell>이용 기간</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {periods.map((period) => (
                <TableRow key={period.orderId} hover>
                  <TableCell>
                    <Chip
                      label={period.title}
                      size="small"
                      color={
                        period.type === 'EXTENSION' ? 'primary' : 'default'
                      }
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className="text-neutral-20">
                    {period.orderId}
                  </TableCell>
                  <TableCell className="text-neutral-20">
                    {period.paidAt
                      ? dayjs(period.paidAt).format('YYYY.MM.DD')
                      : '-'}
                  </TableCell>
                  <TableCell className="text-neutral-0">
                    {period.finalPrice.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-neutral-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-11 shrink-0">{period.days}일</span>
                      <span>
                        ({dayjs(period.startDate).format('YYYY.MM.DD')} ~{' '}
                        {dayjs(period.endDate).format('YYYY.MM.DD')})
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-xsmall14 text-neutral-45 py-6 text-center">
            {isLoading ? '불러오는 중...' : '참여 기간 내역이 없습니다.'}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
