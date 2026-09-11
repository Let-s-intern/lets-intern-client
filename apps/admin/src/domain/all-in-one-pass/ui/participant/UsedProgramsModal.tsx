import dayjs from '@/lib/dayjs';
import { PassParticipant, UsedProgramType } from '../../types';
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { IoClose } from 'react-icons/io5';

const usedProgramTypeToText: Record<UsedProgramType, string> = {
  CHALLENGE: '챌린지',
  GUIDEBOOK: '가이드북',
  VOD: 'VOD',
  MENTORING: '멘토링',
};

interface Props {
  participant: PassParticipant | null;
  onClose: () => void;
}

/** 참여자가 멤버십으로 이용한 프로그램 목록 모달 */
export default function UsedProgramsModal({ participant, onClose }: Props) {
  const open = participant !== null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle className="flex items-center justify-between">
        <span className="text-small18 font-semibold">
          {participant?.name}님이 이용한 프로그램
        </span>
        <IconButton onClick={onClose} size="small">
          <IoClose />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {participant && participant.usedPrograms.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {participant.usedPrograms.map((program) => (
              <li
                key={program.id}
                className="border-neutral-80 flex items-center justify-between gap-3 rounded-sm border px-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <Chip
                    label={usedProgramTypeToText[program.type]}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <span className="text-xsmall14 text-neutral-0 truncate">
                    {program.title}
                  </span>
                </div>
                {program.usedAt && (
                  <span className="text-xxsmall12 text-neutral-45 shrink-0">
                    {dayjs(program.usedAt).format('YYYY.MM.DD')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xsmall14 text-neutral-45 py-6 text-center">
            이용한 프로그램이 없습니다.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
