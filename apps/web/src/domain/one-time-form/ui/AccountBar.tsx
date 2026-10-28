import { useUserQuery } from '@/api/user/user';

/** 정보 입력 상단의 로그인 계정 표시(시안 2절) */
const AccountBar = () => {
  const { data: user } = useUserQuery();

  if (!user) return null;

  return (
    <div className="border-neutral-80 text-xsmall14 mt-3 flex items-center justify-between rounded-sm border px-3.5 py-3">
      <div className="min-w-0">
        <b className="block font-semibold">{user.name}님 계정으로 신청</b>
        <small className="text-xxsmall12 text-neutral-40 mt-px block truncate">
          {user.email}
        </small>
      </div>
      <span className="bg-primary-10 text-xxsmall12 text-primary rounded-xxs flex-none whitespace-nowrap px-2 py-[3px] font-semibold">
        로그인됨
      </span>
    </div>
  );
};

export default AccountBar;
