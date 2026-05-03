import { useState } from 'react';

import AlertModal from '@/common/alert/AlertModal';

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <>
      <div className="bg-primary-5 flex items-center justify-between rounded-sm px-5 py-4">
        <div className="flex gap-12">
          <div className="flex flex-col gap-1">
            <span className="text-xsmall16 text-primary-90 font-bold">
              멘토
            </span>
            <span className="text-xsmall14 text-primary-90">{mentorName}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xsmall16 text-primary-90 font-bold">
              선택된 멘토링 시간
            </span>
            <span className="text-xsmall14 text-primary-90">
              {selectedSlot
                ? formatReservationTime(selectedSlot.date, selectedSlot.time)
                : '시간을 선택해주세요'}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-6">
          <button
            type="button"
            onClick={onCancel}
            className="border-primary text-xsmall14 text-primary rounded-sm border bg-neutral-100 px-[30px] py-[9px] font-semibold"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmModalOpen(true)}
            disabled={!selectedSlot}
            className="bg-primary border-primary text-xsmall14 rounded-sm border px-[30px] py-[9px] font-semibold text-neutral-100 disabled:opacity-50"
          >
            예약 확정
          </button>
        </div>
      </div>

      {isConfirmModalOpen && selectedSlot && (
        <AlertModal
          title="라이브 멘토링을 예약하시겠습니까?"
          confirmText="예약 확정"
          cancelText="닫기"
          highlight="confirm"
          onConfirm={() => {
            setIsConfirmModalOpen(false);
            onConfirm();
          }}
          onCancel={() => setIsConfirmModalOpen(false)}
        >
          <>
            <span>
              선택하신 멘토링 일정은
              <b>{`${formatReservationTime(selectedSlot.date, selectedSlot.time)}`}</b>
              입니다.
            </span>
            <span>예약 확정 이후에는 멘토링 일정 변경이 불가합니다.</span>
          </>
        </AlertModal>
      )}
    </>
  );
};

export default ReservationBar;
