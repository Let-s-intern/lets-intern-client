import { useState } from 'react';
import ProgramBannerInputContent, {
  ProgramBannerInputContentProps,
} from '../../../../components/admin/banner/program-banner/ProgramBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';

const ProgramBannerEdit = () => {
  const [value, setValue] = useState<ProgramBannerInputContentProps['value']>({
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
