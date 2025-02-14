import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Heading from '@components/admin/ui/heading/Heading';
import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';

const BlogBannerCreatePage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <Heading className="mb-5">블로그 광고 배너 등록</Heading>
      <div className="w-1/2">
        <div className="mb-5 flex gap-3">
          <TextField
            className="w-full"
            variant="outlined"
            name="title"
            required
            label="제목"
            placeholder="제목을 입력하세요"
          />
          <TextField
            className="w-full"
            variant="outlined"
            name="url"
            required
            label="링크"
            placeholder="링크를 입력하세요"
          />
        </div>
        <ImageUpload label="배너 이미지 업로드" id="file" name="file" />
        <div className="my-5 flex gap-3">
          <DateTimePicker
            className="w-full"
            label="시작 일자"
            name="startDate"
          />
          <DateTimePicker className="w-full" label="종료 일자" name="endDate" />
        </div>
        <div className="flex w-full justify-end gap-5">
          <Button variant="contained" onClick={() => alert('등록되었습니다.')}>
            저장
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/blog/banner')}
          >
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogBannerCreatePage;
