import { useState } from 'react';

import MainBannerInputContent, {
  MainBannerInputContentProps,
} from '../../../../components/admin/banner/main-banner/MainBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';

const MainBannerEdit = () => {
  const [value, setValue] = useState<MainBannerInputContentProps['value']>({
    type: 'MAIN',
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    image: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue({ ...value, image: e.target.files });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="메인 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
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

export default MainBannerEdit;
