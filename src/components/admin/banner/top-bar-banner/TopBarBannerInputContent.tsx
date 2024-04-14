import Input from '../../../ui/input/Input';
import DateTimePicker from '../../program/ui/form/DateTimePicker';

const TopBarBannerInputContent = () => {
  return (
    <>
      <Input label="제목" name="title" />
      <Input label="노출 문구" name="description" />
      <Input label="링크" name="link" />
      <DateTimePicker label="시작 일자" id="startDate" name="startDate" />
      <DateTimePicker label="종료 일자" id="endDate" name="endDate" />
    </>
  );
};

export default TopBarBannerInputContent;
