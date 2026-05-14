'use client';

import BaseModal from '@/common/modal/BaseModal';
import BaseBottomSheet from '@/common/sheet/BaseBottomSheet';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';
import { Folder, X } from 'lucide-react';
import { useState } from 'react';
import { useLibraryMyVisit } from '../hooks/useLibraryMyVisit';

function NoticeContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative flex flex-col items-center gap-3 pb-6 pt-4 text-center md:gap-5 md:pb-10 md:pt-16">
      <button
        type="button"
        onClick={onClose}
        className="text-neutral-40 hover:text-neutral-20 absolute right-4 top-4 hidden md:block"
        aria-label="닫기"
      >
        <X size={20} />
      </button>
      <div className="bg-primary-10 w-15 flex h-[60px] items-center justify-center rounded-full">
        <Folder size={36} className="fill-[#8288F8] stroke-[#8288F8]" />
      </div>
      <p className="text-small20 md:text-medium24 font-bold">
        신청한 모든 무료 자료집은
        <br />
        여기 &apos;MY 자료집&apos;에서 볼 수 있어요!
      </p>
      <p className="text-xsmall14 text-neutral-40 pt-8 md:pt-10">
        * 처음 회원가입 시 가입 후 신청한 자료집이 반영되기까지
        <br />
        최대 1주일 소요될 수 있습니다.
      </p>
    </div>
  );
}

export default function LibraryMyVisitNotice() {
  const { visitState, markVisited } = useLibraryMyVisit();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const [snackbarDismissed, setSnackbarDismissed] = useState(false);

  if (visitState === null) return null;

  if (visitState === 'first') {
    return isMobile ? (
      <BaseBottomSheet isOpen onClose={markVisited}>
        <NoticeContent onClose={markVisited} />
      </BaseBottomSheet>
    ) : (
      <BaseModal isOpen onClose={markVisited} className="max-w-[560px]">
        <NoticeContent onClose={markVisited} />
      </BaseModal>
    );
  }

  if (!snackbarDismissed) {
    return (
      <div className="bg-neutral-0 fixed bottom-[4.5rem] left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-5 py-4 opacity-60 shadow-lg md:bottom-6">
        <span className="text-xsmall16 whitespace-nowrap text-white">
          신청한 모든 무료 자료집은
          <br className="md:hidden" /> 여기 MY 자료집에서 볼 수 있어요!
        </span>
        <button
          type="button"
          onClick={() => setSnackbarDismissed(true)}
          aria-label="닫기"
        >
          <X size={24} className="text-white" />
        </button>
      </div>
    );
  }

  return null;
}
