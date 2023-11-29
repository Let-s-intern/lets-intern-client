import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import ReactQuill from 'react-quill';
import styled from 'styled-components';
import FAQEditor from './FAQEditor';

interface ProgramEditorProps {
  values: any;
  setValues: React.Dispatch<React.SetStateAction<any>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  faqList: any;
  faqIdList: any;
  handleFAQAdd: () => void;
  handleFAQDelete: (faqId: number) => void;
  handleFAQChange: (e: any, faqId: number) => void;
  handleFAQCheckChange: (e: any, faqId: number) => void;
  handleFAQIdListReset: () => void;
}

const ProgramEditor = ({
  values,
  setValues,
  handleSubmit,
  content,
  setContent,
  faqList,
  faqIdList,
  handleFAQAdd,
  handleFAQDelete,
  handleFAQChange,
  handleFAQCheckChange,
  handleFAQIdListReset,
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
        <FormControl fullWidth>
          <InputLabel id="type">프로그램 분류</InputLabel>
          <Select
            labelId="type"
            id="type"
            label="프로그램 분류"
            value={values.type ? values.type : ''}
            onChange={(e) => {
              setValues({ ...values, type: e.target.value });
              handleFAQIdListReset();
            }}
          >
            <MenuItem value="CHALLENGE_FULL">챌린지(전체)</MenuItem>
            <MenuItem value="CHALLENGE_HALF">챌린지(일부)</MenuItem>
            <MenuItem value="BOOTCAMP">부트캠프</MenuItem>
            <MenuItem value="LETS_CHAT">렛츠챗</MenuItem>
          </Select>
        </FormControl>
        <Input
          label="기수"
          type="number"
          value={values.th ? values.th : ''}
          placeholder="프로그램 기수를 입력하세요"
          onChange={(e: any) => setValues({ ...values, th: e.target.value })}
        />
        <Input
          label="제목"
          placeholder="프로그램 제목을 입력하세요"
          value={values.title ? values.title : ''}
          onChange={(e: any) => setValues({ ...values, title: e.target.value })}
        />
        <Input
          label="정원"
          type="number"
          value={values.headcount ? values.headcount : ''}
          placeholder="총 정원 수를 입력하세요"
          onChange={(e: any) =>
            setValues({ ...values, headcount: e.target.value })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="way">온/오프라인 여부</InputLabel>
          <Select
            labelId="way"
            id="way"
            label="온/오프라인 여부"
            value={values.way ? values.way : ''}
            onChange={(e) => {
              setValues({ ...values, way: e.target.value });
            }}
          >
            <MenuItem value="OFFLINE">오프라인</MenuItem>
            <MenuItem value="ONLINE">온라인</MenuItem>
            <MenuItem value="ALL">온오프라인 병행</MenuItem>
          </Select>
        </FormControl>
        <Input
          label="장소"
          value={values.location ? values.location : ''}
          placeholder="장소를 입력하세요"
          onChange={(e: any) =>
            setValues({ ...values, location: e.target.value })
          }
        />
        <DateTimeControl>
          <DateTimeLabel htmlFor="startDate">시작 일자</DateTimeLabel>
          <input
            id="startDate"
            type="datetime-local"
            value={values.startDate}
            onChange={(e) =>
              setValues({ ...values, startDate: e.target.value })
            }
          />
        </DateTimeControl>
        <DateTimeControl>
          <DateTimeLabel htmlFor="endDate">종료 일자</DateTimeLabel>
          <input
            id="endDate"
            type="datetime-local"
            value={values.endDate}
            onChange={(e) => setValues({ ...values, endDate: e.target.value })}
          />
        </DateTimeControl>
        <DateTimeControl>
          <DateTimeLabel htmlFor="dueDate">기한 일자</DateTimeLabel>
          <input
            id="dueDate"
            type="datetime-local"
            value={values.dueDate}
            onChange={(e) => setValues({ ...values, dueDate: e.target.value })}
          />
        </DateTimeControl>
        <DateTimeControl>
          <DateTimeLabel htmlFor="announcementDate">공개 일자</DateTimeLabel>
          <input
            id="announcementDate"
            type="datetime-local"
            value={values.announcementDate}
            onChange={(e) =>
              setValues({ ...values, announcementDate: e.target.value })
            }
          />
        </DateTimeControl>
        <ReactQuill
          modules={modules}
          placeholder="상세 내용을 입력해주세요."
          value={content ? content : ''}
          onChange={(value) => {
            setContent(value);
          }}
        />
        {faqList && faqList.length > 0 && (
          <FAQEditor
            faqList={faqList}
            faqIdList={faqIdList}
            onFAQAdd={handleFAQAdd}
            onFAQDelete={handleFAQDelete}
            onFAQChange={handleFAQChange}
            onFAQCheckChange={handleFAQCheckChange}
          />
        )}
        <Input
          label="필독사항"
          value={values.notice ? values.notice : ''}
          name="notice"
          placeholder="필독사항을 입력하세요"
          onChange={(e: any) =>
            setValues({ ...values, notice: e.target.value })
          }
          multiline
          rows={5}
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

const DateTimeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DateTimeLabel = styled.label`
  font-weight: 500;
`;
