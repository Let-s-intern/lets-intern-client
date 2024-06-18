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
    const path = `https://letsintern.kr/oauth2/authorize/${
      socialType === 'KAKAO' ? 'kakao' : socialType === 'NAVER' && 'naver'
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
            className={styles.kakao}
            onClick={() => handleSocialLogin('KAKAO')}
          >
            <i>
              <img src="/icons/kakao-icon.svg" alt="카카오톡 아이콘" />
            </i>
          </button>
          <button
            className={styles.naver}
            onClick={() => handleSocialLogin('NAVER')}
          >
            <i>
              <img src="/icons/naver-icon.svg" alt="네이버 아이콘" />
            </i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialLogin;
