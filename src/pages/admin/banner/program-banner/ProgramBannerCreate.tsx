import { useMutation, useQueryClient } from '@tanstack/react-query';
import ProgramBannerInputContent, {
  ProgramBannerInputContentProps,
} from '../../../../components/admin/banner/program-banner/ProgramBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../../../utils/axios';

const ProgramBannerCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<ProgramBannerInputContentProps['value']>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
  });

  const addProgramBanner = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/banner', value, {
        params: {
          type: 'PROGRAM',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/banner/program-banners');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addProgramBanner.mutate();
  };

  return (
    <EditorTemplate
      title="프로그램 배너 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
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

export default ProgramBannerCreate;
