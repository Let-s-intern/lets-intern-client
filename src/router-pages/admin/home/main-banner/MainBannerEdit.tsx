import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import MainBannerInputContent from '../../../../components/admin/banner/main-banner/MainBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import { IBannerForm } from '../../../../types/Banner.interface';
import axios from '../../../../utils/axios';

const MainBannerEdit = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [value, setValue] = useState<IBannerForm>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
    mobileFile: null,
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
    mutationFn: async (formData: FormData) => {
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'MAIN',
        },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['banner'] });
      navigate('/admin/home/main-banners');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setValue({ ...value, [e.target.name]: e.target.files[0] });
    } else {
      setValue({ ...value, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      'requestDto',
      new Blob(
        [
          JSON.stringify({
            title: value.title,
            link: value.link,
            startDate: value.startDate,
            endDate: value.endDate,
          }),
        ],
        {
          type: 'application/json',
        },
      ),
    );
    if (value.file) {
      formData.append('file', value.file);
    }
    if (value.mobileFile) {
      formData.append('mobileFile', value.mobileFile);
    }

    editMainBanner.mutate(formData);
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
