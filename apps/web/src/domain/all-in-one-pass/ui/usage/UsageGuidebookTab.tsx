// 나의 패스 이용 > 가이드북 탭 (열람 가능 / 보유 중).
'use client';

import { useMypageApplicationsQueryKey } from '@/api/application';
import AlertModal from '@/common/alert/AlertModal';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { downloadContentAndTrack } from '@/domain/career-board/utils/contentDownload';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { PassProgramCardData } from './PassProgramCard';
import UsageApplyModals from './UsageApplyModals';
import UsageSection from './UsageSection';
import { usePassProgramApply } from './usePassProgramApply';
import { useUsageGuidebook } from './useUsageGuidebook';

const UsageGuidebookTab = ({ passTitle }: { passTitle?: string }) => {
  const queryClient = useQueryClient();
  const params = useParams<{ applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { available, owned, isLoading, isError } =
    useUsageGuidebook(applicationId);
  const apply = usePassProgramApply('guidebook');
  const [downloadTarget, setDownloadTarget] =
    useState<PassProgramCardData | null>(null);

  const runDownload = (item: PassProgramCardData) => {
    downloadContentAndTrack({
      applicationId: item.applicationId ?? 0,
      contentFileUrl: item.contentFileUrl ?? undefined,
      contentUrl: item.contentUrl ?? undefined,
      type: 'GUIDEBOOK',
    }).then(() =>
      queryClient.invalidateQueries({
        queryKey: [useMypageApplicationsQueryKey],
      }),
    );
  };

  // isDownloaded면 바로 열람/다운, 아니면 안내 팝업 후 다운 (신청내역·커리어성장과 동일)
  const handleOwnedClick = (item: PassProgramCardData) => {
    if (item.isDownloaded) runDownload(item);
    else setDownloadTarget(item);
  };

  if (isLoading) {
    return <LoadingContainer className="py-20" />;
  }
  if (isError) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-20 text-center">
        목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
      </p>
    );
  }

  const isPdf = !!downloadTarget?.contentFileUrl;

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      <UsageSection
        title="열람 가능"
        items={available}
        emptyText="현재 열람 가능한 가이드북이 없습니다."
        onCardClick={(item) => apply.requestApply(item.programId, item.title)}
      />
      <UsageSection
        title="보유 중"
        items={owned}
        emptyText="보유하신 가이드북이 없습니다."
        onCardClick={handleOwnedClick}
      />

      <UsageApplyModals
        programType="guidebook"
        passTitle={passTitle}
        apply={apply}
      />
      {downloadTarget && (
        <AlertModal
          title={
            isPdf
              ? '가이드북을 다운로드하시겠습니까?'
              : '가이드북을 열람하시겠습니까?'
          }
          confirmText={isPdf ? '다운로드' : 'URL 접속하기'}
          cancelText="닫기"
          onConfirm={() => {
            runDownload(downloadTarget);
            setDownloadTarget(null);
          }}
          onCancel={() => setDownloadTarget(null)}
        >
          <p className="text-xsmall14 text-neutral-30">
            디지털 콘텐츠 특성상 {isPdf ? '다운로드' : '열람'} 이후에는 단순
            변심으로 인한 취소 및 환불이 불가능합니다.
          </p>
        </AlertModal>
      )}
    </div>
  );
};

export default UsageGuidebookTab;
