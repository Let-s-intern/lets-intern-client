import dayjs from '@/lib/dayjs';
import { generateUuid } from '@/utils/random';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Heading from '@components/admin/ui/heading/Heading';
import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';

const mockData = {
  id: generateUuid(),
  title: '메인 배너 제목입니다3',
  url: 'https://www.naver.com/',
  isVisible: true,
  startDate: '2025-02-14T13:29:26',
  endDate: '2025-04-26T13:29:26',
  thumbnail: 'https://www.letscareer.co.kr/images/home/intro2.png',
};

const BlogBannerEditPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-5">
      <Heading className="mb-5">블로그 광고 배너 수정</Heading>
      <div className="w-1/2">
        <div className="mb-5 flex gap-3">
          <TextField
            className="w-full"
            variant="outlined"
            name="title"
            required
            label="제목"
            placeholder="제목을 입력하세요"
            value={mockData.title}
          />
          <TextField
            className="w-full"
            variant="outlined"
            name="url"
            required
            label="링크"
            placeholder="링크를 입력하세요"
            value={mockData.url}
          />
        </div>
        <ImageUpload
          label="배너 이미지 업로드"
          id="file"
          name="file"
          image={mockData.thumbnail}
        />
        <div className="my-5 flex gap-3">
          <DateTimePicker
            className="w-full"
            label="시작 일자"
            name="startDate"
            value={dayjs(mockData.startDate)}
          />
          <DateTimePicker
            className="w-full"
            label="종료 일자"
            name="endDate"
            value={dayjs(mockData.endDate)}
          />
        </div>
        <div className="flex w-full justify-end gap-5">
          <Button variant="contained" onClick={() => alert('수정되었습니다.')}>
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

export default BlogBannerEditPage;
