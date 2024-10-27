import { Button, IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import { ChallengeContent } from '@/types/interface';
import { generateRandomNumber } from '@/utils/random';
import Heading3 from '@components/admin/ui/heading/Heading3';
import Input from '@components/ui/input/Input';

interface ChallengePointProps {
  challengePoint: ChallengeContent['challengePoint'];
  setContent: React.Dispatch<React.SetStateAction<ChallengeContent>>;
}

function ChallengePoint({ challengePoint, setContent }: ChallengePointProps) {
  const onClickAdd = () => {
    setContent((prev) => ({
      ...prev,
      challengePoint: [
        ...(prev.challengePoint ?? []),
        {
          id: generateRandomNumber(),
          content: '',
        },
      ],
    }));
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: ChallengeContent['challengePoint'][0],
  ) => {
    const newPoint = [...challengePoint];
    const index = challengePoint.findIndex((curr) => curr.id === target.id);
    if (index === -1) return;

    newPoint[index] = {
      ...newPoint[index],
      [e.target.name]: e.target.value,
    };
    setContent((prev) => ({ ...prev, challengePoint: newPoint }));
  };

  return (
    <>
      <div className="my-3 flex items-center justify-between">
        <Heading3>챌린지 POINT</Heading3>
        <Button variant="outlined" onClick={onClickAdd}>
          추가
        </Button>
      </div>

      <div>
        {challengePoint?.map((item) => (
          <div className="mb-3 flex items-center" key={item.id}>
            <Input
              label="내용"
              name="content"
              value={item.content}
              placeholder="내용을 입력하세요"
              onChange={(e) => onChange(e, item)}
            />
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                setContent((prev) => ({
                  ...prev,
                  challengePoint: prev.challengePoint.filter(
                    (point) => point.id !== item.id,
                  ),
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

export default ChallengePoint;
