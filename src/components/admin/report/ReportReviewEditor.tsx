import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { MdDelete } from 'react-icons/md';

import { ReportContent, ReportReview } from '@/types/interface';
import Input from '@components/ui/input/Input';
import Heading2 from '../ui/heading/Heading2';

interface ReportReviewEditorProps {
  review: ReportContent['review'];
  setReview: (state: ReportReview) => void;
}

function ReportReviewEditor({ review, setReview }: ReportReviewEditorProps) {
  const onClickAddButton = () => {
    setReview({
      list: [
        ...review.list,
        {
          id: Date.now(),
          name: '',
          job: '',
          reportName: '',
          company: '',
          isSuccessful: false,
          question: '',
          answer: '',
          detail: '',
        },
      ],
    });
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number,
  ) => {
    const list = review.list;
    const index = list.findIndex((ele) => ele.id === id);
    const newItem = {
      ...list[index],
      [e.target.name]: e.target.value,
    };
    const newList = [
      ...list.slice(0, index),
      newItem,
      ...list.slice(index + 1),
    ];

    setReview({
      list: newList,
    });
  };

  const onChangeIsSuccessFul = (value: boolean, id: string | number) => {
    const list = review.list;
    const index = list.findIndex((ele) => ele.id === id);
    const newItem = {
      ...list[index],
      ['isSuccessful']: value,
    };
    const newList = [
      ...list.slice(0, index),
      newItem,
      ...list.slice(index + 1),
    ];

    setReview({
      list: newList,
    });
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Heading2>후기</Heading2>
        <Button variant="outlined" onClick={onClickAddButton}>
          추가
        </Button>
      </div>

      <div>
        {review.list.map((item) => (
          <div key={item.id} className="mb-5 flex w-full items-start gap-3">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <Input
                  label="이름"
                  name="name"
                  placeholder="이름"
                  defaultValue={item.name}
                  onChange={(e) => onChange(e, item.id)}
                />
                <Input
                  label="직군"
                  name="job"
                  placeholder="직군"
                  defaultValue={item.job}
                  onChange={(e) => onChange(e, item.id)}
                />
                <Input
                  label="진단 서비스 명"
                  name="reportName"
                  placeholder="진단 서비스 명"
                  defaultValue={item.reportName}
                  onChange={(e) => onChange(e, item.id)}
                />
                <Input
                  label="지원회사"
                  name="company"
                  placeholder="지원회사"
                  defaultValue={item.company}
                  onChange={(e) => onChange(e, item.id)}
                />
                <FormControl size="medium" className="w-24 shrink-0">
                  <InputLabel>합격여부</InputLabel>
                  <Select
                    label="합격여부"
                    name="isSuccessful"
                    placeholder="합격여부"
                    defaultValue={item.isSuccessful ? 'true' : 'false'}
                    onChange={(e) => {
                      const value = e.target.value === 'true';
                      onChangeIsSuccessFul(value, item.id);
                    }}
                  >
                    <MenuItem value="true">합격</MenuItem>
                    <MenuItem value="false">불합격</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="flex flex-col gap-3">
                <Input
                  label="질문"
                  name="question"
                  placeholder="질문을 입력하세요"
                  defaultValue={item.question}
                  onChange={(e) => onChange(e, item.id)}
                />
                <Input
                  label="답변"
                  name="answer"
                  placeholder="답변을 입력하세요"
                  defaultValue={item.answer}
                  onChange={(e) => onChange(e, item.id)}
                />
                <Input
                  label="답변 상세"
                  name="detail"
                  placeholder="답변 상세를 입력하세요"
                  defaultValue={item.detail}
                  onChange={(e) => onChange(e, item.id)}
                />
              </div>
            </div>

            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                // 후기 삭제
                setReview({
                  list: review.list.filter((ele) => ele.id !== item.id),
                });
              }}
            >
              <MdDelete />
            </IconButton>
          </div>
        ))}
      </div>
    </>
  );
}

export default ReportReviewEditor;
