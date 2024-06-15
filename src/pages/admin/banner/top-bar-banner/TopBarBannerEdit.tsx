import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TopBarBannerInputContent, {
  TopBarBannerInputContentProps,
} from '../../../../components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../../../utils/axios';

const TopBarBannerEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  const [value, setValue] = useState<TopBarBannerInputContentProps['value']>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    contents: '',
    textColorCode: '#000000',
    colorCode: '#000000',
  });

  const bannerId = Number(params.bannerId);

  useQuery({
    queryKey: [
      'banner',
      'admin',
      {
        type: 'LINE',
      },
    ],
    queryFn: async () => {
      const res = await axios.get('/banner/admin', {
        params: {
          type: 'LINE',
        },
      });
      const topBanner = res.data.data.bannerList.find(
        (banner: { id: number }) => banner.id === bannerId,
      );
      setValue(topBanner);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const editTopBarBanner = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/banner/${params.bannerId}`, value, {
        params: { type: 'LINE' },
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
    editTopBarBanner.mutate();
  };

  return (
    <EditorTemplate
      title="상단 띠 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
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

export default TopBarBannerEdit;
