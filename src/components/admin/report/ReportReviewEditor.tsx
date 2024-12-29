import { Button, IconButton } from '@mui/material';
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
    console.log('리뷰:', review);
    if (review.list.length > 0 && review.list.some((ele) => !ele.profile)) {
      // profile 없는 review 모두 제거
      setReview({
        list: review.list.filter((ele) => ele.profile),
      });
      return;
    }

    setReview({
      list: [
        ...review.list,
        {
          id: Date.now(),
          title: '',
          question: '',
          answer: '',
          detail: '',
          profile: '/images/program/program_default_profile.png',
          reportName: '',
          job: '',
          name: '',
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

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Heading2>후기</Heading2>
        <Button variant="outlined" onClick={onClickAddButton}>
          추가
        </Button>
      </div>

      <div>
        {review.list &&
          review.list.length > 0 &&
          review.list[0].profile &&
          review.list.map((item) => (
            <div key={item.id} className="mb-5 flex w-full items-start gap-3">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <Input
                    label="이름"
                    name="name"
                    placeholder="이름"
                    defaultValue={item.name ?? ''}
                    onChange={(e) => onChange(e, item.id)}
                  />
                  <Input
                    label="직군"
                    name="job"
                    placeholder="직군"
                    defaultValue={item.job ?? ''}
                    onChange={(e) => onChange(e, item.id)}
                  />
                  <Input
                    label="진단 서비스 명"
                    name="reportName"
                    placeholder="진단 서비스 명"
                    defaultValue={item.reportName ?? ''}
                    onChange={(e) => onChange(e, item.id)}
                  />
                  <Input
                    label="합격여부"
                    name="title"
                    placeholder="title"
                    defaultValue={item.title ?? ''}
                    onChange={(e) => onChange(e, item.id)}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <Input
                    label="질문"
                    name="question"
                    placeholder="인터뷰 질문을 입력하세요"
                    defaultValue={item.question ?? ''}
                    onChange={(e) => onChange(e, item.id)}
                  />
                  <Input
                    label="답변"
                    name="answer"
                    placeholder="인터뷰 답변을 입력하세요"
                    defaultValue={item.answer ?? ''}
                    onChange={(e) => onChange(e, item.id)}
                  />
                  <Input
                    label="답변 상세"
                    name="detail"
                    placeholder="인터뷰 답변 상세를 입력하세요"
                    defaultValue={item.detail ?? ''}
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
