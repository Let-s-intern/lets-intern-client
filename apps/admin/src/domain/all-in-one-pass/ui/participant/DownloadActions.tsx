import ActionButton from '@/domain/admin/ui/button/ActionButton';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import { downloadBlob } from '@/domain/all-in-one-pass/util/downloadBlob';
import dayjs from '@/lib/dayjs';
import { useState } from 'react';

interface Props {
  participants: PassParticipant[];
  programTitle: string;
}

/** 참여자 목록 다운로드 (CSV + 이메일/전화 목록) */
export default function DownloadActions({ participants, programTitle }: Props) {
  const [open, setOpen] = useState(false);

  const downloadCsv = () => {
    const header =
      '이름,이메일,휴대폰 번호,쿠폰명,결제 상품,결제금액,환불여부,신청일자';
    const rows = participants.map((p) => {
      const amount = p.isCanceled
        ? (p.originalPrice ?? p.finalPrice)
        : p.finalPrice;
      return [
        p.name,
        p.email,
        p.phoneNum,
        p.couponName || '없음',
        p.productName,
        amount,
        p.isCanceled ? 'Y' : 'N',
        dayjs(p.createDate).format('YYYY-MM-DD HH:mm'),
      ].join(',');
    });
    downloadBlob(
      `${programTitle} - 참여자 목록.csv`,
      '﻿' + [header, ...rows].join('\n'),
      'text/csv',
    );
    setOpen(false);
  };

  const downloadList = (column: 'email' | 'phone') => {
    const list = participants.map((p) =>
      column === 'email' ? p.email : p.phoneNum,
    );
    const label = column === 'email' ? '이메일' : '전화번호';
    downloadBlob(`${programTitle} - ${label} 목록.txt`, list.join('\n'));
    setOpen(false);
  };

  const menuItemClass =
    'cursor-pointer px-3 py-3 text-xsmall14 font-medium duration-200 hover:bg-neutral-95';

  return (
    <div className="relative">
      <ActionButton
        type="button"
        width="6rem"
        bgColor="gray"
        onClick={() => setOpen((prev) => !prev)}
      >
        다운로드
      </ActionButton>
      {open && (
        <ul className="rounded-xs border-neutral-80 absolute right-0 top-full z-10 mt-1 w-40 overflow-hidden border bg-white shadow-lg">
          <li className={menuItemClass} onClick={downloadCsv}>
            CSV 다운로드
          </li>
          <li className={menuItemClass} onClick={() => downloadList('email')}>
            이메일 목록
          </li>
          <li className={menuItemClass} onClick={() => downloadList('phone')}>
            전화번호 목록
          </li>
        </ul>
      )}
    </div>
  );
}
