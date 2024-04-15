import { useMutation, useQueryClient } from '@tanstack/react-query';
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
    description: '',
    link: '',
    startDate: '',
    endDate: '',
    textColorCode: '#000000',
    bgColorCode: '#000000',
  });

  const editTopBarBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.patch(`/banner/${params.bannerId}`, formData, {
        params: 'LINE',
        headers: {
          'Content-Type': 'multipart/form-data',
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
    const newValue = {
      type: 'LINE',
      title: value.title,
      link: value.link,
      startDate: value.startDate,
      endDate: value.endDate,
      contents: value.description,
      colorCode: value.bgColorCode,
      textColorCode: value.textColorCode,
    };
    const formData = new FormData();
    formData.append(
      'bannerCreateDTO',
      new Blob([JSON.stringify(newValue)], { type: 'application/json' }),
    );
    editTopBarBanner.mutate(formData);
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
