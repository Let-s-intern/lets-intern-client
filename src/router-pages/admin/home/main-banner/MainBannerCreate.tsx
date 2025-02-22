import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import MainBannerInputContent from '../../../../components/admin/banner/main-banner/MainBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { IBannerForm } from '../../../../types/Banner.interface';
import axios from '../../../../utils/axios';

const MainBannerCreate = () => {
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
      navigate('/admin/home/main-banners');
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
    <EditorTemplate
      title="메인 배너 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <MainBannerInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default MainBannerCreate;
