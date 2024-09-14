import { useSearchParams } from 'react-router-dom';

import styles from './SocialLogin.module.scss';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

const SocialLogin = ({ type }: SocialLoginProps) => {
  const [searchParams] = useSearchParams();

  const getSocialLink = (socialType: 'KAKAO' | 'NAVER') => {
    const redirectPath = `${window.location.origin}/${type === 'LOGIN' ? 'login' : 'signup'}${
      searchParams.get('redirect')
        ? `?redirect=${searchParams.get('redirect')}`
        : ''
    }`;
    const basePath =
      import.meta.env.VITE_API_BASE_PATH || 'https://letscareer.store';
    const path = `${basePath}/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : 'naver'
    }?redirect_uri=${redirectPath}`;

    return path;
  };

  return (
    <div className={styles.login}>
      <span className={styles['gray-text']}>또는</span>
      <div className={styles.content}>
        <h2>SNS 계정으로 {type === 'LOGIN' ? '로그인' : '회원가입'}하기</h2>
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
