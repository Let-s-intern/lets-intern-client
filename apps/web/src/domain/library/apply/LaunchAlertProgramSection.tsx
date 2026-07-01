'use client';

import { userMagnetListQueryOptions } from '@/api/magnet/magnet';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import CheckBox from '@/common/box/CheckBox';
import RadioButton from '@/domain/program/challenge/challenge-view/RadioButton';
import { useSuspenseQuery } from '@tanstack/react-query';

const RADIO_COLOR = '#5F66F6';

interface LaunchAlertProgramSectionProps {
  selectedMagnetIds: number[];
  onSelectedMagnetIdsChange: (ids: number[]) => void;
  wantNotification: boolean | null;
  onWantNotificationChange: (value: boolean) => void;
}

const LaunchAlertProgramSection = (props: LaunchAlertProgramSectionProps) => {
  // 로딩·에러 시 폼 흐름을 방해하지 않도록 둘 다 아무것도 렌더하지 않는다(기존 동작 보존).
  return (
    <AsyncBoundary pendingFallback={null} rejectedFallback={() => null}>
      <LaunchAlertProgramSectionContent {...props} />
    </AsyncBoundary>
  );
};

const LaunchAlertProgramSectionContent = ({
  selectedMagnetIds,
  onSelectedMagnetIdsChange,
  wantNotification,
  onWantNotificationChange,
}: LaunchAlertProgramSectionProps) => {
  const { data } = useSuspenseQuery(
    userMagnetListQueryOptions({
      typeList: ['LAUNCH_ALERT'],
      pageable: { page: 1, size: 100 },
    }),
  );

  const magnetList = data.magnetList;
  if (magnetList.length === 0) return null;

  return (
    <div className="flex flex-col gap-10">
      {/* 프로그램 선택 (중복 선택 가능) */}
      <div className="flex flex-col gap-3">
        <span className="text-xsmall14 md:text-xsmall16 mt-4">
          현재 취준을 준비하며 가장 필요하다고 느끼는 프로그램은 무엇인가요?
        </span>
        <div className="flex flex-col gap-2">
          {magnetList.map((magnet) => {
            const isSelected = selectedMagnetIds.includes(magnet.magnetId);
            return (
              <button
                key={magnet.magnetId}
                type="button"
                onClick={() => {
                  const newIds = isSelected
                    ? selectedMagnetIds.filter((id) => id !== magnet.magnetId)
                    : [...selectedMagnetIds, magnet.magnetId];
                  onSelectedMagnetIdsChange(newIds);
                }}
                className="text-xsmall14 flex w-full items-center gap-1"
              >
                <CheckBox checked={isSelected} width="w-6" showCheckIcon />
                <span className="text-xsmall14 md:text-xsmall16">
                  {magnet.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 출시 알림 수신 여부 */}
      <div className="flex flex-col gap-3">
        <label className="text-xsmall14 md:text-xsmall16">
          해당 프로그램이 출시되면 소식을 받아보시겠어요?
        </label>
        <div className="flex flex-col gap-2">
          <RadioButton
            color={RADIO_COLOR}
            checked={wantNotification === true}
            label="네, 받아볼래요"
            onClick={() => onWantNotificationChange(true)}
          />
          <RadioButton
            color={RADIO_COLOR}
            checked={wantNotification === false}
            label="아니요, 괜찮아요"
            onClick={() => onWantNotificationChange(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default LaunchAlertProgramSection;
