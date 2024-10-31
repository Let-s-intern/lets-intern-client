import { Button, IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import { LiveContent } from '@/types/interface';
import { generateRandomNumber } from '@/utils/random';
import OutlinedTextarea from '@components/admin/OutlinedTextarea';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import Input from '@components/ui/input/Input';

interface LiveCurriculumProps {
  curriculum: LiveContent['curriculum'];
  setContent: React.Dispatch<React.SetStateAction<LiveContent>>;
}

function LiveCurriculum({ curriculum, setContent }: LiveCurriculumProps) {
  const onClickAdd = () => {
    setContent((prev) => ({
      ...prev,
      curriculum: [
        ...prev.curriculum,
        {
          id: generateRandomNumber(),
          time: '',
          title: '',
          content: '',
        },
      ],
    }));
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    target: LiveContent['curriculum'][0],
  ) => {
    console.log(e);
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
      <div>
        {curriculum.map((item) => (
          <div className="mb-3 flex items-center gap-2" key={item.id}>
            <div>
              <Input
                label="시간"
                name="time"
                placeholder="시간를 입력하세요(예:10분)"
                value={item.time}
                onChange={(e) => onChange(e, item)}
              />
            </div>
            <OutlinedTextarea
              className="h-[60px] w-3/12"
              name="title"
              placeholder="제목을 입력하세요"
              value={item.title}
              onChange={(e) => onChange(e, item)}
            />
            <OutlinedTextarea
              className="h-[60px] flex-1"
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
                  curriculum: prev.curriculum.filter(
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
    </>
  );
}

export default LiveCurriculum;
