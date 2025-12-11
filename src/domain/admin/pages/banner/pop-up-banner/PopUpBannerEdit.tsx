'use client';

import {
  BannerItemType,
  useEditBannerForAdmin,
  useGetBannerDetailForAdmin,
} from '@/api/banner';
import EmptyContainer from '@/common/ui/EmptyContainer';
import LoadingContainer from '@/common/ui/loading/LoadingContainer';
import PopUpBannerInputContent from '@/domain/admin/banner/pop-up-banner/PopUpBannerInputContent';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PopUpBannerEdit = () => {
  const router = useRouter();
  const params = useParams<{ bannerId: string }>();
  const bannerId = Number(params.bannerId);

  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    imgUrl: '',
    file: null,
  });

  const { data: banner, isLoading: bannerIsLoading } =
    useGetBannerDetailForAdmin({
      bannerId,
      type: 'POPUP',
    });

  const { mutate: editPopUpBanner } = useEditBannerForAdmin({
    successCallback: () => {
      alert('팝업이 수정되었습니다.');
      router.push('/admin/banner/pop-up');
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

    editPopUpBanner({ bannerId, type: 'POPUP', formData });
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
      {bannerIsLoading ? (
        <LoadingContainer />
      ) : !banner ? (
        <EmptyContainer />
      ) : (
        <PopUpBannerInputContent value={value} onChange={handleChange} />
      )}
    </EditorTemplate>
  );
};

export default PopUpBannerEdit;
