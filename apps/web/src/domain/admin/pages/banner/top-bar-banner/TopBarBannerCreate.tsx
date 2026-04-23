'use client';

import { BannerItemType, usePostBannerForAdmin } from '@/api/banner';
import TopBarBannerInputContent from '@/domain/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const TopBarBannerCreate = () => {
  const router = useRouter();

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    contents: '',
    link: '',
    startDate: '',
    endDate: '',
    textColorCode: '#000000',
    colorCode: '#000000',
  });

  const { mutate: addTopBarBanner } = usePostBannerForAdmin({
    successCallback: () => {
      alert('상단 띠 배너가 등록되었습니다.');
      router.push('/admin/banner/top-bar-banners');
    },
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
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
            contents: value.contents,
            colorCode: value.colorCode,
            textColorCode: value.textColorCode,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    formData.append('file', new Blob([], { type: 'application/json' }));

    addTopBarBanner({ type: 'LINE', formData });
  };

  return (
    <EditorTemplate
      title="상단 띠 배너 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <TopBarBannerInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default TopBarBannerCreate;
