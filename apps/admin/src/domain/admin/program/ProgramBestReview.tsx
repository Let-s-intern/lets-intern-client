import Input from '@/common/input/v1/Input';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import { ContentReviewType } from '@/types/interface';
import { Button, IconButton, TextField } from '@mui/material';
import { MdDelete } from 'react-icons/md';

interface ProgramBestReviewProps {
  reviewFields: ContentReviewType[];
  setReviewFields: (reviewFields: ContentReviewType[]) => void;
}

const ProgramBestReview = ({
  reviewFields,
  setReviewFields,
}: ProgramBestReviewProps) => {
  return (
    <section className="flex w-full flex-col gap-y-4 py-8">
      <div className="flex w-full items-center justify-between">
        <Heading2>후기</Heading2>
        <Button
          variant="outlined"
          onClick={() =>
            setReviewFields([
              ...reviewFields,
              {
                name: '',
                programName: '',
                passedState: '',
                title: '',
                content: '',
                score: undefined,
                npsScore: undefined,
              },
            ])
          }
        >
          추가
        </Button>
      </div>
      <div className="flex w-full flex-col gap-y-2">
        {reviewFields.length >= 1 &&
          reviewFields.map((_, index) => {
            const hasScore =
              reviewFields[index].score != null ||
              reviewFields[index].npsScore != null;
            return (
              <div key={index} className="flex w-full gap-x-4">
                <Input
                  label="이름"
                  size="small"
                  value={reviewFields[index].name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviewFields(
                      reviewFields.map((field, i) => {
                        if (i === index) {
                          return { ...field, name: value };
                        }
                        return field;
                      }),
                    );
                  }}
                />
                <Input
                  label="참여 프로그램명"
                  size="small"
                  value={reviewFields[index].programName}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviewFields(
                      reviewFields.map((field, i) => {
                        if (i === index) {
                          return { ...field, programName: value };
                        }
                        return field;
                      }),
                    );
                  }}
                />
                <Input
                  label="합격현황"
                  size="small"
                  disabled={hasScore}
                  value={reviewFields[index].passedState}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviewFields(
                      reviewFields.map((field, i) => {
                        if (i === index) {
                          return { ...field, passedState: value };
                        }
                        return field;
                      }),
                    );
                  }}
                />
                <Input
                  label="제목"
                  size="small"
                  value={reviewFields[index].title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviewFields(
                      reviewFields.map((field, i) => {
                        if (i === index) {
                          return { ...field, title: value };
                        }
                        return field;
                      }),
                    );
                  }}
                />
                <Input
                  label="내용"
                  size="small"
                  value={reviewFields[index].content}
                  onChange={(e) => {
                    const value = e.target.value;
                    setReviewFields(
                      reviewFields.map((field, i) => {
                        if (i === index) {
                          return { ...field, content: value };
                        }
                        return field;
                      }),
                    );
                  }}
                />
                <TextField
                  label="만족도 점수"
                  size="small"
                  type="number"
                  fullWidth
                  value={reviewFields[index].score ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number(e.target.value)
                      : undefined;
                    setReviewFields(
                      reviewFields.map((field, i) =>
                        i === index
                          ? { ...field, score: value, passedState: '' }
                          : field,
                      ),
                    );
                  }}
                />
                <TextField
                  label="NPS 점수"
                  size="small"
                  type="number"
                  fullWidth
                  value={reviewFields[index].npsScore ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                      ? Number(e.target.value)
                      : undefined;
                    setReviewFields(
                      reviewFields.map((field, i) =>
                        i === index
                          ? { ...field, npsScore: value, passedState: '' }
                          : field,
                      ),
                    );
                  }}
                />
                <IconButton
                  color="warning"
                  sx={{ border: '1px solid red', borderRadius: '10%' }}
                  onClick={() => {
                    // 전체 삭제 허용: 0개가 되면 어드민 재진입 시 자동 채우기가 재실행됨
                    // if (reviewFields.length === 1) return;
                    setReviewFields(reviewFields.filter((_, i) => i !== index));
                  }}
                >
                  <MdDelete />
                </IconButton>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default ProgramBestReview;
