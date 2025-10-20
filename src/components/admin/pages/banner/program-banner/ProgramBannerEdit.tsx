'use client';

import { BannerItemType } from '@/api/banner';
import {
  useEditProgramBannerMutation,
  useGetProgramBannerDetailQuery,
} from '@/api/program';
import ProgramBannerInputContent from '@/components/admin/banner/program-banner/ProgramBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProgramBannerEdit = () => {
  const { bannerId } = useParams<{ bannerId: string }>();
  const router = useRouter();

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

  const { data } = useGetProgramBannerDetailQuery(Number(bannerId));

  useEffect(() => {
    if (data) {
      const value = data.bannerAdminDetailVo;
      setValue({
        title: value.title,
        link: value.link,
        startDate: value.startDate,
        endDate: value.endDate,
        imgUrl: value.imgUrl,
        mobileImgUrl: value.mobileImgUrl,
        file: null,
        mobileFile: null,
      });
    }
  }, [data]);

  const { mutate: tryEditProgramBanner } = useEditProgramBannerMutation({
    onSuccess: async () => {
      router.replace('/admin/banner/program-banners');
    },
    onError: (error) => {
      console.error(error);
      alert('프로그램 배너 수정에 실패했습니다.');
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
    if (value.file) {
      formData.append('file', value.file);
    }
    if (value.mobileFile) {
      formData.append('mobileFile', value.mobileFile);
    }

    tryEditProgramBanner({
      bannerId: Number(bannerId),
      formData,
    });
  };

  return (
    <EditorTemplate
      title="프로그램 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
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

export default ProgramBannerEdit;
