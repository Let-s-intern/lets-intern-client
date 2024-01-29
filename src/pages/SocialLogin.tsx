import { useSearchParams } from 'react-router-dom';

import './SocialLogin.scss';

interface SocialLoginProps {
  type: 'LOGIN' | 'SIGN_UP';
}

const SocialLogin = ({ type }: SocialLoginProps) => {
  const [searchParams] = useSearchParams();

  const handleSocialLogin = (type: 'KAKAO' | 'NAVER') => {
    const redirectPath = `${window.location.protocol}//${
      window.location.hostname
    }:${window.location.port}/login${
      searchParams.get('redirect')
        ? `?redirect=${searchParams.get('redirect')}`
        : ''
    }`;
    const path = `https://letsintern.kr/oauth2/authorize/${
      type === 'KAKAO' ? 'kakao' : type === 'NAVER' && 'naver'
    }?redirect_uri=${redirectPath}`;
    window.location.href = path;
  };

  return (
    <div className="social-login">
      <span className="gray-label">또는</span>
      <div className="social-login-content">
        <h2>SNS 계정으로 {type === 'LOGIN' ? '로그인' : '회원가입'}하기</h2>
        <div className="button-group">
          <button
            className="kakao-login-button"
            onClick={() => handleSocialLogin('KAKAO')}
          >
            <i>
              <img src="/icons/kakao-icon.svg" alt="카카오톡 아이콘" />
            </i>
          </button>
          <button
            className="naver-login-button"
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
