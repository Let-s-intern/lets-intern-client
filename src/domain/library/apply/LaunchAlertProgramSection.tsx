'use client';

import { useGetUserMagnetListQuery } from '@/api/magnet/magnet';
import CheckBox from '@/common/box/CheckBox';
import RadioButton from '@/domain/program/challenge/challenge-view/RadioButton';

const RADIO_COLOR = '#5177FF';

interface LaunchAlertProgramSectionProps {
  selectedMagnetIds: number[];
  onSelectedMagnetIdsChange: (ids: number[]) => void;
  wantNotification: boolean | null;
  onWantNotificationChange: (value: boolean) => void;
}

const LaunchAlertProgramSection = ({
  selectedMagnetIds,
  onSelectedMagnetIdsChange,
  wantNotification,
  onWantNotificationChange,
}: LaunchAlertProgramSectionProps) => {
  const { data, isLoading } = useGetUserMagnetListQuery({
    typeList: ['LAUNCH_ALERT'],
    pageable: { page: 1, size: 100 },
  });

  if (isLoading || !data) return null;

  const magnetList = data.magnetList;
  if (magnetList.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* 프로그램 선택 (중복 선택 가능) */}
      <div className="flex flex-col gap-3">
        <label className="text-xsmall14 md:text-xsmall16">
          현재 취준을 준비하며 가장 필요하다고 느끼는 프로그램은 무엇인가요?
        </label>
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
                className="flex w-full items-center gap-1 text-xsmall14"
              >
                <CheckBox
                  checked={isSelected}
                  width="w-6"
                  showCheckIcon
                />
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
