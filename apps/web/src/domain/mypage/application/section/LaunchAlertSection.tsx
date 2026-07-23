'use client';

import {
  useDeleteMagnetApplicationMutation,
  useGetMypageMagnetListQuery,
} from '@/api/magnet/magnet';
import { MypageMagnetListItem } from '@/api/magnet/magnetSchema';
import dayjs from '@/lib/dayjs';
import { useConfirm, useToast } from '@letscareer/ui';
import { useState } from 'react';
import MoreButton from '../../ui/button/MoreButton';
import { MypageApplicationCard } from '../../ui/card/NewApplicationCard';
import { MypageApplicationCardConfig } from '../utils/applicationCardConfig';
import EmptySection from './EmptySection';

const LAUNCH_ALERT_DEFAULT_THUMBNAIL =
  '/images/mypage/launch-alert-thumbnail.png';

const toLaunchAlertCardConfig = (
  magnet: MypageMagnetListItem,
  onCancel: (magnetId: number) => void,
): MypageApplicationCardConfig => {
  const dateText = magnet.applicationCreateDate
    ? dayjs(magnet.applicationCreateDate).format('YY.MM.DD')
    : '';

  return {
    id: magnet.magnetId,
    programId: magnet.magnetId,
    // getDetailHref 에 매칭 분기가 없는 값 → '#' 반환 → 카드 클릭 비활성화.
    programTypeKey: 'LAUNCH_ALERT',
    thumbnail: magnet.desktopThumbnail || LAUNCH_ALERT_DEFAULT_THUMBNAIL,
    title: magnet.title,
    description: (() => {
      if (!magnet.description) return '';
      try {
        const parsed = JSON.parse(magnet.description);
        return parsed.metaDescription ?? '';
      } catch {
        return magnet.description;
      }
    })(),
    isHtmlDescription: true,
    statusLabel: '신청완료',
    categoryLabel: '출시알림',
    dateLabel: '신청일자',
    dateText,
    actionButton: {
      label: '신청취소',
      onClick: () => onCancel(magnet.magnetId),
    },
    isCompleted: false,
  };
};

const LaunchAlertSection = () => {
  const { data, isLoading } = useGetMypageMagnetListQuery({
    typeList: ['LAUNCH_ALERT'],
  });
  const confirm = useConfirm();
  const toast = useToast();
  const { mutateAsync: cancelApplication } =
    useDeleteMagnetApplicationMutation();
  const [showMore, setShowMore] = useState(false);

  const handleCancel = async (magnetId: number) => {
    const ok = await confirm({
      title: '출시알림을 취소하시겠습니까?',
      description: (
        <>
          취소하면 더 이상 출시 소식을 받아보실 수 없어요.
          <br />
          언제든 다시 신청할 수 있습니다.
        </>
      ),
      confirmLabel: '취소하기',
      cancelLabel: '닫기',
    });
    if (!ok) return;
    try {
      await cancelApplication(magnetId);
      toast.success('출시알림이 취소되었어요', {
        description: '언제든 다시 신청하실 수 있어요.',
      });
    } catch {
      toast.error('출시알림 취소에 실패했어요', {
        description: '네트워크 상태를 확인하고 다시 시도해주세요.',
      });
    }
  };

  if (isLoading) return <></>;

  const magnetList = data?.magnetList ?? [];
  const hasMagnets = magnetList.length > 0;
  const list = showMore ? magnetList : magnetList.slice(0, 10);

  return (
    <section className="flex flex-col gap-6">
      {hasMagnets ? (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:flex md:flex-col md:gap-y-5">
            {list.map((magnet) => (
              <MypageApplicationCard
                key={magnet.magnetId}
                config={toLaunchAlertCardConfig(magnet, handleCancel)}
              />
            ))}
          </div>
          {magnetList.length > 10 && !showMore && (
            <MoreButton
              className="border-neutral-80 text-primary hover:!bg-primary/5 !bg-transparent px-3 py-2 transition-colors md:flex md:p-3"
              onClick={() => {
                setShowMore(true);
              }}
            >
              더보기
            </MoreButton>
          )}
        </>
      ) : (
        <EmptySection
          text="아직 신청한 출시알림이 없어요"
          href="/program"
          buttonText="프로그램 둘러보기"
        />
      )}
    </section>
  );
};

export default LaunchAlertSection;
