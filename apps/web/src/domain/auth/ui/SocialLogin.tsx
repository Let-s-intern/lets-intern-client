'use client';

import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import { getUniversalBaseUrl } from '@/utils/url';
import { useSearchParams } from 'next/navigation';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

function SocialLoginContent({ type }: SocialLoginProps) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const getSocialLink = (socialType: 'KAKAO' | 'NAVER') => {
    const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
    if (!basePath) {
      return '#';
    }
    const redirectPath = `${getUniversalBaseUrl()}/${
      type === 'LOGIN' ? 'login' : 'signup'
    }?redirect=${encodeURIComponent(redirect)}`;
    return `${basePath}/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : 'naver'
    }?redirect_uri=${encodeURIComponent(redirectPath)}`;
  };

  const handleSocialClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!process.env.NEXT_PUBLIC_API_BASE_PATH) {
      e.preventDefault();
      alert('No base path.\n잠시 후 다시 로그인 해주세요.');
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="text-xsmall14 text-neutral-45 font-normal">
        또는 SNS 간편 {type === 'LOGIN' ? '로그인' : '회원 가입'}
      </h2>
      <div className="mt-8 flex gap-4">
        <a
          className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#FEE500] transition-opacity hover:opacity-80"
          href={getSocialLink('KAKAO')}
          onClick={handleSocialClick}
          rel="noopener noreferrer"
        >
          <img
            src="/icons/kakao-icon.svg"
            alt="카카오톡 아이콘"
            className="w-5"
          />
        </a>
        <a
          className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#2db400] transition-opacity hover:opacity-80"
          href={getSocialLink('NAVER')}
          onClick={handleSocialClick}
          rel="noopener noreferrer"
        >
          <img
            src="/icons/naver-icon.svg"
            alt="네이버 아이콘"
            className="h-4 w-4"
          />
        </a>
      </div>
    </div>
  );
}

export default function SocialLogin({ type }: SocialLoginProps) {
  return (
    <AsyncBoundary pendingFallback={null}>
      <SocialLoginContent type={type} />
    </AsyncBoundary>
  );
}
