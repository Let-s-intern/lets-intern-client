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
import CurationSelectModal from './CurationSelectModal';

interface CurationItemProps {
  item: CurationItemType;
  onChangeItem: (item: CurationItemType) => void;
  onDeleteItem: () => void;
}

const CurationItem = ({
  item,
  onChangeItem,
  onDeleteItem,
}: CurationItemProps) => {
  const [modalType, setModalType] = useState<CurationType | null>(null);

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.CURATION_ITEM,
    });
    onChangeItem({ ...item, thumbnail: url });
  };

  return (
    <>
      <div className="flex w-full gap-x-5">
        <FormControl size="small" className="w-[200px]">
          <InputLabel id="curationType">큐레이션 분류</InputLabel>
          <Select
            labelId="curationType"
            label="큐레이션 분류"
            id="curationType"
            name="curationType"
            value={item.programType}
            onChange={(e) => {
              const value = e.target.value as CurationType;
              onChangeItem({
                ...item,
                programType: value,
                programId: undefined,
                title: undefined,
                url: undefined,
                thumbnail: undefined,
              });
            }}
          >
            {CurationTypeValues.map((curationType) => (
              <MenuItem key={curationType} value={curationType}>
                {convertCurationTypeToText(curationType)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {item.programType !== 'ETC' && item.programType !== 'VOD' ? (
          <Button
            variant="outlined"
            className="line-clamp-1 min-w-[200px]"
            onClick={() => setModalType(item.programType)}
          >
            {item.title ||
              `${convertCurationTypeToText(item.programType)} 선택`}
          </Button>
        ) : item.programType === 'VOD' ? (
          <div className="flex flex-1 items-center gap-x-5">
            <Button
              variant="outlined"
              className="line-clamp-1 min-w-[200px]"
              onClick={() => setModalType(item.programType)}
            >
              {item.title ||
                `${convertCurationTypeToText(item.programType)} 선택`}
            </Button>
            <Input
              label="tag"
              type="text"
              name="tag"
              placeholder="태그를 입력하세요"
              size="small"
              value={item.tag}
              onChange={(e) => onChangeItem({ ...item, tag: e.target.value })}
            />
          </div>
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
                value={item.title}
                onChange={(e) =>
                  onChangeItem({ ...item, title: e.target.value })
                }
              />
              <Input
                label="url"
                type="text"
                name="url"
                placeholder="latest:{text}로 설정하면, 텍스트를 제목에 포함하는 챌린지 상세페이지로 이동합니다."
                size="small"
                value={item.url}
                onChange={(e) => onChangeItem({ ...item, url: e.target.value })}
              />
              <Input
                label="tag"
                type="text"
                name="tag"
                placeholder="태그를 입력하세요"
                size="small"
                value={item.tag}
                onChange={(e) => onChangeItem({ ...item, tag: e.target.value })}
              />
            </div>
          </div>
        )}
        <div className="my-auto flex w-fit items-center justify-center">
          <IconButton size="small" onClick={onDeleteItem}>
            <Trash size={24} color="red" />
          </IconButton>
        </div>
      </div>
      <CurationSelectModal
        isOpen={modalType !== null}
        type={modalType}
        onSelect={({ id, title }) => {
          onChangeItem({ ...item, programId: id, title });
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />
    </>
  );
};

export default CurationItem;
