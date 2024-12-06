import { Button, IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import { ReportContent, ReportReview } from '@/types/interface';
import Input from '@components/ui/input/Input';
import { Heading2 } from '../ui/heading/Heading2';

interface ReportReviewEditorProps {
  review: ReportContent['review'];
  setReview: (state: ReportReview) => void;
}

function ReportReviewEditor({ review, setReview }: ReportReviewEditorProps) {
  const onClickAddButton = () => {
    setReview({
      list: [...review.list, { id: Date.now(), title: '', content: '' }],
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
        {review.list.map((item) => (
          <div key={item.id} className="mb-5 flex w-full items-start gap-3">
            <Input
              label="제목"
              name="title"
              placeholder="제목을 입력하세요"
              defaultValue={item.title}
              onChange={(e) => onChange(e, item.id)}
            />
            <Input
              label="내용"
              name="content"
              placeholder="내용을 입력하세요"
              defaultValue={item.content}
              onChange={(e) => onChange(e, item.id)}
            />

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
