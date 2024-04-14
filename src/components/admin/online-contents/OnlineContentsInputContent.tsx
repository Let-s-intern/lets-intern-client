import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Input from '../../ui/input/Input';
import DateTimePicker from '../program/ui/form/DateTimePicker';
import ImageUploader from '../program/ui/form/ImageUploader';

const OnlineContentsInputContent = () => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="type">구분</InputLabel>
        <Select labelId="type" id="type" label="구분">
          <MenuItem value="COMPANY">취업대비</MenuItem>
          <MenuItem value="DOCUMENT">서류작성</MenuItem>
          <MenuItem value="INTERVIEW">면접</MenuItem>
        </Select>
      </FormControl>
      <Input label="제목" name="title" />
      <Input label="설명" name="description" />
      <Input label="링크" name="link" />
      <ImageUploader
        label="썸네일 이미지"
        imageFormat={{ width: 500, height: 230 }}
      />
    </>
  );
};

export default OnlineContentsInputContent;
