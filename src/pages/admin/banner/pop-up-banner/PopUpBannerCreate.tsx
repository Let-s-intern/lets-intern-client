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
    image: undefined,
  });

  const addPopUpBanner = useMutation({
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
      type: 'POPUP',
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
    addPopUpBanner.mutate(formData);
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
