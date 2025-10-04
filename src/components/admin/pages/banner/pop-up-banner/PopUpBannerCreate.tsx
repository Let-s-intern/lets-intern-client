'use client';

import { useState } from 'react';

import { BannerItemType, usePostBannerForAdmin } from '@/api/banner';
import PopUpBannerInputContent from '@/components/admin/banner/pop-up-banner/PopUpBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';
import { useRouter } from 'next/navigation';

const PopUpBannerCreate = () => {
  const router = useRouter();

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
  });

  const { mutate: addPopUpBanner } = usePostBannerForAdmin({
    successCallback: () => {
      alert('팝업이 등록되었습니다.');
      router.push('/admin/banner/pop-up');
    },
    errorCallback: (error) => {
      alert(error);
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

    if (!value.file) return;

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

    addPopUpBanner({ type: 'POPUP', formData });
  };

  return (
    <EditorTemplate
      title="팝업 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <PopUpBannerInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default PopUpBannerCreate;
