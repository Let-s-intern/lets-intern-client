import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import ReactQuill from 'react-quill';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface ProgramEditorProps {
  values: any;
  setValues: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const ProgramEditor = ({
  values,
  setValues,
  handleSubmit,
  content,
  setContent,
}: ProgramEditorProps) => {
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // 표시할 스타일링 옵션
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // 커스텀 헤더 옵션
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // 서브스크립트/수퍼스크립트
      [{ indent: '-1' }, { indent: '+1' }], // 들여쓰기
      [{ direction: 'rtl' }], // 텍스트 방향

      [{ size: ['small', false, 'large', 'huge'] }], // 폰트 크기
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // 글자색, 배경색
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // 포맷 제거
      ['image'], // 이미지 업로드
    ],
  };

  return (
    <div className="mx-auto max-w-xl font-notosans">
      <header className="my-5 text-2xl font-bold">프로그램 개설</header>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Input
          label="이름"
          placeholder="프로그램 이름을 입력하세요"
          value={values.title ? values.title : ''}
          onChange={(e: any) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="기수"
          type="number"
          value={values.th ? values.th : ''}
          placeholder="프로그램 기수를 입력하세요"
          onChange={(e: any) => setValues({ ...values, th: e.target.value })}
        />
        <FormControl fullWidth>
          <InputLabel id="type">유형</InputLabel>
          <Select
            labelId="type"
            id="type"
            label="유형"
            value={values.type ? values.type : ''}
            onChange={(e) => {
              setValues({ ...values, type: e.target.value });
            }}
          >
            <MenuItem value="CHALLENGE_FULL">챌린지(전체)</MenuItem>
            <MenuItem value="CHALLENGE_HALF">챌린지(일부)</MenuItem>
            <MenuItem value="BOOTCAMP">부트캠프</MenuItem>
            <MenuItem value="LETS_CHAT">렛츠챗</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="way">방식</InputLabel>
          <Select
            labelId="way"
            id="way"
            label="방식"
            value={values.way ? values.way : ''}
            onChange={(e) => {
              setValues({ ...values, way: e.target.value });
            }}
          >
            <MenuItem value="OFFLINE">오프라인</MenuItem>
            <MenuItem value="ONLINE">온라인</MenuItem>
          </Select>
        </FormControl>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="시작 날짜"
              value={dayjs(values.startDate) ? dayjs(values.startDate) : ''}
              onChange={(value) =>
                setValues({ ...values, startDate: dayjs(value) })
              }
            />
          </DemoContainer>
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DateTimePicker']}>
            <DateTimePicker
              label="마감 날짜"
              value={dayjs(values.dueDate) ? dayjs(values.dueDate) : ''}
              onChange={(value) =>
                setValues({ ...values, dueDate: dayjs(value) })
              }
            />
          </DemoContainer>
        </LocalizationProvider>
        <ReactQuill
          modules={modules}
          value={content ? content : ''}
          onChange={(value) => {
            setContent(value);
          }}
        />
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            className="w-20 rounded bg-indigo-600 py-2 text-center font-medium text-white"
          >
            등록
          </button>
          <button
            type="button"
            className="w-20 rounded bg-gray-400 py-2 text-center font-medium text-white"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramEditor;
