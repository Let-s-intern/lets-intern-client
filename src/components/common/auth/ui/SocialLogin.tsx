import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

type SocialType = 'KAKAO' | 'NAVER';

interface SocialLoginButtonProps {
  socialType: SocialType;
  isRecent: boolean;
  getLink: (socialType: SocialType) => string | undefined;
}

const SocialLoginButton = ({
  socialType,
  isRecent,
  getLink,
}: SocialLoginButtonProps) => {
  const socialConfig = {
    KAKAO: {
      bgColor: 'bg-[#FEE500]',
      iconSrc: '/icons/kakao-icon.svg',
      iconAlt: '카카오톡 아이콘',
      iconSize: 'w-[20px]',
    },
    NAVER: {
      bgColor: 'bg-[#2db400]',
      iconSrc: '/icons/naver-icon.svg',
      iconAlt: '네이버 아이콘',
      iconSize: 'h-4 w-4',
    },
  };

  const config = socialConfig[socialType];

  const handleClick = () => {
    // 소셜 로그인 버튼 클릭 시 localStorage에 저장
    localStorage.setItem('lastSocialLogin', socialType);
    alert(socialType);
  };

  return (
    <div className="relative">
      {isRecent && (
        <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-xxs bg-neutral-0 px-2 py-1 text-sm text-neutral-100 shadow-lg">
          최근 로그인
          <div className="absolute left-1/2 top-full -translate-x-1/2 transform border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-neutral-0"></div>
        </div>
      )}
      <a
        className={`flex h-[43px] w-[43px] items-center justify-center rounded-full ${config.bgColor}`}
        href={getLink(socialType)}
        onClick={handleClick}
        rel="noopener noreferrer"
      >
        <div className={config.iconSize}>
          <img
            className="h-full w-full"
            src={config.iconSrc}
            alt={config.iconAlt}
          />
        </div>
      </a>
    </div>
  );
};

const SocialLogin = ({ type }: SocialLoginProps) => {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [lastSocialLogin, setLastSocialLogin] = useState<SocialType | null>(
    null,
  );

  const socialLogins: SocialType[] = ['KAKAO', 'NAVER'];

  useEffect(() => {
    const last = localStorage.getItem('lastSocialLogin');
    if (last === 'KAKAO' || last === 'NAVER') {
      setLastSocialLogin(last);
    }
  }, []);

  const getSocialLink = (socialType: SocialType) => {
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
          {socialLogins.map((socialType) => (
            <SocialLoginButton
              key={socialType}
              socialType={socialType}
              isRecent={lastSocialLogin === socialType}
              getLink={getSocialLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
