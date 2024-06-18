import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TopBarBannerInputContent from '../../../../components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from '../../../../utils/axios';
import { ILineBannerForm } from '../../../../interfaces/interface';

const TopBarBannerEdit = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const params = useParams();

  const [value, setValue] = useState<ILineBannerForm>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    contents: '',
    textColorCode: '#000000',
    colorCode: '#000000',
  });

  const bannerId = Number(params.bannerId);

  useQuery({
    queryKey: [
      'banner',
      'admin',
      bannerId,
      {
        type: 'LINE',
      },
    ],
    queryFn: async () => {
      const res = await axios.get(`/banner/admin/${bannerId}`, {
        params: {
          type: 'LINE',
        },
      });
      setValue(res.data.data.bannerAdminDetailVo);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const editTopBarBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.patch(`/banner/${params.bannerId}`, formData, {
        params: { type: 'LINE' },
        headers: { 'Content-Type': 'multipart/form-data' },
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

    const formData = new FormData();
    formData.append(
      'updateBannerRequestDto',
      new Blob(
        [
          JSON.stringify({
            title: value.title,
            link: value.link,
            startDate: value.startDate,
            endDate: value.endDate,
            contents: value.contents,
            colorCode: value.colorCode,
            textColorCode: value.textColorCode,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
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
