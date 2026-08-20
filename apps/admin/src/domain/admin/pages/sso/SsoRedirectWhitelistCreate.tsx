import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCreateSsoRedirectWhitelist } from '@/api/sso';
import EditorTemplate from '@/domain/admin/program/ui/editor/EditorTemplate';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';

import { validateRedirectUri } from './validateRedirectUri';

/**
 * SSO 리다이렉트 화이트리스트 등록 (LC-3208, PRD 6.3).
 *
 * 입력은 서비스명과 허용 리다이렉트 URL 둘뿐이다. 활성화 여부는 서버가 켠 채로 만든다 —
 * 꺼진 채로 생기면 등록했는데 로그인이 안 된다는 문의가 따라붙는다.
 */

const LABEL_CLASS = 'text-xsmall14 font-medium';
const INPUT_CLASS =
  'rounded-xxs border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary';

const SsoRedirectWhitelistCreate = () => {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();

  const [serviceName, setServiceName] = useState('');
  const [allowedRedirectUri, setAllowedRedirectUri] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { mutate: create, isPending } = useCreateSsoRedirectWhitelist({
    successCallback: () => {
      snackbar('화이트리스트에 등록했습니다.');
      navigate('/sso/redirect-whitelist');
    },
    errorCallback: (error) => {
      console.error('[SsoRedirectWhitelistCreate] create failed', error);
      /*
        서버 사유를 그대로 보여준다. 중복 URL 처럼 운영이 곧바로 고칠 수 있는 사유가
        `등록 실패` 한 줄로 뭉개지면 같은 값을 계속 다시 넣는다.
      */
      setError(`등록에 실패했습니다: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 응답을 기다리는 동안 다시 누르면 같은 URL 이 두 번 등록된다.
    if (isPending) return;

    if (!serviceName.trim()) {
      setError('서비스명을 입력해 주세요.');
      return;
    }

    const uriError = validateRedirectUri(allowedRedirectUri);
    if (uriError) {
      setError(uriError);
      return;
    }

    setError(null);
    create({
      serviceName: serviceName.trim(),
      allowedRedirectUri: allowedRedirectUri.trim(),
    });
  };

  return (
    <EditorTemplate
      title="SSO 리다이렉트 화이트리스트 등록"
      onSubmit={handleSubmit}
      submitButton={{ text: '등록' }}
      cancelButton={{ text: '취소', to: '/sso/redirect-whitelist' }}
    >
      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS} htmlFor="sso-service-name">
          서비스명
        </label>
        <input
          id="sso-service-name"
          className={INPUT_CLASS}
          value={serviceName}
          placeholder="FreeSeminarVodHub"
          onChange={(e) => setServiceName(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={LABEL_CLASS} htmlFor="sso-allowed-redirect-uri">
          허용 리다이렉트 URL
        </label>
        <input
          id="sso-allowed-redirect-uri"
          className={INPUT_CLASS}
          value={allowedRedirectUri}
          placeholder="https://vod.letscareer.co.kr/auth/callback"
          onChange={(e) => setAllowedRedirectUri(e.target.value)}
        />
        <span className="text-neutral-40 text-xs">
          SSO 로그인 후 이동할 콜백 주소를 전체 주소로 입력합니다.
        </span>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </EditorTemplate>
  );
};

export default SsoRedirectWhitelistCreate;
