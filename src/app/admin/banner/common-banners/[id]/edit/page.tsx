'use client';

import {
  CommonBannerDetailResponse,
  CommonBannerFormValue,
  CommonBannerType,
  useEditCommonBannerForAdmin,
  useGetCommonBannerDetailForAdmin,
} from '@/api/banner';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CommonBannerInputContent from '../../new/components/CommonBannerInputContent';

const toDatetimeLocal = (iso: string) => {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const mapDetailToFormValue = (
  detail: CommonBannerDetailResponse,
): CommonBannerFormValue => {
  const types: Record<CommonBannerType, boolean> = {
    HOME_TOP: false,
    HOME_BOTTOM: false,
    PROGRAM: false,
    MY_PAGE: false,
  };

  let homePcFileId: number | null = null;
  let homeMobileFileId: number | null = null;
  let programPcFileId: number | null = null;
  let programMobileFileId: number | null = null;
  let homePcFileUrl: string | null = null;
  let homeMobileFileUrl: string | null = null;
  let programPcFileUrl: string | null = null;
  let programMobileFileUrl: string | null = null;

  for (const item of detail.commonBannerDetailList ?? []) {
    types[item.type] = true;

    if (item.type === 'HOME_TOP' || item.type === 'HOME_BOTTOM') {
      if (item.agentType === 'PC') { homePcFileId = item.fileId; homePcFileUrl = item.fileUrl ?? null; }
      if (item.agentType === 'MOBILE') { homeMobileFileId = item.fileId; homeMobileFileUrl = item.fileUrl ?? null; }
    } else if (item.type === 'PROGRAM') {
      if (item.agentType === 'PC') { programPcFileId = item.fileId; programPcFileUrl = item.fileUrl ?? null; }
      if (item.agentType === 'MOBILE') { programMobileFileId = item.fileId; programMobileFileUrl = item.fileUrl ?? null; }
    } else if (item.type === 'MY_PAGE') {
      // MY_PAGE PC = 프로그램 모바일, MY_PAGE MOBILE = 홈 모바일
      if (item.agentType === 'PC') { programMobileFileId = item.fileId; programMobileFileUrl = item.fileUrl ?? null; }
      if (item.agentType === 'MOBILE') { homeMobileFileId = item.fileId; homeMobileFileUrl = item.fileUrl ?? null; }
    }
  }

  const { commonBanner } = detail;

  return {
    title: commonBanner.title || '',
    landingUrl: commonBanner.landingUrl || '',
    isVisible: commonBanner.isVisible,
    startDate: commonBanner.startDate
      ? toDatetimeLocal(commonBanner.startDate)
      : '',
    endDate: commonBanner.endDate
      ? toDatetimeLocal(commonBanner.endDate)
      : '',
    types,
    homePcFile: null,
    homeMobileFile: null,
    programPcFile: null,
    programMobileFile: null,
    homePcFileId,
    homeMobileFileId,
    programPcFileId,
    programMobileFileId,
    homePcFileUrl,
    homeMobileFileUrl,
    programPcFileUrl,
    programMobileFileUrl,
  };
};

const CommonBannerEdit = () => {
  const router = useRouter();
  const params = useParams();
  const commonBannerId = Number(params.id);

  const { data, isLoading } = useGetCommonBannerDetailForAdmin({
    commonBannerId,
  });

  const [value, setValue] = useState<CommonBannerFormValue | null>(null);

  useEffect(() => {
    if (data && !value) {
      setValue(mapDetailToFormValue(data));
    }
  }, [data, value]);

  const { mutate: tryEditCommonBanner } = useEditCommonBannerForAdmin({
    successCallback: () => {
      router.push('/admin/banner/common-banners');
    },
    errorCallback: (error) => {
      console.error(error);
      alert('통합 배너 수정에 실패했습니다.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    tryEditCommonBanner({ commonBannerId, form: value });
  };

  if (isLoading || !value) {
    return <LoadingContainer />;
  }

  return (
    <EditorTemplate
      title="배너 수정"
      onSubmit={handleSubmit}
      submitButton={{ text: '수정' }}
      cancelButton={{ text: '취소', to: '-1' }}
    >
      <CommonBannerInputContent value={value} onChange={setValue} />
    </EditorTemplate>
  );
};

export default CommonBannerEdit;
