import useAuthStore from '@/store/useAuthStore';
import axios from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import NavBar from '../challenge/ui/layout/NavBar';

const ReportLayout = ({ children }: { children: React.ReactNode }) => {
  const params = useParams<{ programId: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  const { data: isValidUserAccessData, isLoading: isValidUserAccessLoading } =
    useQuery({
      enabled: isLoggedIn,
      queryKey: ['challenge', params.programId, 'access'],
      queryFn: async () => {
        const res = await axios.get(`/challenge/${params.programId}/access`);
        return res.data as { data: { isAccessible?: boolean | null } };
      },
    });

  const { data: isValidUserInfoData, isLoading: isValidUserInfoLoading } =
    useQuery({
      enabled: isLoggedIn,
      queryKey: ['user', 'challenge-info'],
      queryFn: async () => {
        const res = await axios.get(`/user/challenge-info`);
        return res.data as { data: { pass?: boolean | null } };
      },
    });

  const isValidUserInfo = isValidUserInfoData?.data?.pass;

  const isLoading = isValidUserInfoLoading || isValidUserAccessLoading;

  useEffect(() => {
    if (!isLoggedIn) {
      const newUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams();
      searchParams.set('redirect', `${newUrl.pathname}?${newUrl.search}`);
      router.push(`/login?${searchParams.toString()}`);
      return;
    }

    if (isLoading) {
      return;
    }

    if (!isValidUserInfo) {
      router.push(`/challenge/${params.programId}/user/info`);
      return;
    }
  }, [isLoading, isLoggedIn, isValidUserInfo, router, params.programId]);

  return (
    <div className="min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)]">
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center sm:h-[calc(100vh-6rem)] lg:hidden">
        <div className="-mt-24">
          <h1 className="text-neutral-black text-center text-2xl font-semibold">
            챌린지 페이지는
            <br />
            데스크탑에서만 이용 가능합니다!
          </h1>
          <p className="mt-2 text-center">
            데스크탑으로 접속해주시거나
            <br />
            화면의 크기를 좌우로 늘려주세요!
          </p>
        </div>
      </div>
      <div className="hidden px-6 py-6 lg:block">
        <div className="mx-auto flex w-[1024px]">
          <NavBar />
          <div className="min-w-0 flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportLayout;
