'use client';

import { BannerItemType, usePostBannerForAdmin } from '@/api/banner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBarBannerInputContent from '@/components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';

const TopBarBannerCreate = () => {
  const navigate = useNavigate();

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
      navigate('/admin/banner/top-bar-banners');
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
