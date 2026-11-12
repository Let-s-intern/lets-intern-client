import {
  duplicateChallenge,
  DuplicateChallengeReq,
} from '@/api/challenge/challenge';
import { getChallenge } from '@/api/program';
import { ChallengeType, ChallengeVersion } from '@/schema';
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
import { useEffect, useState } from 'react';
import {
  generateDuplicateThumbnails,
  getThumbnailBlockReason,
  THUMBNAIL_BLOCK_REASON_TEXT,
} from './utils/duplicateThumbnail';
import { THUMBNAIL_TYPE_LABELS } from './utils/generateThumbnail';

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

const SUPPORTED_TYPE_LABELS = Object.values(THUMBNAIL_TYPE_LABELS).join(', ');

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
  const [challengeType, setChallengeType] = useState<ChallengeType | null>(
    null,
  );
  const [versions, setVersions] = useState<ChallengeVersion[]>([]);

  const hasVersions = versions.length > 0;
  const thumbnailBlockReason = getThumbnailBlockReason({
    copyContent,
    challengeType,
    title,
    versionTitles: versions.map((version) => version.title),
  });
  const isThumbnailEnabled = thumbnailBlockReason === null;

  useEffect(() => {
    if (!isOpen) return;
    getChallenge(sourceChallenge.id).then((challenge) => {
      setChallengeType(challenge.challengeType);
      setVersions(challenge.versionList);
    });
  }, [isOpen, sourceChallenge.id]);

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
    setChallengeType(null);
    setVersions([]);
    onClose();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (generateThumbnail) setGenerateThumbnail(false);
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled || isLoading) return;

    setIsLoading(true);
    try {
      const effectiveTitle = copyContent ? sourceChallenge.title : title;

      let thumbnailUrl: string | null = sourceChallenge.thumbnail ?? null;
      let versionThumbnails: DuplicateChallengeReq['versionThumbnails'] = null;
      if (generateThumbnail && challengeType) {
        const generated = await generateDuplicateThumbnails(
          challengeType,
          effectiveTitle,
          versions,
        );
        thumbnailUrl = generated.thumbnail;
        versionThumbnails = generated.versionThumbnails;
      }

      await duplicateChallenge(sourceChallenge.id, {
        title: copyContent ? null : effectiveTitle,
        beginning: copyContent
          ? null
          : (beginning?.format('YYYY-MM-DDTHH:mm:ss') ?? null),
        deadline: copyContent
          ? null
          : (deadline?.format('YYYY-MM-DDTHH:mm:ss') ?? null),
        startDate: copyContent
          ? null
          : (startDate?.format('YYYY-MM-DDTHH:mm:ss') ?? null),
        thumbnail: thumbnailUrl,
        desktopThumbnail: thumbnailUrl,
        copyContent,
        copyDashboard,
        versionThumbnails,
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
              onChange={(e) => handleTitleChange(e.target.value)}
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

          <div className="flex flex-col gap-1">
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={generateThumbnail}
                    disabled={!isThumbnailEnabled}
                    onChange={(e) => setGenerateThumbnail(e.target.checked)}
                  />
                }
                label="썸네일 자동 생성"
              />
              {thumbnailBlockReason && (
                <p className="-mt-1 mb-1 ml-8 text-xs text-red-500">
                  {THUMBNAIL_BLOCK_REASON_TEXT[thumbnailBlockReason]}
                </p>
              )}
              <p className="-mt-1 ml-8 text-xs text-gray-400">
                * <strong>기수가 포함된 제목</strong> 입력 시 활성화됩니다. (ex.
                포트폴리오 1주 완성 챌린지 32기)
                <br />* 자기소개서, 포트폴리오 챌린지는{' '}
                <strong>주차도 함께</strong> 입력해야 합니다.
                <br />* <strong>{SUPPORTED_TYPE_LABELS}</strong> 챌린지만
                가능합니다.
                {hasVersions ? (
                  <>
                    <br />* 버전마다 <strong>[버전명] 챌린지 제목</strong>으로
                    썸네일을 만들고, 버전명이 우측 상단 배너로 들어갑니다.
                  </>
                ) : (
                  <>
                    <br />* 제목 앞 <strong>[ ] 안의 문구</strong>가 우측 상단
                    배너로 들어갑니다. 없으면 배너 없이 생성됩니다. (ex.
                    [인턴·실무 경험자 Ver.])
                    <br />* 이력서 챌린지는 <strong>[ ] 문구가 있어야</strong>
                    가능합니다.
                  </>
                )}
              </p>
            </div>
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
