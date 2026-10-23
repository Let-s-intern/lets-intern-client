// U-5 공지사항/패스 가이드. 유형 칩(sticky) + 아코디언 목록.
'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import { CategoryChips } from '@letscareer/ui';
import { useState } from 'react';
import { useGetPassNotices } from '../../api/notices';
import type { PassNoticeType } from '../../types';
import NoticeItem from './NoticeItem';

const TYPE_OPTIONS: { value: PassNoticeType; label: string }[] = [
  { value: 'NOTICE', label: '공지사항' },
  { value: 'GUIDE', label: '패스 가이드' },
];

const NoticesView = ({ applicationId }: { applicationId: number }) => {
  const [type, setType] = useState<PassNoticeType>('NOTICE');
  const { data, isLoading, isError } = useGetPassNotices(applicationId);
  const notices = (data ?? []).filter((notice) => notice.type === type);

  return (
    <div className="flex flex-col gap-0 md:gap-6">
      <CategoryChips
        options={TYPE_OPTIONS}
        selected={type}
        onChange={setType}
        className="border-neutral-80 sticky top-[84px] z-10 -mx-5 border-b bg-white px-5 py-4 md:static md:mx-0 md:border-none md:bg-transparent md:px-0 md:py-0"
      />

      {isLoading ? (
        <LoadingContainer className="py-20" />
      ) : isError ? (
        <p className="text-xsmall14 text-neutral-40 py-20 text-center">
          목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.
        </p>
      ) : notices.length === 0 ? (
        <div className="bg-neutral-95 mt-5 flex w-full items-center justify-center rounded-sm py-52 md:mt-0">
          <p className="text-xsmall14 text-neutral-40">등록된 글이 없어요.</p>
        </div>
      ) : (
        <div>
          {notices.map((notice, index) => (
            <NoticeItem key={notice.id} notice={notice} isNew={index < 2} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoticesView;
