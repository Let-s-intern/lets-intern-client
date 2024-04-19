import OnlineContentsInputContent, {
  OnlineContentsInputContentProps,
} from '../../../components/admin/online-contents/OnlineContentsInputContent';
import EditorTemplate from '../../../components/admin/program/ui/editor/EditorTemplate';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';

const OnlineContentsEdit = () => {
  const [value, setValue] = useState<OnlineContentsInputContentProps['value']>({
    title: '',
    description: '',
    link: '',
    image: null,
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent<HTMLInputElement>,
  ) => {
    if ((e.target as HTMLInputElement).files) {
      setValue({ ...value, image: (e.target as HTMLInputElement).files });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <EditorTemplate
      title="상시 콘텐츠 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <OnlineContentsInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default OnlineContentsEdit;
