import { fileType, uploadFile } from '@/api/file';
import Input from '@/common/input/v1/Input';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import dayjs from '@/lib/dayjs';
import { ChallengeContent, ChallengeCurriculum } from '@/types/interface';
import { generateRandomNumber } from '@/utils/random';
import { Button, IconButton } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { MdDelete } from 'react-icons/md';

interface ChallengeCurriculumProps {
  curriculum: ChallengeContent['curriculum'];
  curriculumImage?: string;
  setContent: React.Dispatch<React.SetStateAction<ChallengeContent>>;
}

function ChallengeCurriculumEditor({
  curriculum = [],
  curriculumImage,
  setContent,
}: ChallengeCurriculumProps) {
  const { snackbar } = useAdminSnackbar();

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    try {
      const url = await uploadFile({
        file: e.target.files[0],
        type: fileType.enum.CHALLENGE,
      });

      setContent((prev) => ({
        ...prev,
        curriculumImage: url,
      }));
    } catch {
      snackbar('이미지 업로드에 실패했습니다.');
    }
  };

  const onClickAdd = () => {
    setContent((prev) => ({
      ...prev,
      curriculum: [
        ...(prev?.curriculum ?? []),
        {
          id: generateRandomNumber(),
          startDate: new Date().toString(),
          endDate: new Date().toString(),
          session: '',
          title: '',
          content: '',
        },
      ],
    }));
  };

  const onChangeDate = (
    name: string,
    target: ChallengeCurriculum,
    value: Dayjs | null,
  ) => {
    const newCurr = [...curriculum];
    const index = curriculum.findIndex((curr) => curr.id === target.id);

    if (index === -1) return;

    newCurr[index] = {
      ...newCurr[index],
      [name]: value?.format('YYYY-MM-DDTHH:mm') ?? '',
    };
    setContent((prev) => ({ ...prev, curriculum: newCurr }));
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    target: ChallengeCurriculum,
  ) => {
    const newCurr = [...curriculum];
    const index = curriculum.findIndex((curr) => curr.id === target.id);
    if (index === -1) return;

    newCurr[index] = {
      ...newCurr[index],
      [e.target.name]: e.target.value,
    };
    setContent((prev) => ({ ...prev, curriculum: newCurr }));
  };

  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <Heading2>커리큘럼</Heading2>
        <Button variant="outlined" onClick={onClickAdd}>
          추가
        </Button>
      </div>
      <div className="mb-3 flex gap-4">
        <div className="w-[300px] flex-shrink-0">
          <ImageUpload
            label="커리큘럼 상세 일정 이미지 업로드"
            id="curriculum-image"
            name="curriculum-image"
            image={curriculumImage}
            onChange={onChangeImage}
          />
        </div>
        <div className="flex-1">
          {curriculum.map((item) => (
            <div className="mb-3 flex items-center gap-2" key={item.id}>
              <DatePicker
                label="시작일자"
                value={dayjs(item.startDate)}
                onChange={(value) => onChangeDate('startDate', item, value)}
              />
              <DatePicker
                label="종료일자"
                value={dayjs(item.endDate)}
                onChange={(value) => onChangeDate('endDate', item, value)}
              />
              <div>
                <Input
                  label="회차"
                  name="session"
                  placeholder="회차를 입력하세요(예:2회차)"
                  value={item.session}
                  onChange={(e) => onChange(e, item)}
                />
              </div>
              <textarea
                className="h-[60px] rounded-sm border p-2"
                name="title"
                placeholder="제목을 입력하세요"
                value={item.title}
                onChange={(e) => onChange(e, item)}
              />
              <textarea
                className="h-[60px] flex-1 rounded-sm border p-2"
                name="content"
                placeholder="내용을 입력하세요"
                value={item.content}
                onChange={(e) => onChange(e, item)}
              />
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => {
                  setContent((prev) => ({
                    ...prev,
                    curriculum: prev.curriculum?.filter(
                      (curr) => curr.id !== item.id,
                    ),
                  }));
                }}
              >
                <MdDelete />
              </IconButton>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ChallengeCurriculumEditor;
