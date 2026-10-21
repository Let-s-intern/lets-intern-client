// 패스 만료 임박 팝업 — 대시보드 진입 시 자동 노출. "기간 연장하기"→모달 / "오늘 그만 보기"→당일 숨김.
'use client';

import SolidButton from '@/common/button/SolidButton';
import dayjs from '@/lib/dayjs';
import { useEffect, useState } from 'react';
import { useGetMembershipApplication } from '../../../api/dashboard';
import ExtensionSheet from './ExtensionSheet';
import { getExtensionCopy, getExtensionStatus } from './extensionStatus';

const dismissKey = (applicationId: number) =>
  `pass-ext-popup-dismissed-${applicationId}`;

const formatDate = (d: string) => dayjs(d).format('YYYY년 M월 D일');

interface Props {
  applicationId: number;
  onExtend: () => void;
  // 모달이 열린 동안은 숨김. 언마운트 대신 숨겨 open 상태를 보존 → 모달 닫아도 되살아나지 않음.
  isModalOpen?: boolean;
}

export default function ExtensionPopup({
  applicationId,
  onExtend,
  isModalOpen,
}: Props) {
  const { data } = useGetMembershipApplication(applicationId);
  const [open, setOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    if (!data) return;
    const dismissedToday =
      localStorage.getItem(dismissKey(applicationId)) ===
      dayjs().format('YYYY-MM-DD');
    setOpen(!dismissedToday && getExtensionStatus(data.endDate).canExtend);
  }, [data, applicationId]);

  if (!open || !data || isModalOpen) return null;

  const close = () => {
    if (dontShowToday) {
      localStorage.setItem(
        dismissKey(applicationId),
        dayjs().format('YYYY-MM-DD'),
      );
    }
    setOpen(false);
  };

  const copy = getExtensionCopy(data.title, data.endDate);

  return (
    <ExtensionSheet
      onClose={close}
      className="flex flex-col gap-5 md:w-[400px]"
      title={copy.title}
      description={
        <>
          {copy.line1}
          <br />
          {copy.line2}
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <div className="bg-primary-5 flex flex-col gap-2 rounded-sm p-3">
          <span className="text-xsmall14 text-neutral-35 font-normal">
            현재 이용 종료일
          </span>
          <span className="text-xsmall16 text-neutral-0 font-normal">
            {formatDate(data.endDate)}
          </span>
        </div>
        <p className="text-xsmall14 text-neutral-35">
          기간 연장은 이용 종료 다음 날까지 가능해요.
        </p>

        <SolidButton
          className="mt-3 w-full"
          onClick={() => {
            setOpen(false);
            onExtend();
          }}
        >
          기간 연장하기
        </SolidButton>

        <div className="border-neutral-85 -mx-6 flex items-center justify-between border-t px-6 pt-3">
          <button
            type="button"
            onClick={() => setDontShowToday((v) => !v)}
            className="flex items-center gap-1"
          >
            <img
              src={
                dontShowToday
                  ? '/icons/checkbox-checked.svg'
                  : '/icons/checkbox-unchecked.svg'
              }
              alt=""
              className="h-5 w-5"
            />
            <span className="text-xxsmall12 text-neutral-35">
              오늘 그만 보기
            </span>
          </button>
          <button
            type="button"
            onClick={close}
            className="text-xsmall14 text-neutral-35"
          >
            닫기
          </button>
        </div>
      </div>
    </ExtensionSheet>
  );
}
