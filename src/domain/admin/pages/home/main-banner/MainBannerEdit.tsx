'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  BannerItemType,
  useEditBannerForAdmin,
  useGetBannerDetailForAdmin,
} from '@/api/banner';
import EmptyContainer from '@/common/container/EmptyContainer';
import LoadingContainer from '@/common/loading/LoadingContainer';
import MainBannerInputContent from '@/domain/admin/home/main-banner/MainBannerInputContent';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';

const MainBannerEdit = () => {
  const router = useRouter();
  const params = useParams();
  const bannerId = Number(params.bannerId);

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
    mobileFile: null,
  });

  const { data: banner, isLoading: bannerIsLoading } =
    useGetBannerDetailForAdmin({
      bannerId,
      type: 'MAIN',
    });

  const { mutate: editMainBanner } = useEditBannerForAdmin({
    successCallback: () => {
      alert('홈 상단 배너가 수정되었습니다.');
      router.push('/admin/home/main-banners');
    },
    errorCallback: (error) => {
      alert(error);
    },
  });

  useEffect(() => {
    if (banner) {
      setValue(banner.bannerAdminDetailVo);
    }
  }, [banner]);

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

    editMainBanner({ bannerId, type: 'MAIN', formData });
  };

  return (
    <EditorTemplate
      title="홈 상단 배너 수정"
      onSubmit={handleSubmit}
      submitButton={{
        text: '수정',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      {bannerIsLoading ? (
        <LoadingContainer />
      ) : !banner ? (
        <EmptyContainer />
      ) : (
        <MainBannerInputContent value={value} onChange={handleChange} />
      )}
    </EditorTemplate>
  );
};

export default MainBannerEdit;
