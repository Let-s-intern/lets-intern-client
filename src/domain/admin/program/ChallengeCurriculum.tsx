import { fileType, uploadFile } from '@/api/file';
import Input from '@/common/input/v1/Input';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { ChallengeContent, ChallengeCurriculum } from '@/types/interface';
import { generateRandomNumber } from '@/utils/random';
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { MdDelete } from 'react-icons/md';

interface ChallengeCurriculumProps {
  curriculum: ChallengeContent['curriculum'];
  curriculumImage?: string;
  weekText?: string;
  content: ChallengeContent;
  setContent: React.Dispatch<React.SetStateAction<ChallengeContent>>;
}

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm';

function ChallengeCurriculumEditor({
  curriculum = [],
  curriculumImage,
  weekText,
  content,
  setContent,
}: ChallengeCurriculumProps) {
  const { snackbar } = useAdminSnackbar();

  const weekCount = weekText
    ? parseInt(weekText.match(/\d+/)?.[0] || '0', 10)
    : 0;

  const weekOptions = Array.from(
    { length: weekCount },
    (_, i) => `WEEK${i + 1}`,
  );

  const datePickerProps = {
    slotProps: {
      textField: { sx: { width: 150 } },
    },
  };

  // 주차 설정 변경 시 자동 리셋
  useEffect(() => {
    const resetWeekData = () => {
      setContent((prev) => ({
        ...prev,
        weekTitles: [],
        curriculum: prev.curriculum?.map((item) => ({ ...item, week: '' })),
      }));
    };

    // weekCount가 0이거나 null이면 체크박스 자동 해제 및 데이터 리셋
    if (weekCount === 0 || !weekText) {
      setContent((prev) => ({
        ...prev,
        useWeekSettings: false,
        weekTitles: [],
        curriculum: prev.curriculum?.map((item) => ({ ...item, week: '' })),
      }));
      return;
    }

    // 체크박스가 해제되면 주차 데이터 모두 리셋
    if (!content.useWeekSettings) {
      resetWeekData();
      return;
    }

    // 유효하지 않은 week 값 리셋
    if (!curriculum?.length) return;

    const validWeeks = new Set(weekOptions);
    const hasInvalidWeek = curriculum.some(
      (item) => item.week && !validWeeks.has(item.week),
    );

    if (hasInvalidWeek) {
      setContent((prev) => ({
        ...prev,
        curriculum: prev.curriculum?.map((item) => ({
          ...item,
          week: validWeeks.has(item.week || '') ? item.week : '',
        })),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekCount, content.useWeekSettings, weekText]);

  const uploadImage = async (file: File) => {
    try {
      return await uploadFile({
        file,
        type: fileType.enum.CHALLENGE,
      });
    } catch {
      snackbar('이미지 업로드에 실패했습니다.');
      throw new Error('Image upload failed');
    }
  };

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadImage(e.target.files[0]);
    setContent((prev) => ({ ...prev, curriculumImage: url }));
  };

  const onChangeContentImg = async (
    e: React.ChangeEvent<HTMLInputElement>,
    target: ChallengeCurriculum,
  ) => {
    if (!e.target.files) return;
    const url = await uploadImage(e.target.files[0]);
    updateCurriculum(target, { contentImg: url });
  };

  const onClickAdd = () => {
    setContent((prev) => ({
      ...prev,
      curriculum: [
        ...(prev?.curriculum ?? []),
        {
          id: generateRandomNumber(),
          week: '',
          startDate: new Date().toString(),
          endDate: new Date().toString(),
          session: '',
          title: '',
          content: '',
          contentImg: '',
          contentHighlightColor: 'none',
        },
      ],
    }));
  };

  const updateCurriculum = (
    target: ChallengeCurriculum,
    updates: Partial<ChallengeCurriculum>,
  ) => {
    const newCurr = [...curriculum];
    const index = curriculum.findIndex((curr) => curr.id === target.id);
    if (index === -1) return;
    newCurr[index] = { ...newCurr[index], ...updates };
    setContent((prev) => ({ ...prev, curriculum: newCurr }));
  };

  const onChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } },
    target: ChallengeCurriculum,
  ) => {
    updateCurriculum(target, { [e.target.name]: e.target.value });
  };

  const onChangeDate = (
    name: string,
    target: ChallengeCurriculum,
    value: Dayjs | null,
  ) => {
    updateCurriculum(target, {
      [name]: value?.format(DATE_FORMAT) ?? '',
    });
  };

  const updateWeekTitles = (
    week: string,
    updates: Partial<{ weekTitle: string; startDate: string; endDate: string }>,
  ) => {
    setContent((prev) => {
      const currentTitles = prev.weekTitles || [];
      const index = currentTitles.findIndex((item) => item.week === week);
      const newTitles = [...currentTitles];

      if (index === -1) {
        newTitles.push({
          week,
          weekTitle: '',
          startDate: '',
          endDate: '',
          ...updates,
        });
      } else {
        newTitles[index] = { ...newTitles[index], ...updates };
      }

      return { ...prev, weekTitles: newTitles };
    });
  };

  const getWeekTitleItem = (week: string) => {
    return (
      content.weekTitles?.find((item) => item.week === week) || {
        week,
        weekTitle: '',
        startDate: '',
        endDate: '',
      }
    );
  };

  const onChangeWeekTitle = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    week: string,
  ) => {
    updateWeekTitles(week, { weekTitle: e.target.value });
  };

  const onChangeWeekDate = (
    week: string,
    name: 'startDate' | 'endDate',
    value: Dayjs | null,
  ) => {
    updateWeekTitles(week, {
      [name]: value?.format(DATE_FORMAT) ?? '',
    });
  };

  const handleDeleteCurriculum = (id: string) => {
    setContent((prev) => ({
      ...prev,
      curriculum: prev.curriculum?.filter((curr) => curr.id !== id),
    }));
  };

  return (
    <>
      <div className="mb-0.5 flex items-center justify-between">
        <Heading2>커리큘럼</Heading2>
        <Button variant="outlined" onClick={onClickAdd}>
          추가
        </Button>
      </div>
      <div className="mb-3 flex items-center">
        <Heading3>주차 설정</Heading3>
        <Checkbox
          checked={content.useWeekSettings || false}
          disabled={weekOptions.length === 0}
          onChange={(e) =>
            setContent((prev) => ({
              ...prev,
              useWeekSettings: e.target.checked,
            }))
          }
        />
        <span className="text-left text-xs text-neutral-50">
          ** 주차 관련사항을 사용하시려면 상단 <b>챌린지 POINT [텍스트]</b>에
          주차 정보를 입력해주세요 (예: 2주)
        </span>
      </div>
      {content.useWeekSettings && weekOptions.length > 0 && (
        <div className="mb-3 flex flex-col gap-2">
          {weekOptions.map((week) => {
            const weekTitleItem = getWeekTitleItem(week);
            return (
              <div key={week} className="flex items-center gap-1.5">
                <span className="text-small16 inline-flex h-[60px] items-center justify-center rounded-sm border border-neutral-200 bg-neutral-80 px-7">
                  {week}
                </span>

                <textarea
                  className="h-[60px] w-[410px] rounded-sm border p-2"
                  name="weekTitle"
                  placeholder="주차 제목을 입력하세요"
                  value={weekTitleItem.weekTitle}
                  onChange={(e) => onChangeWeekTitle(e, week)}
                />
                <DatePicker
                  label="시작일자"
                  value={
                    weekTitleItem.startDate
                      ? dayjs(weekTitleItem.startDate)
                      : null
                  }
                  onChange={(value) =>
                    onChangeWeekDate(week, 'startDate', value)
                  }
                  {...datePickerProps}
                />
                <DatePicker
                  label="종료일자"
                  value={
                    weekTitleItem.endDate ? dayjs(weekTitleItem.endDate) : null
                  }
                  onChange={(value) => onChangeWeekDate(week, 'endDate', value)}
                  {...datePickerProps}
                />
              </div>
            );
          })}
        </div>
      )}
      <hr className="my-6 w-full border-neutral-75" />

      <div className="mb-3">
        {curriculum.map((item) => (
          <div className="mb-3 flex items-center gap-1.5" key={item.id}>
            {content.useWeekSettings && (
              <FormControl sx={{ minWidth: 110 }}>
                <InputLabel>주차</InputLabel>
                <Select
                  label="주차"
                  name="week"
                  value={item.week || ''}
                  onChange={(e) =>
                    onChange(
                      { target: { name: 'week', value: e.target.value } },
                      item,
                    )
                  }
                >
                  {weekOptions.map((week) => (
                    <MenuItem key={week} value={week}>
                      {week}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <DatePicker
              label="시작일자"
              value={dayjs(item.startDate)}
              onChange={(value) => onChangeDate('startDate', item, value)}
              {...datePickerProps}
            />
            <DatePicker
              label="종료일자"
              value={dayjs(item.endDate)}
              onChange={(value) => onChangeDate('endDate', item, value)}
              {...datePickerProps}
            />
            <Input
              label="회차"
              name="session"
              placeholder="예:2회차"
              value={item.session}
              onChange={(e) => onChange(e, item)}
              fullWidth={false}
              className="w-[100px]"
            />
            <textarea
              className="h-[60px] min-w-[300px] rounded-sm border p-2"
              name="title"
              placeholder="제목을 입력하세요"
              value={item.title}
              onChange={(e) => onChange(e, item)}
            />
            <div className="relative h-[60px] w-[60px] flex-shrink-0">
              <label className="absolute -top-2 z-10 text-xs text-neutral-40">
                내용 이미지
              </label>
              <div className="h-full w-full overflow-hidden rounded-sm border border-neutral-200 [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                <ImageUpload
                  label=""
                  id={`logo-${item.id}`}
                  name={`logo-${item.id}`}
                  image={item.contentImg}
                  simpleMode
                  imageFormat={{ width: 60, height: 60 }}
                  onChange={(e) => onChangeContentImg(e, item)}
                />
              </div>
            </div>
            <textarea
              className="h-[60px] flex-1 rounded-sm border p-2"
              name="content"
              placeholder="내용을 입력하세요"
              value={item.content}
              onChange={(e) => onChange(e, item)}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>내용 강조</InputLabel>
              <Select
                label="내용 강조"
                name="contentHighlightColor"
                value={item.contentHighlightColor || 'none'}
                onChange={(e) =>
                  onChange(
                    {
                      target: {
                        name: 'contentHighlightColor',
                        value: e.target.value,
                      },
                    },
                    item,
                  )
                }
              >
                <MenuItem value="none">적용 안 함</MenuItem>
                <MenuItem value="gray">회색</MenuItem>
                <MenuItem value="accent">강조색</MenuItem>
              </Select>
            </FormControl>
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => handleDeleteCurriculum(item.id)}
            >
              <MdDelete />
            </IconButton>
          </div>
        ))}
        <hr className="my-6 w-full border-neutral-75" />
      </div>
      <div className="w-[300px] flex-shrink-0">
        <ImageUpload
          label="커리큘럼 상세 일정 이미지 업로드"
          id="curriculum-image"
          name="curriculum-image"
          image={curriculumImage}
          onChange={onChangeImage}
        />
      </div>
    </>
  );
}

export default ChallengeCurriculumEditor;
