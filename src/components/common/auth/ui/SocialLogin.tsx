import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

const SocialLogin = ({ type }: SocialLoginProps) => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [lastSocialLogin, setLastSocialLogin] = useState<
    'KAKAO' | 'NAVER' | null
  >(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const last = localStorage.getItem('lastSocialLogin');
      if (last === 'KAKAO' || last === 'NAVER') {
        setLastSocialLogin(last);
      }
    }
  }, []);

  const getSocialLink = (socialType: 'KAKAO' | 'NAVER') => {
    const redirectPath = `${window.location.origin}/${type === 'LOGIN' ? 'login' : 'signup'}?redirect=${redirect}`;
    const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
    if (!basePath) {
      alert('No base path.\n잠시 후 다시 로그인 해주세요.');
      return;
    }
    const path = `${basePath}/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : 'naver'
    }?redirect_uri=${redirectPath}&state=${socialType}`;

    return path;
  };

  return (
    <div>
      <span className="my-6 block text-center text-sm text-gray-500">
        또는 간편 로그인
      </span>
      <div className="flex flex-col items-center">
        <div className="mt-4 flex gap-4">
          <div className="relative">
            {lastSocialLogin === 'KAKAO' && (
              <div className="rounded absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-xs bg-neutral-0 px-2 py-1 text-sm text-neutral-100 shadow-lg">
                최근 로그인
                <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#27272D]"></div>
              </div>
            )}
            <a
              className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#FEE500]"
              href={getSocialLink('KAKAO')}
              rel="noopener noreferrer"
            >
              <div className="w-[20px]">
                <img
                  className="h-full w-full"
                  src="/icons/kakao-icon.svg"
                  alt="카카오톡 아이콘"
                />
              </div>
            </a>
          </div>
          <div className="relative">
            {lastSocialLogin === 'NAVER' && (
              <div className="rounded absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap bg-[#27272D] px-2 py-1 text-sm text-white shadow-lg">
                최근 로그인
                <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#27272D]"></div>
              </div>
            )}
            <a
              className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#2db400]"
              href={getSocialLink('NAVER')}
              rel="noopener noreferrer"
            >
              <div className="h-4 w-4">
                <img
                  className="h-full w-full"
                  src="/icons/naver-icon.svg"
                  alt="네이버 아이콘"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
