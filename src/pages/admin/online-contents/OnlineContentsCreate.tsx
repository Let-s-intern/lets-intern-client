import { SelectChangeEvent } from '@mui/material';
import OnlineContentsInputContent, {
  OnlineContentsInputContentProps,
} from '../../../components/admin/online-contents/OnlineContentsInputContent';
import EditorTemplate from '../../../components/admin/program/ui/editor/EditorTemplate';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../../utils/axios';

const OnlineContentsCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<OnlineContentsInputContentProps['value']>({
    title: '',
    description: '',
    link: '',
    image: null,
  });

  const addOnlineContents = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/online-program', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/online-contents');
    },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.image) return;
    const newValue = {
      title: value.title,
      description: value.description,
      link: value.link,
    };
    const formData = new FormData();
    formData.append(
      'onlineProgramCreateDTO',
      new Blob([JSON.stringify(newValue)], { type: 'application/json' }),
    );
    formData.append('file', value.image[0]);
    addOnlineContents.mutate(formData);
  };

  return (
    <EditorTemplate
      title="상시 콘텐츠 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
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

export default OnlineContentsCreate;
