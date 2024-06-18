import { SelectChangeEvent } from '@mui/material';
import Input from '../../ui/input/Input';
import ImageUpload from '../program/ui/form/ImageUpload';

export interface OnlineContentsInputContentProps {
  value: {
    title: string;
    description: string;
    link: string;
    image: FileList | null;
  };
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<HTMLInputElement>,
  ) => void;
}

const OnlineContentsInputContent = ({
  value,
  onChange,
}: OnlineContentsInputContentProps) => {
  return (
    <>
      {/* <FormControl fullWidth>
        <InputLabel id="type">구분</InputLabel>
        <Select
          labelId="type"
          id="type"
          label="구분"
          name="type"
          value={value.type}
          onChange={onChange}
        >
          <MenuItem value="COMPANY">취업대비</MenuItem>
          <MenuItem value="DOCUMENT">서류작성</MenuItem>
          <MenuItem value="INTERVIEW">면접</MenuItem>
        </Select>
      </FormControl> */}
      <Input
        label="제목"
        name="title"
        value={value.title}
        onChange={onChange}
      />
      <Input
        label="설명"
        name="description"
        value={value.description}
        onChange={onChange}
      />
      <Input label="링크" name="link" value={value.link} onChange={onChange} />
      <ImageUpload
        label="썸네일 이미지"
        imageFormat={{ width: 500, height: 230 }}
        name="image"
        onChange={onChange}
      />
    </>
  );
};

export default OnlineContentsInputContent;
