import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import MainBannerInputContent, {
  MainBannerInputContentProps,
} from '../../../../components/admin/banner/main-banner/MainBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import axios from '../../../../utils/axios';

const MainBannerEdit = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<MainBannerInputContentProps['value']>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
  });

  const bannerId = Number(params.bannerId);

  useQuery({
    queryKey: [
      'banner',
      'admin',
      bannerId,
      {
        type: 'MAIN',
      },
    ],
    queryFn: async () => {
      const res = await axios.get(`/banner/admin/${bannerId}`, {
        params: {
          type: 'MAIN',
        },
      });
      setValue(res.data.data.bannerAdminDetailVo);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const editMainBanner = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/banner/${bannerId}`, value, {
        params: {
          type: 'MAIN',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/banner/main-banners');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMainBanner.mutate();
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
