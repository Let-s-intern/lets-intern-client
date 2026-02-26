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

    // 노출 기간 검증
    if (!value.startDate || !value.endDate) {
      alert('노출 시작일과 종료일을 모두 입력해주세요.');
      return;
    }
    if (new Date(value.startDate) >= new Date(value.endDate)) {
      alert('노출 종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    // 노출 위치 선택 여부
    const { types } = value;
    if (!types.HOME_TOP && !types.HOME_BOTTOM && !types.PROGRAM && !types.MY_PAGE) {
      alert('노출 위치를 하나 이상 선택해주세요.');
      return;
    }

    // 필수 이미지 검증
    const needsHome = types.HOME_TOP || types.HOME_BOTTOM;
    const needsProgram = types.PROGRAM;
    const needsMyPage = types.MY_PAGE;

    if (needsHome && !value.homePcFile) {
      alert('홈 배너 (PC) 이미지를 업로드해주세요.');
      return;
    }
    if ((needsHome || needsMyPage) && !value.homeMobileFile) {
      alert('홈 배너 (모바일) 이미지를 업로드해주세요.');
      return;
    }
    if (needsProgram && !value.programPcFile) {
      alert('프로그램 배너 (PC) 이미지를 업로드해주세요.');
      return;
    }
    if ((needsProgram || needsMyPage) && !value.programMobileFile) {
      alert('프로그램 배너 (모바일) 이미지를 업로드해주세요.');
      return;
    }

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
