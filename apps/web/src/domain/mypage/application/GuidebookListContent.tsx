'use client';

// 오공고 마이페이지가 iframe 으로 넣는 구매한 가이드북 목록(LC-3677). 헤더·푸터 없이 목록만 그린다.
// 특정 상품으로 거르지 않고 산 가이드북을 모두 보이며, 구매가 없으면 GuidebookSection 의 빈 상태가 그대로 보인다.
import { mypageApplicationsQueryOptions } from '@/api/application';
import LoadingContainer from '@/common/loading/LoadingContainer';
import useAuthStore from '@/store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import GuidebookSection from './section/GuidebookSection';

const LOGIN_HREF = `/login?redirect=${encodeURIComponent('/mypage/application')}`;

const LoginRequired = () => (
  <div className="flex flex-col items-center gap-5 py-[100px]">
    <p className="text-xsmall14 font-normal text-neutral-20">
      로그인이 필요해요
    </p>
    <a
      href={LOGIN_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xxs border border-primary bg-white px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
    >
      새 탭에서 로그인하기
    </a>
  </div>
);

const GuidebookListContent = () => {
  const { isLoggedIn, isInitialized } = useAuthStore();
  const { data, isError } = useQuery({
    ...mypageApplicationsQueryOptions,
    enabled: isLoggedIn,
  });

  const renderBody = () => {
    if (!isInitialized) return <LoadingContainer className="py-10" />;
    // iframe 안에서 로그인 화면으로 보내지 않는다(소셜 로그인이 막힌다). 새 탭에서 로그인하게 한다.
    if (!isLoggedIn) return <LoginRequired />;
    if (isError) {
      return (
        <p className="py-10 text-center text-xsmall14 text-neutral-30">
          구매한 가이드북을 불러오지 못했어요.
        </p>
      );
    }
    if (!data) return <LoadingContainer className="py-10" />;

    return (
      <GuidebookSection
        applicationList={data.filter(
          (application) => application.programType === 'GUIDEBOOK',
        )}
      />
    );
  };

  return <main className="w-full px-5 py-5">{renderBody()}</main>;
};

export default GuidebookListContent;
