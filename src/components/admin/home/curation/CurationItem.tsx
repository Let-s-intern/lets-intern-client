import {
  CurationItemType,
  CurationType,
  CurationTypeValues,
} from '@/api/curation';
import { fileType, uploadFile } from '@/api/file';
import { convertCurationTypeToText } from '@/utils/convert';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Input from '@components/ui/input/Input';
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface CurationItemProps {
  item: CurationItemType;
  onChangeItem: (item: CurationItemType) => void;
}

const CurationItem = ({ item, onChangeItem }: CurationItemProps) => {
  const [selectedTitle, setSelectedTitle] = useState<string>(item.title || '');

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.BANNER_MAIN,
    });
    onChangeItem({ ...item, thumbnail: url });
  };

  return (
    <div className="flex w-full gap-x-5">
      <FormControl size="small" className="w-[200px]">
        <InputLabel id="curationType">큐레이션 분류</InputLabel>
        <Select
          labelId="curationType"
          label="큐레이션 분류"
          id="curationType"
          name="curationType"
          defaultValue={item.curationType}
          onChange={(e) => {
            const value = e.target.value as CurationType;
            onChangeItem({ ...item, curationType: value });
          }}
        >
          {CurationTypeValues.map((curationType) => (
            <MenuItem key={curationType} value={curationType}>
              {convertCurationTypeToText(curationType)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {item.curationType !== 'ETC' ? (
        <Button variant="outlined" className="w-52">
          프로그램 선택
        </Button>
      ) : (
        <div className="flex flex-1 items-center gap-x-5">
          <Box className="flex h-full w-52 items-center justify-center overflow-hidden rounded-xs bg-neutral-90">
            <ImageUpload
              label="썸네일"
              image={item.thumbnail}
              onChange={onChangeImage}
              simpleMode
            />
          </Box>
          <div className="flex flex-1 flex-col gap-y-2.5">
            <Input
              label="제목"
              type="text"
              name="title"
              placeholder="제목을 입력하세요"
              size="small"
              value={selectedTitle}
              onChange={(e) => setSelectedTitle(e.target.value)}
            />
            <Input
              label="url"
              type="text"
              name="url"
              placeholder="URL을 입력하세요"
              size="small"
            />
          </div>
        </div>
      )}
      <div className="my-auto flex w-fit items-center justify-center">
        <IconButton size="small" onClick={() => onChangeItem(item)}>
          <Trash size={24} color="red" />
        </IconButton>
      </div>
    </div>
  );
};

export default CurationItem;
