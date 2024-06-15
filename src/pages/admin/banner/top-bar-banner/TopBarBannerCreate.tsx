import { useMutation, useQueryClient } from '@tanstack/react-query';
import TopBarBannerInputContent, {
  TopBarBannerInputContentProps,
} from '../../../../components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../../../utils/axios';

const TopBarBannerCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<TopBarBannerInputContentProps['value']>({
    title: '',
    contents: '',
    link: '',
    startDate: '',
    endDate: '',
    textColorCode: '#000000',
    colorCode: '#000000',
    imgUrl: '',
  });

  const addTopBarBanner = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/banner', value, {
        params: {
          type: 'LINE',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/banner/top-bar-banners');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addTopBarBanner.mutate();
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
