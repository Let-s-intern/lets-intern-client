import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface LinkInputSectionProps {
  className?: string;
  disabled?: boolean;
  onLinkChange?: (link: string) => void;
  onLinkVerified?: (isVerified: boolean) => void;
  text?: string;
  todayTh?: number;
  initialLink?: string;
  isSubmitted?: boolean;
  isEditing?: boolean;
}

const LinkInputSection = ({
  className,
  disabled = false,
  onLinkChange,
  onLinkVerified,
  text,
  todayTh,
  initialLink = '',
  isSubmitted = false,
  isEditing = false,
}: LinkInputSectionProps) => {
  const [linkValue, setLinkValue] = useState(initialLink);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState('');
  const [isVerified, setIsVerified] = useState(!!initialLink);
  const [verifiedLink, setVerifiedLink] = useState(initialLink); // 확인된 링크 저장

  // initialLink나 상태가 변경될 때마다 상태 업데이트
  useEffect(() => {
    setLinkValue(initialLink);
    const hasLink = !!initialLink;

    // 이미 제출된 상태라면 링크가 확인된 상태로 설정
    if (isSubmitted && hasLink) {
      setIsVerified(true);
      setVerifiedLink(initialLink);
      setLinkError('');
      setLinkSuccess('');
      onLinkVerified?.(true);
    } else if (hasLink) {
      // 새로운 링크가 있지만 아직 확인되지 않은 상태
      setIsVerified(false);
      setVerifiedLink('');
      setLinkError('');
      setLinkSuccess('');
      onLinkVerified?.(false);
    } else {
      // 링크가 없는 상태
      setIsVerified(false);
      setVerifiedLink('');
      setLinkError('');
      setLinkSuccess('');
      onLinkVerified?.(false);
    }
  }, [initialLink, isSubmitted, isEditing]); // isSubmitted, isEditing 추가

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLinkValue(value);
    onLinkChange?.(value);

    // 수정 중이거나 새로 입력하는 경우에만 확인 상태 초기화
    if (!isSubmitted || isEditing) {
      if (value !== verifiedLink) {
        setIsVerified(false);
        onLinkVerified?.(false);
        setVerifiedLink('');
        setLinkError('');
        setLinkSuccess('');
      }
    }
  };

  const isValidUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const isValidProtocol =
        urlObj.protocol === 'http:' || urlObj.protocol === 'https:';

      // todayTh가 1~99 사이일 때 .notion.site 포함 여부 체크
      const isRegularMissionWithNotionLink =
        todayTh && todayTh >= 1 && todayTh <= 99;

      if (isRegularMissionWithNotionLink) {
        return isValidProtocol && url.includes('.notion.site');
      }

      return isValidProtocol;
    } catch {
      return false;
    }
  };

  const handleLinkCheck = () => {
    // 이미 확인된 링크를 다시 클릭한 경우
    if (isVerified && linkValue === verifiedLink) {
      window.open(linkValue, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!linkValue) {
      setLinkError('링크를 입력해주세요.');
      setIsVerified(false);
      onLinkVerified?.(false);
      return;
    }

    if (!isValidUrl(linkValue)) {
      const isRegularMissionWithNotionLink =
        todayTh && todayTh >= 1 && todayTh <= 99;
      const errorMessage = isRegularMissionWithNotionLink
        ? 'URL 형식이 올바르지 않습니다. (https:// 또는 http://로 시작하고 .notion.site가 포함되어야 합니다.)'
        : 'URL 형식이 올바르지 않습니다. (https:// 또는 http://로 시작해야 합니다.)';

      setLinkError(errorMessage);
      setIsVerified(false);
      onLinkVerified?.(false);
      return;
    }

    setLinkSuccess(
      'URL을 올바르게 입력하셨습니다. 미션 소감을 작성하고 [제출하기] 버튼을 클릭해 주세요.',
    );
    setLinkError('');
    setIsVerified(true);
    setVerifiedLink(linkValue); // 확인된 링크 저장
    onLinkVerified?.(true);
  };

  const getButtonText = () => {
    if (isVerified && linkValue === verifiedLink) {
      return '링크 열기';
    }
    return '링크 확인';
  };

  return (
    <section className={clsx(className)}>
      <div className="mb-1.5 transition-all delay-100 duration-500 ease-out">
        <div className="mb-1 flex items-center gap-2 md:mb-1.5">
          <span className="text-xsmall14 font-semibold text-neutral-0 md:text-xsmall16">
            링크
          </span>
        </div>
        <div className="rounded mb-3 whitespace-pre-line bg-neutral-95 px-3 py-3 text-xsmall14 text-neutral-10 md:mb-0">
          {text ||
            '미션 링크는 .notion.site 형식의 퍼블릭 링크만 입력 가능합니다.\n제출 후, 미션과 소감을 카카오톡으로 공유해야 제출이 인정됩니다.'}
        </div>
      </div>
      <div className="flex gap-2 transition-all delay-200 duration-500 ease-out">
        <input
          type="text"
          className={clsx(
            'flex-1 items-center rounded-xxs border bg-white',
            'px-3 py-2 text-xsmall14 text-neutral-0 placeholder:text-neutral-50 md:text-xsmall16',
            'h-[44px] outline-none focus:border-primary',
            'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-50',
            linkError ? 'border-red-500' : 'border-neutral-80',
          )}
          placeholder={'링크를 입력해주세요.'}
          value={linkValue}
          onChange={handleLinkChange}
          disabled={disabled || (isSubmitted && !isEditing)}
        />
        <button
          className={clsx(
            'h-[44px] rounded-xxs px-4 text-xsmall16 font-medium transition-colors',
            'disabled:cursor-not-allowed disabled:bg-neutral-70 disabled:text-neutral-100',
            isVerified && linkValue === verifiedLink
              ? 'bg-green-500 text-white hover:bg-green-600'
              : linkValue && !linkError
                ? 'bg-primary text-white hover:bg-primary-90'
                : 'bg-neutral-80 text-neutral-50',
          )}
          onClick={handleLinkCheck}
          disabled={disabled || !linkValue || !!linkError}
        >
          {getButtonText()}
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
