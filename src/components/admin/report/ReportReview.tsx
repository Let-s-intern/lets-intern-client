import { Button, IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import { ReportContent } from '@/types/interface';
import Input from '@components/ui/input/Input';
import { Heading2 } from '../ui/heading/Heading2';

interface ReportReviewProps {
  review: ReportContent['review'];
  setContent: React.Dispatch<React.SetStateAction<ReportContent>>;
}

function ReportReview({ review, setContent }: ReportReviewProps) {
  const onClickAddButton = () => {
    setContent((prev) => ({
      ...prev,
      review: {
        list: [...prev.review.list, { id: Date.now(), title: '', content: '' }],
      },
    }));
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string | number,
  ) => {
    setContent((prev) => {
      const list = prev.review.list;
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

      return { ...prev, review: { list: newList } };
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
                setContent((prev) => ({
                  ...prev,
                  review: {
                    list: prev.review.list.filter((ele) => ele.id !== item.id),
                  },
                }));
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

export default ReportReview;
