'use client';

import { useState } from 'react';

import {
  BannerItemType,
  bannerType,
  usePostBannerForAdmin,
} from '@/api/banner';
import MainBannerInputContent from '@/domain/admin/home/main-banner/MainBannerInputContent';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useRouter } from 'next/navigation';

const BannerCreate = () => {
  const [value, setValue] = useState<BannerItemType>({
    title: '',
    link: '',
    startDate: '',
    endDate: '',
    file: null,
    mobileFile: null,
    programFile: null,
    programMobileFile: null,
    imgUrl: '',
    mobileImgUrl: '',
    programImgUrl: '',
    programMobileImgUrl: '',
  });

  const route = useRouter();

  const { mutate: addBanner } = usePostBannerForAdmin({
    errorCallback: (error) => {
      alert(error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value: targetValue, files } = e.target;

    if (files) {
      setValue({ ...value, [name]: files[0] });
    } else {
      setValue({ ...value, [name]: targetValue });
    }
  };

  const handleTypeChange = (type: bannerType) => {
    if (!value.type) {
      setValue({ ...value, type: [type] });
      return;
    }

    if (value.type.includes(type)) {
      const filteredTypes = value.type.filter((t) => t !== type);
      setValue({ ...value, type: filteredTypes });
    } else {
      setValue({ ...value, type: [...value.type, type] });
    }
  };

  const validateImages = (): string | null => {
    if (!value.type || value.type.length === 0) {
      return '배너 노출 위치를 선택해 주세요.';
    }

    const hasMain = value.type.includes('MAIN');
    const hasMainBottom = value.type.includes('MAIN_BOTTOM');
    const hasProgram = value.type.includes('PROGRAM');
    const hasMypage = value.type.includes('MYPAGE' as bannerType);

    // 홈 상단 또는 홈 하단 선택 시 홈 배너 이미지 필수
    if (hasMain || hasMainBottom) {
      if (!value.file || !value.mobileFile) {
        return '홈 배너 이미지(PC, 모바일)를 모두 등록해 주세요.';
      }
    }

    // 프로그램 페이지 선택 시 프로그램 배너 이미지 필수
    if (hasProgram) {
      if (!value.programFile || !value.programMobileFile) {
        return '프로그램 배너 이미지(PC, 모바일)를 모두 등록해 주세요.';
      }
    }

    // 마이페이지 선택 시 홈 배너(모바일), 프로그램 배너(모바일) 필수
    if (hasMypage) {
      if (!value.mobileFile || !value.programMobileFile) {
        return '마이페이지 배너에 필요한 이미지(홈 배너 모바일, 프로그램 배너 모바일)를 모두 등록해 주세요.';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateImages();
    if (validationError) {
      alert(validationError);
      return;
    }

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

    value.type?.forEach((type) => {
      if (type === ('MYPAGE' as bannerType)) return;
      if (type === ('PROGRAM' as bannerType)) {
        formData.append('file', value.programFile!);
        formData.append('mobileFile', value.programMobileFile!);
      } else {
        formData.append('file', value.file!);
        formData.append('mobileFile', value.mobileFile!);
      }

      addBanner({ type, formData });
      route.replace('/admin/banner/integrated-banners');
    });
  };

  return (
    <EditorTemplate
      title="배너 등록"
      onSubmit={handleSubmit}
      submitButton={{
        text: '등록',
      }}
      cancelButton={{
        text: '취소',
        to: '-1',
      }}
    >
      <MainBannerInputContent
        value={value}
        onChange={handleChange}
        onTypeChange={handleTypeChange}
      />
    </EditorTemplate>
  );
};

export default BannerCreate;
