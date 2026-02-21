'use client';

import { CommonBannerFormValue, usePostCommonBannerForAdmin } from '@/api/banner';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CommonBannerInputContent from './components/CommonBannerInputContent';

const CommonBannerCreate = () => {
  const router = useRouter();

  const [value, setValue] = useState<CommonBannerFormValue>({
    title: '',
    landingUrl: '',
    isVisible: true,
    startDate: '',
    endDate: '',
    // 노출 위치 체크박스
    types: {
      HOME_TOP: false,
      HOME_BOTTOM: false,
      PROGRAM: false,
      MY_PAGE: false,
    },
    // 이미지 파일
    homePcFile: null,
    homeMobileFile: null,
    programPcFile: null,
    programMobileFile: null,
  });

  const { mutate: tryCreateCommonBanner } = usePostCommonBannerForAdmin({
    successCallback: () => {
      router.push('/admin/banner/common-banners');
    },
    errorCallback: (error) => {
      console.error(error);
      alert('통합 배너 등록에 실패했습니다.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    tryCreateCommonBanner(value);
  };

  return (
    <EditorTemplate
      title="배너 등록"
      onSubmit={handleSubmit}
      submitButton={{ text: '등록' }}
      cancelButton={{ text: '취소', to: '-1' }}
    >
      <CommonBannerInputContent value={value} onChange={setValue} />
    </EditorTemplate>
  );
};

export default CommonBannerCreate;
