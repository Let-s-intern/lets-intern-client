import { useState } from 'react';
import PopUpBannerInputContent, {
  PopUpBannerInputContentProps,
} from '../../../../components/admin/banner/pop-up-banner/PopUpBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import axios from '../../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';

const PopUpBannerEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [value, setValue] = useState<PopUpBannerInputContentProps['value']>({
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
        type: 'POPUP',
      },
    ],
    queryFn: async () => {
      const res = await axios.get(`/banner/admin/${bannerId}`, {
        params: {
          type: 'POPUP',
        },
      });
      setValue(res.data.data.bannerAdminDetailVo);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const editPopUpBanner = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/banner/${bannerId}`, value, {
        params: {
          type: 'POPUP',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/banner/pop-up');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editPopUpBanner.mutate();
  };

  return (
    <EditorTemplate
      title="팝업 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <PopUpBannerInputContent value={value} onChange={handleChange} />
    </EditorTemplate>
  );
};

export default PopUpBannerEdit;
