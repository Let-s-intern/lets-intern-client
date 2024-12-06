import { Button, IconButton } from '@mui/material';
import { MdDelete } from 'react-icons/md';

import { fileType, uploadFile } from '@/api/file';
import { ReportContent } from '@/types/interface';
import Input from '@components/ui/input/Input';
import ImageUpload from '../program/ui/form/ImageUpload';
import { Heading2 } from '../ui/heading/Heading2';

interface ReportExampleProps {
  reportExample: ReportContent['reportExample'];
  setContent: React.Dispatch<React.SetStateAction<ReportContent>>;
}

function ReportExample({ reportExample, setContent }: ReportExampleProps) {
  const onClickAddButton = () => {
    setContent((prev) => ({
      ...prev,
      reportExample: {
        list: [
          ...prev.reportExample.list,
          { id: Date.now(), subTitle: '', imgUrl: '' },
        ],
      },
    }));
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Heading2>리포트 예시</Heading2>
        <Button variant="outlined" onClick={onClickAddButton}>
          추가
        </Button>
      </div>

      <div>
        {reportExample.list.map((item) => (
          <div key={item.id} className="mb-5 flex w-full items-start gap-3">
            <Input
              label="부제목"
              name="subTitle"
              placeholder="부제목을 입력하세요"
              defaultValue={item.subTitle}
              onChange={(e) => {
                setContent((prev) => {
                  const list = prev.reportExample.list;
                  const index = list.findIndex((ele) => ele.id === item.id);
                  const newItem = {
                    ...list[index],
                    subTitle: e.target.value,
                  };

                  const newList = [
                    ...list.slice(0, index),
                    newItem,
                    ...list.slice(index + 1),
                  ];

                  return { ...prev, reportExample: { list: newList } };
                });
              }}
            />
            <ImageUpload
              label="레포트 예시 이미지"
              id="imgUrl"
              name="imgUrl"
              image={item.imgUrl}
              onChange={async (e) => {
                if (!e.target.files) return;

                const imgUrl = await uploadFile({
                  file: e.target.files[0],
                  type: fileType.enum.REPORT,
                });

                setContent((prev) => {
                  const list = prev.reportExample.list;
                  const index = list.findIndex((ele) => ele.id === item.id);
                  list[index].imgUrl = imgUrl;

                  const newList = [
                    ...list.slice(0, index),
                    list[index],
                    ...list.slice(index + 1),
                  ];

                  return { ...prev, reportExample: { list: newList } };
                });
              }}
            />
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                // 레포트 예시 삭제
                setContent((prev) => ({
                  ...prev,
                  reportExample: {
                    list: prev.reportExample.list.filter(
                      (ele) => ele.id !== item.id,
                    ),
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

export default ReportExample;
