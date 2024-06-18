import { useState } from 'react';
import ProgramBannerInputContent from '../../../../components/admin/banner/program-banner/ProgramBannerInputContent';
import EditorTemplate from '../../../../components/admin/program/ui/editor/EditorTemplate';
import axios from '../../../../utils/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { IBannerForm } from '../../../../interfaces/interface';

const ProgramBannerEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
        type: 'PROGRAM',
      },
    ],
    queryFn: async () => {
      const res = await axios.get(`/banner/admin/${bannerId}`, {
        params: {
          type: 'PROGRAM',
        },
      });
      setValue(res.data.data.bannerAdminDetailVo);
      return res.data;
    },
    refetchOnWindowFocus: false,
  });

  const editProgramBanner = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.patch(`/banner/${bannerId}`, formData, {
        params: {
          type: 'PROGRAM',
        },
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

    editProgramBanner.mutate(formData);
  };

  return (
    <EditorTemplate
      title="프로그램 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
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

export default ProgramBannerEdit;
