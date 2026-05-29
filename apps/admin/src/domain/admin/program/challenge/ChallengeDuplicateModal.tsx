import { duplicateChallenge } from '@/api/challenge/challenge';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Modal,
  Paper,
  TextField,
} from '@mui/material';
import {
  DateTimePicker,
  DateTimePickerSlotProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  sourceChallenge: {
    id: number;
    title: string;
    thumbnail: string | null;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const dateTimePickerSlotProps: DateTimePickerSlotProps<Dayjs, false> = {
  textField: { size: 'small', sx: { width: '100%' } },
};

const ChallengeDuplicateModal = ({
  isOpen,
  sourceChallenge,
  onClose,
  onSuccess,
}: Props) => {
  const [copyContent, setCopyContent] = useState(false);
  const [title, setTitle] = useState('');
  const [beginning, setBeginning] = useState<Dayjs | null>(null);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [generateThumbnail, setGenerateThumbnail] = useState(false);
  const [copyDashboard, setCopyDashboard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isSubmitDisabled =
    !copyContent && (!title || !beginning || !deadline || !startDate);

  const handleClose = () => {
    setCopyContent(false);
    setTitle('');
    setBeginning(null);
    setDeadline(null);
    setStartDate(null);
    setGenerateThumbnail(false);
    setCopyDashboard(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled || isLoading) return;

    setIsLoading(true);
    try {
      await duplicateChallenge(sourceChallenge.id, {
        title: copyContent ? sourceChallenge.title : title,
        beginning: copyContent
          ? ''
          : (beginning?.format('YYYY-MM-DDTHH:mm:ss') ?? ''),
        deadline: copyContent
          ? ''
          : (deadline?.format('YYYY-MM-DDTHH:mm:ss') ?? ''),
        startDate: copyContent
          ? ''
          : (startDate?.format('YYYY-MM-DDTHH:mm:ss') ?? ''),
        thumbnail: generateThumbnail
          ? null
          : (sourceChallenge.thumbnail ?? null),
        desktopThumbnail: generateThumbnail
          ? null
          : (sourceChallenge.thumbnail ?? null),
        copyContent,
        copyDashboard,
      });
      onSuccess();
      handleClose();
    } catch (e) {
      alert('복제에 실패했습니다: ' + e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Paper className="absolute left-1/2 top-1/2 w-[600px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 p-8">
        <h2 className="text-small18 mb-5 font-semibold">
          [{sourceChallenge.title}] 복제하기
        </h2>

        <div className="flex flex-col gap-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={copyContent}
                onChange={(e) => setCopyContent(e.target.checked)}
              />
            }
            label="이전 내용 그대로 가져오기"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xsmall16 font-medium">챌린지 제목</label>
            <TextField
              placeholder="챌린지 제목을 입력하세요."
              size="small"
              fullWidth
              disabled={copyContent}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
            <div className="flex flex-col gap-1.5">
              <label className="text-xsmall16 font-medium">모집 기간</label>
              <div className="flex items-center gap-2">
                <DateTimePicker
                  label="모집 시작일"
                  format="YYYY.MM.DD(dd) HH:mm"
                  ampm={false}
                  disabled={copyContent}
                  value={beginning}
                  onChange={setBeginning}
                  minDateTime={dayjs()}
                  slotProps={dateTimePickerSlotProps}
                />
                <span className="shrink-0">-</span>
                <DateTimePicker
                  label="모집 종료일"
                  format="YYYY.MM.DD(dd) HH:mm"
                  ampm={false}
                  disabled={copyContent}
                  value={deadline}
                  onChange={setDeadline}
                  minDateTime={beginning ?? dayjs()}
                  slotProps={dateTimePickerSlotProps}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xsmall16 font-medium">챌린지 시작일</label>
              <DateTimePicker
                label="챌린지 시작일"
                format="YYYY.MM.DD(dd) HH:mm"
                ampm={false}
                disabled={copyContent}
                value={startDate}
                onChange={setStartDate}
                minDateTime={dayjs()}
                slotProps={dateTimePickerSlotProps}
              />
            </div>
          </LocalizationProvider>

          <div className="flex flex-col">
            <FormControlLabel
              control={
                <Checkbox
                  checked={generateThumbnail}
                  disabled={copyContent}
                  onChange={(e) => setGenerateThumbnail(e.target.checked)}
                />
              }
              label="썸네일 자동 생성"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={copyDashboard}
                  disabled={copyContent}
                  onChange={(e) => setCopyDashboard(e.target.checked)}
                />
              }
              label="대시보드 함께 복제"
            />
          </div>
        </div>

        <div className="mt-10 flex gap-2">
          <Button
            variant="outlined"
            size="large"
            onClick={handleClose}
            className="flex-1"
          >
            취소하기
          </Button>
          <Button
            variant="contained"
            size="large"
            className="flex-1 disabled:cursor-not-allowed"
            disabled={isSubmitDisabled || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? '복제 중...' : '복제하기'}
          </Button>
        </div>
      </Paper>
    </Modal>
  );
};

export default ChallengeDuplicateModal;
