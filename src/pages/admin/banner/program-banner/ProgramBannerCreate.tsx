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
    image: undefined,
  });

  const addProgramBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post('/banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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
    if (e.target.files) {
      setValue({ ...value, image: e.target.files });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.image) return;
    const newValue = {
      type: 'PROGRAM',
      title: value.title,
      link: value.link,
      startDate: value.startDate,
      endDate: value.endDate,
    };
    const formData = new FormData();
    formData.append(
      'bannerCreateDTO',
      new Blob([JSON.stringify(newValue)], { type: 'application/json' }),
    );
    formData.append('file', value.image[0]);
    addProgramBanner.mutate(formData);
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
