'use client';

import { BannerItemType } from '@/api/banner';
import { useCreateProgramBannerMutation } from '@/api/program';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgramBannerInputContent from '@/components/admin/banner/program-banner/ProgramBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';

const ProgramBannerCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    mobileImgUrl: '',
    file: null,
    mobileFile: null,
  });

  const { mutate: tryCreateProgramBanner } = useCreateProgramBannerMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/banner/program-banners');
    },
    onError: (error) => {
      console.error(error);
      alert('프로그램 배너 등록에 실패했습니다.');
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

    tryCreateProgramBanner(formData);
  };

  return (
    <EditorTemplate
      title="프로그램 배너 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <ProgramBannerInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default ProgramBannerCreate;
