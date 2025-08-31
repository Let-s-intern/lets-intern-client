import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { BannerItemType, usePostBannerForAdmin } from '@/api/banner';
import MainBannerInputContent from '@/components/admin/home/main-banner/MainBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';

const MainBannerCreate = () => {
  const router = useRouter();

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
    mobileFile: null,
  });

  const { mutate: addMainBanner } = usePostBannerForAdmin({
    successCallback: () => {
      alert('홈 상단 배너가 등록되었습니다.');
      router.push('/admin/home/main-banners');
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

    addMainBanner({ type: 'MAIN', formData });
  };

  return (
    <EditorTemplate
      title="홈 상단 배너 등록"
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
