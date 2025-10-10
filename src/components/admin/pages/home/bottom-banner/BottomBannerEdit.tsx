'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  BannerItemType,
  useEditBannerForAdmin,
  useGetBannerDetailForAdmin,
} from '@/api/banner';
import MainBannerInputContent from '@/components/admin/home/main-banner/MainBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';

const BottomBannerEdit = () => {
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
      type: 'MAIN_BOTTOM',
    });

  const { mutate: editBottomBanner } = useEditBannerForAdmin({
    successCallback: () => {
      alert('홈 하단 배너가 수정되었습니다.');
      router.push('/admin/home/bottom-banners');
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

    editBottomBanner({ bannerId, type: 'MAIN_BOTTOM', formData });
  };

  return (
    <EditorTemplate
      title="홈 하단 배너 수정"
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

export default BottomBannerEdit;
