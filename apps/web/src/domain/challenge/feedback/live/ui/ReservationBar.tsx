import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import type { SelectedSlot } from '../types';
import { formatReservationTime } from '../utils';

interface Props {
  mentorName: string;
  selectedSlot: SelectedSlot | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ReservationBar = ({
  mentorName,
  selectedSlot,
  onCancel,
  onConfirm,
}: Props) => {
  const router = useRouter();
  const { applicationId, programId } = useParams<{
    applicationId: string;
    programId: string;
  }>();
  const [isChecked, setIsChecked] = useState(false);

  const timeText = selectedSlot
    ? formatReservationTime(`${selectedSlot.date}T${selectedSlot.time}:00`)
    : '피드백 시간을 선택해주세요';

  return (
    <>
      {/* 모바일 레이아웃 */}
      <div className="mt-3 flex flex-col gap-6 md:hidden">
        <div className="bg-primary-5 flex flex-col gap-0.5 rounded-sm px-5 py-4">
          <span className="text-xsmall16 text-primary-90 font-bold">
            선택된 피드백 시간
          </span>
          <span className="text-xsmall14 text-primary-90">{timeText}</span>
        </div>
        <div
          className="mb-4 flex cursor-pointer items-center gap-1"
          onClick={() => setIsChecked((prev) => !prev)}
        >
          <img
            src={
              isChecked
                ? '/icons/checkbox-checked.svg'
                : '/icons/checkbox-unchecked-box.svg'
            }
            alt=""
            width={20}
            height={20}
          />
          <span className="text-xsmall14 text-neutral-10">
            예약 확정 후에는 예약 시간을 변경할 수 없습니다.
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              router.push(
                `/challenge/${applicationId}/${programId}/feedback/live`,
              )
            }
            className="border-primary text-xsmall16 text-primary flex-1 rounded-sm border bg-neutral-100 py-4 font-semibold"
          >
            취소하기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!selectedSlot || !isChecked}
            className="bg-primary border-primary text-xsmall16 flex-1 rounded-sm border py-4 font-semibold text-neutral-100 disabled:opacity-50"
          >
            예약 확정하기
          </button>
        </div>
      </div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden flex-col gap-10 md:flex">
        <div
          className="flex cursor-pointer items-center gap-1"
          onClick={() => setIsChecked((prev) => !prev)}
        >
          <img
            src={
              isChecked
                ? '/icons/checkbox-checked.svg'
                : '/icons/checkbox-unchecked-box.svg'
            }
            alt=""
            width={20}
            height={20}
          />
          <span className="text-xsmall14 text-neutral-10">
            예약 확정 후에는 예약 시간을 변경할 수 없습니다.
          </span>
        </div>
        <div className="bg-primary-5 flex items-center justify-between rounded-sm px-5 py-4">
          <div className="flex gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-xsmall16 text-primary-90 font-bold">
                멘토
              </span>
              <span className="text-xsmall14 text-primary-90">
                {mentorName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xsmall16 text-primary-90 font-bold">
                선택된 피드백 시간
              </span>
              <span className="text-xsmall14 text-primary-90">{timeText}</span>
            </div>
          </div>
          <div className="flex shrink-0 gap-6">
            <button
              type="button"
              onClick={onCancel}
              className="border-primary text-xsmall14 text-primary rounded-sm border bg-neutral-100 px-[30px] py-3 font-semibold"
            >
              취소
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!selectedSlot || !isChecked}
              className="bg-primary border-primary text-xsmall14 rounded-sm border px-[30px] py-3 font-semibold text-neutral-100 disabled:opacity-50"
            >
              예약 확정
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservationBar;
