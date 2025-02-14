import { IBannerForm } from '@/types/Banner.interface';
import axios from '@/utils/axios';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Heading from '@components/admin/ui/heading/Heading';
import { Button, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogBannerCreatePage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<IBannerForm>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
    mobileFile: null,
  });

  const addMainBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/banner', formData, {
        params: {
          type: 'MAIN',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/banner/main-banners');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue({ ...value, [e.target.name]: e.target.files[0] });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value.file || !value.mobileFile) return;

    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob(
        [
          JSON.stringify({
            title: value.title,
            link: value.link,
            startDate: value.startDate,
            endDate: value.endDate,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    formData.append('file', value.file);
    formData.append('mobileFile', value.mobileFile);

    addMainBanner.mutate(formData);
  };

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
