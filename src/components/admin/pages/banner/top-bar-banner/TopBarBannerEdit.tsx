'use client';

import {
  BannerItemType,
  useEditBannerForAdmin,
  useGetBannerDetailForAdmin,
} from '@/api/banner';
import TopBarBannerInputContent from '@/components/admin/banner/top-bar-banner/TopBarBannerInputContent';
import EditorTemplate from '@/components/admin/program/ui/editor/EditorTemplate';
import EmptyContainer from '@components/common/ui/EmptyContainer';
import LoadingContainer from '@components/common/ui/loading/LoadingContainer';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const TopBarBannerEdit = () => {
  const router = useRouter();
  const params = useParams<{ bannerId: string }>();
  const bannerId = Number(params.bannerId);

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    contents: '',
    textColorCode: '#000000',
    colorCode: '#000000',
  });

  const { data: banner, isLoading: bannerIsLoading } =
    useGetBannerDetailForAdmin({
      bannerId,
      type: 'LINE',
    });

  const { mutate: editTopBarBanner } = useEditBannerForAdmin({
    successCallback: () => {
      alert('상단 띠 배너가 수정되었습니다.');
      router.push('/admin/banner/top-bar-banners');
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
    setValue({ ...value, [e.target.name]: e.target.value });
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

    editTopBarBanner({ bannerId, type: 'LINE', formData });
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
      {bannerIsLoading ? (
        <LoadingContainer />
      ) : !banner ? (
        <EmptyContainer />
      ) : (
        <TopBarBannerInputContent value={value} onChange={handleChange} />
      )}
    </EditorTemplate>
  );
};

export default TopBarBannerEdit;
