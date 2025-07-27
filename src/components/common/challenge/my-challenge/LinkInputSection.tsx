import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface LinkInputSectionProps {
  className?: string;
  disabled?: boolean;
  onLinkChange?: (link: string) => void;
  onLinkVerified?: (isVerified: boolean) => void;
}

const LinkInputSection = ({
  className,
  disabled = false,
  onLinkChange,
  onLinkVerified,
}: LinkInputSectionProps) => {
  const [linkValue, setLinkValue] = useState('');
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleLinkChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLinkValue(value);
    onLinkChange?.(value);

    // 링크가 변경되면 확인 상태 초기화
    setIsVerified(false);
    onLinkVerified?.(false);

    // 에러/성공 메시지 초기화
    setLinkError('');
    setLinkSuccess('');
  };

  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleLinkCheck = () => {
    if (!linkValue) {
      setLinkError('링크를 입력해주세요.');
      setIsVerified(false);
      onLinkVerified?.(false);
      return;
    }

    if (!isValidUrl(linkValue)) {
      setLinkError(
        'URL 형식이 올바르지 않습니다. (https:// 또는 http://로 시작해야 합니다.)',
      );
      setIsVerified(false);
      onLinkVerified?.(false);
      return;
    }

    setLinkSuccess(
      'URL을 올바르게 입력하셨습니다. 미션 소감을 작성하고 [제출하기] 버튼을 클릭해 주세요.',
    );
    setLinkError('');
    setIsVerified(true);
    onLinkVerified?.(true);
  };

  return (
    <section
      className={clsx(
        'transition-all duration-700 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
    >
      <div className="mb-1.5 transition-all delay-100 duration-500 ease-out">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="text-xsmall16 font-semibold text-neutral-0">
            링크
          </span>
        </div>
        <div className="rounded bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10">
          미션 링크는 <span className="font-bold">.notion.site</span> 형식의
          퍼블릭 링크만 입력 가능합니다. <br />
          제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.
        </div>
      </div>
      <div className="flex gap-2 transition-all delay-200 duration-500 ease-out">
        <textarea
          className={clsx(
            'flex-1 resize-none rounded-xxs border bg-white',
            'px-3 py-2 text-xsmall16 text-neutral-0 placeholder:text-neutral-50',
            'h-[44px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
            linkError ? 'border-red-500' : 'border-neutral-80',
          )}
          placeholder={'링크를 입력해주세요.'}
          value={linkValue}
          onChange={handleLinkChange}
          disabled={disabled}
        />
        <button
          className={clsx(
            'h-[44px] rounded-xxs px-4 text-xsmall16 font-medium transition-colors',
            'disabled:cursor-not-allowed',
            linkValue && !linkError
              ? 'bg-primary text-white hover:bg-primary-90'
              : 'bg-neutral-80 text-neutral-50',
          )}
          onClick={handleLinkCheck}
          disabled={disabled || !linkValue || !!linkError}
        >
          링크 확인
        </button>
      </div>
      <div className="transition-all delay-300 duration-300 ease-out">
        {linkError && (
          <p className="animate-fade-in mt-1 text-xsmall14 text-red-500">
            {linkError}
          </p>
        )}
        {linkSuccess && (
          <p className="animate-fade-in mt-1 text-xsmall14 text-primary">
            {linkSuccess}
          </p>
        )}
      </div>
    </section>
  );
};

export default LinkInputSection;
