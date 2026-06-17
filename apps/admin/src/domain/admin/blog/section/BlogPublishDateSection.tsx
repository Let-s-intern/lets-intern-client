import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Dayjs } from 'dayjs';

interface BlogPublishDateSectionProps {
  dateTime: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
}

const BlogPublishDateSection = ({
  dateTime,
  onChange,
}: BlogPublishDateSectionProps) => {
  return (
    <div className="border px-6 py-10">
      <h2 className="mb-2">게시 일자</h2>
      <DateTimePicker label="게시 일자" value={dateTime} onChange={onChange} />
    </div>
  );
};

export default BlogPublishDateSection;
