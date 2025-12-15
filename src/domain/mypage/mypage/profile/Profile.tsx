'use client';

import { useUserQuery } from '@/api/user';
import { useRouter } from 'next/navigation';

function ProfileAvatar() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
    >
      <rect width="48" height="48" rx="24" fill="#EDEEFE" />
      <path
        d="M37.5086 36.7493C35.3698 37.9877 31.4594 35.4555 27.6754 30.7697C28.8737 34.551 28.8312 37.5684 27.3065 38.4513C25.5879 39.4464 22.4691 37.45 19.4722 33.7436C19.9403 36.1015 19.5966 38.0098 18.3756 38.7168C16.3493 39.8901 12.6745 37.311 10.1677 32.9564C7.66088 28.6017 7.27129 24.1204 9.29754 22.9471C10.5185 22.2401 12.3381 22.8956 14.1401 24.4812C12.438 20.0248 12.2734 16.3176 13.992 15.3225C15.5168 14.4396 18.1436 15.9114 20.8097 18.843C18.6555 13.2135 18.4242 8.55103 20.5629 7.31262C23.4576 5.63651 29.5975 10.8674 34.2769 18.9961C38.9564 27.1248 40.4032 35.0732 37.5086 36.7493Z"
        fill="#CACCFC"
      />
    </svg>
  );
}

// 프로필 정보 행 컴포넌트
interface ProfileInfoRowProps {
  label: string;
  value: string;
  isLoading?: boolean;
  skeletonWidth?: string;
}

function ProfileInfoRow({
  label,
  value,
  isLoading,
  skeletonWidth = 'w-32',
}: ProfileInfoRowProps) {
  return (
    <div className="flex h-5 flex-nowrap gap-1.5">
      <span className="flex-shrink-0 text-sm text-neutral-40">{label}</span>
      {isLoading ? (
        <div
          className={`rounded h-5 animate-pulse bg-neutral-90 ${skeletonWidth}`}
        />
      ) : (
        <span
          className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-primary-dark"
          title={value}
        >
          {value}
        </span>
      )}
    </div>
  );
}

export function Profile() {
  const router = useRouter();
  const { data: user, isLoading } = useUserQuery();

  const userName = user?.name || '사용자';
  const wishJobDisplay = user?.wishJob || '미설정';
  const wishCompanyDisplay = user?.wishCompany || '미설정';

  const handleClickProfileEdit = () => {
    router.push('/mypage/career/plan');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex flex-col rounded-sm border border-neutral-80 p-4">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full">
          <div className="h-12 w-12 animate-pulse rounded-full bg-neutral-90" />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="rounded h-6 w-20 animate-pulse bg-neutral-90" />
          <ProfileInfoRow
            label="희망직무"
            value=""
            isLoading
            skeletonWidth="w-32"
          />
          <ProfileInfoRow
            label="희망기업"
            value=""
            isLoading
            skeletonWidth="w-24"
          />
        </div>

        <div className="mt-5 h-9 w-full animate-pulse rounded-xxs bg-neutral-90" />
      </div>
    );
  }

  // (에러 시 기본값 표시)
  return (
    <div className="flex flex-col rounded-sm border border-neutral-80 p-4">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full">
        <ProfileAvatar />
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="flex text-xsmall16 font-medium text-neutral-0">
          {userName} 님
        </p>

        <ProfileInfoRow label="희망직무" value={wishJobDisplay} />
        <ProfileInfoRow label="희망기업" value={wishCompanyDisplay} />
      </div>

      <button
        className="mt-5 w-full rounded-xxs border border-neutral-80 px-3 py-1.5 text-xsmall14 font-normal text-neutral-20"
        onClick={handleClickProfileEdit}
      >
        프로필 수정
      </button>
    </div>
  );
}
