import { Button, IconButton } from '@mui/material';
import { IoMdCloseCircleOutline } from 'react-icons/io';

import { fileType, uploadFile } from '@/api/file';
import Input from '@/common/input/Input';
import { ReportExample } from '@/types/interface';
import ImageUpload from '../program/ui/form/ImageUpload';
import Heading2 from '../ui/heading/Heading2';

interface ReportExampleEditorProps {
  reportExample: ReportExample;
  setReportExample: (value: ReportExample) => void;
}

function ReportExampleEditor({
  reportExample,
  setReportExample,
}: ReportExampleEditorProps) {
  const onClickAddButton = () => {
    setReportExample({
      list: [
        ...reportExample.list,
        { id: Date.now(), subTitle: '', imgUrl: '' },
      ],
    });
  };

  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <Heading2>리포트 예시</Heading2>
        <Button variant="outlined" onClick={onClickAddButton}>
          추가
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {reportExample.list.map((item) => (
          <div key={item.id} className="flex w-full flex-col items-end gap-3">
            <IconButton
              aria-label="delete"
              color="error"
              onClick={() => {
                // 레포트 예시 삭제
                setReportExample({
                  list: reportExample.list.filter((ele) => ele.id !== item.id),
                });
              }}
            >
              <IoMdCloseCircleOutline />
            </IconButton>
            <Input
              label="부제목"
              name="subTitle"
              placeholder="부제목을 입력하세요"
              defaultValue={item.subTitle}
              onChange={(e) => {
                const list = reportExample.list;
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

                setReportExample({ list: newList });
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
                const list = reportExample.list;
                const index = list.findIndex((ele) => ele.id === item.id);

                list[index].imgUrl = imgUrl;

                const newList = [
                  ...list.slice(0, index),
                  list[index],
                  ...list.slice(index + 1),
                ];

                setReportExample({ list: newList });
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ReportExampleEditor;
