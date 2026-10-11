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
import { ActivePassParticipant, PassParticipationPeriod } from '../../types';

interface Props {
  participant: ActivePassParticipant | null;
  onClose: () => void;
}

/** 라벨 파생: 첫 건=패스 기간, 이후=연장(일수는 종료-시작) */
const periodLabel = (period: PassParticipationPeriod, index: number) => {
  if (index === 0) return '패스 기간';
  const days = dayjs(period.endDate).diff(dayjs(period.startDate), 'day');
  return `${days}일 연장`;
};

/** A-8 참여 기간 건별 내역 모달 (최초 패스 + 연장 각각) */
export default function ParticipationHistoryModal({
  participant,
  onClose,
}: Props) {
  const open = participant !== null;

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
        {participant && participant.periods.length > 0 ? (
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
              {participant.periods.map((period, index) => (
                <TableRow key={period.applicationId} hover>
                  <TableCell>
                    <Chip
                      label={periodLabel(period, index)}
                      size="small"
                      color={index === 0 ? 'default' : 'primary'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell className="text-neutral-20">
                    {period.applicationId}
                  </TableCell>

                  <TableCell className="text-neutral-20">
                    {dayjs(period.paidAt).format('YYYY.MM.DD')}
                  </TableCell>
                  <TableCell className="text-neutral-0">
                    {period.price.toLocaleString()}원
                  </TableCell>
                  <TableCell className="text-neutral-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-11 shrink-0">
                        {dayjs(period.endDate).diff(
                          dayjs(period.startDate),
                          'day',
                        )}
                        일
                      </span>
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
            참여 기간 내역이 없습니다.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
