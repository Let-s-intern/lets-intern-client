import { BannerItemType, usePostBannerForAdmin } from '@/api/banner';
import TopBarBannerInputContent from '@/domain/admin/banner/top-bar-banner/TopBarBannerInputContent';
import { toUploadFile } from '@/domain/admin/banner/top-bar-banner/toUploadFile';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
    imageLink: '',
  });

  const { mutate: addTopBarBanner } = usePostBannerForAdmin({
    successCallback: () => {
      alert('상단 띠 배너가 등록되었습니다.');
      navigate('/banner/top-bar-banners');
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
            imageLink: value.imageLink,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    // 서버가 file 파트를 필수로 받아 이미지가 없으면 빈 파일을 보낸다
    formData.append(
      'file',
      value.file
        ? toUploadFile(value.file)
        : new Blob([], { type: 'application/json' }),
    );
    if (value.mobileFile) {
      formData.append('mobileFile', toUploadFile(value.mobileFile));
    }

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
      <TopBarBannerInputContent
        value={value}
        onChange={handleChange}
        onImageChange={(image) => setValue({ ...value, ...image })}
      />
    </EditorTemplate>
  );
};

export default TopBarBannerCreate;
