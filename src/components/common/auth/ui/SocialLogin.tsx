import { getUniversalBaseUrl } from '@/utils/url';
import { useSearchParams } from 'next/navigation';
import styles from './SocialLogin.module.scss';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

const SocialLogin = ({ type }: SocialLoginProps) => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const getSocialLink = (socialType: 'KAKAO' | 'NAVER') => {
    const redirectPath = `${getUniversalBaseUrl()}/${type === 'LOGIN' ? 'login' : 'signup'}?redirect=${redirect}`;
    const basePath = process.env.NEXT_PUBLIC_API_BASE_PATH;
    if (!basePath) {
      alert('No base path.\n잠시 후 다시 로그인 해주세요.');
      return;
    }
    const path = `${basePath}/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : 'naver'
    }?redirect_uri=${redirectPath}`;

    return path;
  };

  return (
    <div className={styles.login}>
      <div className={styles.content}>
        <h2 className="text-xsmall14 font-normal text-neutral-45">
          또는 SNS 간편 {type === 'LOGIN' ? '로그인' : '회원 가입'}
        </h2>
        <div className={styles.buttons}>
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
  );
};

export default SocialLogin;
