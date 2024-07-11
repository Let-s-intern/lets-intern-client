import { useSearchParams } from 'react-router-dom';

import styles from './SocialLogin.module.scss';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

const SocialLogin = ({ type }: SocialLoginProps) => {
  const [searchParams] = useSearchParams();

  const handleSocialLogin = (socialType: 'KAKAO' | 'NAVER') => {
    const redirectPath = `${window.location.protocol}//${
      window.location.hostname
    }:${window.location.port}/${type === 'LOGIN' ? 'login' : 'signup'}${
      searchParams.get('redirect')
        ? `?redirect=${searchParams.get('redirect')}`
        : ''
    }`;

    const basePath =
      process.env.REACT_APP_API_BASE_PATH || 'https://letscareer-test.shop';
    const path = `${basePath}/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : 'naver'
    }?redirect_uri=${redirectPath}`;
    window.location.href = path;
  };

  return (
    <div className={styles.login}>
      <span className={styles['gray-text']}>또는</span>
      <div className={styles.content}>
        <h2>SNS 계정으로 {type === 'LOGIN' ? '로그인' : '회원가입'}하기</h2>
        <div className={styles.buttons}>
          <button
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#FEE500]"
            onClick={() => handleSocialLogin('KAKAO')}
          >
            <div className="w-[20px]">
              <img
                className="h-full w-full"
                src="/icons/kakao-icon.svg"
                alt="카카오톡 아이콘"
              />
            </div>
          </button>
          <button
            className="flex h-[43px] w-[43px] items-center justify-center rounded-full bg-[#2db400]"
            onClick={() => handleSocialLogin('NAVER')}
          >
            <div className="h-4 w-4">
              <img
                className="h-full w-full"
                src="/icons/naver-icon.svg"
                alt="네이버 아이콘"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
