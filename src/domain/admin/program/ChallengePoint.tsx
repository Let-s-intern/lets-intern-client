import { Button, IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import Input from '@/common/input/Input';
import Heading3 from '@/domain/admin/ui/heading/Heading3';
import { ChallengeContent, ChallengePoint } from '@/types/interface';
import { generateRandomNumber } from '@/utils/random';

interface ChallengePointProps {
  challengePoint?: ChallengePoint;
  setContent: React.Dispatch<React.SetStateAction<ChallengeContent>>;
}

function ChallengePointEditor({
  challengePoint = {},
  setContent,
}: ChallengePointProps) {
  const onClickAdd = () => {
    setContent((prev) => ({
      ...prev,
      challengePoint: {
        ...prev?.challengePoint,
        list: [
          ...(prev?.challengePoint?.list ?? []),
          {
            id: generateRandomNumber(),
            title: '제목',
            subtitle: '내용',
          },
        ],
      },
    }));
  };

  return (
    <div className="mb-6 border-b pb-6">
      <div className="my-3 flex items-center justify-between">
        <Heading3>챌린지 POINT</Heading3>
        <Button variant="outlined" onClick={onClickAdd}>
          추가
        </Button>
      </div>
      <div className="my-3 flex items-center gap-2">
        <span>하루 30분, </span>
        <Input
          label="텍스트"
          defaultValue={challengePoint.weekText}
          className="w-24"
          fullWidth={false}
          size="small"
          onChange={(e) => {
            setContent((prev) => ({
              ...prev,
              challengePoint: {
                ...prev.challengePoint,
                weekText: e.target.value,
              },
            }));
          }}
        ></Input>
        <span>안에 얻을 수 있는 것</span>
      </div>

      <div>
        {challengePoint.list?.map((item) => (
          <div className="mb-3 flex items-center gap-1" key={item.id}>
            <Input
              label="내용"
              name="title"
              size="small"
              defaultValue={item.title}
              placeholder="내용을 입력하세요"
              onChange={(e) => {
                setContent((prev) => ({
                  ...prev,
                  challengePoint: {
                    ...prev.challengePoint,
                    list: prev.challengePoint.list?.map((point) =>
                      point.id === item.id
                        ? { ...point, title: e.target.value }
                        : point,
                    ),
                  },
                }));
              }}
            />
            <Input
              label="부내용"
              name="subtitle"
              size="small"
              defaultValue={item.subtitle}
              placeholder="내용을 입력하세요"
              onChange={(e) => {
                setContent((prev) => ({
                  ...prev,
                  challengePoint: {
                    ...prev.challengePoint,
                    list: prev.challengePoint.list?.map((point) =>
                      point.id === item.id
                        ? { ...point, subtitle: e.target.value }
                        : point,
                    ),
                  },
                }));
              }}
            />
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                setContent((prev) => ({
                  ...prev,
                  challengePoint: {
                    ...prev.challengePoint,
                    list: prev.challengePoint.list?.filter(
                      (point) => point.id !== item.id,
                    ),
                  },
                }));
              }}
            >
              <MdDelete size={16} />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengePointEditor;
