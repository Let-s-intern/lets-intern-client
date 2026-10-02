import {
  CalendarEventType,
  PassCalendarEvent,
} from '@/domain/all-in-one-pass/types';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { Button, IconButton, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';
import CalendarPreviewModal from '../ui/calendar/CalendarPreviewModal';

const TYPE_OPTIONS: { value: CalendarEventType; label: string }[] = [
  { value: 'SEMINAR', label: '세미나' },
  { value: 'MILESTONE', label: '마일스톤' },
];

export const createEmptyCalendarEvent = (): PassCalendarEvent => ({
  id: crypto.randomUUID(),
  date: null,
  type: 'SEMINAR',
  title: '',
  url: null,
});

interface Props {
  events: PassCalendarEvent[];
  onChange: (events: PassCalendarEvent[]) => void;
  /** 미리보기 이동 범위 계산용 (구매 기간·패스 기간) */
  purchaseStartDate?: string | null;
  purchaseEndDate?: string | null;
  passDays?: number | null;
}

/** 1.3 캘린더 관리: 세미나·마일스톤 일정 수기 입력 (챌린지는 자동 반영) */
export default function CalendarSection({
  events,
  onChange,
  purchaseStartDate,
  purchaseEndDate,
  passDays,
}: Props) {
  const { snackbar } = useAdminSnackbar();
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleOpenPreview = () => {
    if (!purchaseStartDate || !purchaseEndDate || !passDays) {
      snackbar(
        '기본 정보의 "구매 가능 기간"과 "패스 기간"을 먼저 입력해주세요.',
      );
      return;
    }
    setPreviewOpen(true);
  };

  const update = (id: string, partial: Partial<PassCalendarEvent>) =>
    onChange(events.map((e) => (e.id === id ? { ...e, ...partial } : e)));

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-small20 text-neutral-0 font-semibold">
          캘린더 관리
        </h2>
        <button
          type="button"
          className="text-xsmall14 text-primary hover:text-primary-hover underline underline-offset-2"
          onClick={handleOpenPreview}
        >
          미리보기
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {events.map((event) => (
          <div key={event.id} className="flex items-center gap-2">
            <DatePicker
              label="날짜"
              value={event.date ? dayjs(event.date) : null}
              onChange={(v) =>
                update(event.id, { date: v ? v.toISOString() : null })
              }
              slotProps={{ textField: { size: 'small' } }}
              className="w-40 shrink-0"
            />
            <TextField
              select
              label="유형"
              value={event.type}
              onChange={(e) =>
                update(event.id, { type: e.target.value as CalendarEventType })
              }
              size="small"
              className="w-28 shrink-0"
            >
              {TYPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="제목"
              value={event.title}
              onChange={(e) => update(event.id, { title: e.target.value })}
              size="small"
              fullWidth
            />
            <TextField
              label="URL (선택)"
              value={event.url ?? ''}
              onChange={(e) =>
                update(event.id, { url: e.target.value || null })
              }
              size="small"
              fullWidth
            />
            <IconButton
              aria-label="일정 삭제"
              color="error"
              onClick={() => onChange(events.filter((e) => e.id !== event.id))}
            >
              <FaTrashCan size={16} />
            </IconButton>
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={() => onChange([...events, createEmptyCalendarEvent()])}
        sx={{ borderStyle: 'dashed' }}
      >
        일정 추가
      </Button>

      <CalendarPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        events={events}
        purchaseStartDate={purchaseStartDate}
        purchaseEndDate={purchaseEndDate}
        passDays={passDays}
      />
    </section>
  );
}
