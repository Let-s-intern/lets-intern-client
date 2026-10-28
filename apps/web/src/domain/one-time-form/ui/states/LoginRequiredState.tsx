import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ComponentProps } from 'react';
import ProductCard from '../ProductCard';
import StateScreen, { primaryButtonClass } from './StateScreen';

interface LoginRequiredStateProps {
  form: ComponentProps<typeof ProductCard>['form'];
}

/** 비로그인. 로그인 페이지가 redirect 로 같은 경로(쿼리 포함)에 돌려보낸다 */
const LoginRequiredState = ({ form }: LoginRequiredStateProps) => {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const returnPath = search ? `${pathname}?${search}` : pathname;

  return (
    <StateScreen
      top={
        <div className="mb-3 w-full text-left">
          <ProductCard form={form} />
        </div>
      }
      heading={
        <>
          렛츠커리어 로그인 후<br />
          신청할 수 있어요
        </>
      }
      description="로그인하면 이 화면으로 바로 돌아와요."
      footer={
        <Link
          href={`/login?redirect=${encodeURIComponent(returnPath)}`}
          className={primaryButtonClass}
        >
          로그인하고 계속하기
        </Link>
      }
    />
  );
};

export default LoginRequiredState;
