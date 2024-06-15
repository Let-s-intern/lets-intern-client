import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import PopUpBannerInputContent, {
  PopUpBannerInputContentProps,
} from '../../../../components/admin/banner/pop-up-banner/PopUpBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import axios from '../../../../utils/axios';

const PopUpBannerCreate = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<PopUpBannerInputContentProps['value']>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    contents: '',
    colorCode: '',
    textColorCode: '',
  });

  const addPopUpBanner = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/banner', value, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addPopUpBanner.mutate();
  };

  return (
    <EditorTemplate
      title="팝업 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
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

export default PopUpBannerCreate;
