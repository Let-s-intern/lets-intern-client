import { twMerge } from '@/lib/twMerge';
import { ChallengeType } from '@/schema';
import { CSSProperties } from 'react';
import { getFeedbackMentoringUrl } from '../feedback-mentoring-link';

interface Props {
  challengeType: ChallengeType;
  themeColor: string;
  className?: string;
}

/**
 * 피드백 멘토링 상세 안내 페이지로 이동하는 아웃라인 버튼.
 * 대상 챌린지 타입이 아니면 렌더링하지 않는다.
 */
function FeedbackMentoringLink({
  challengeType,
  themeColor,
  className,
}: Props) {
  const url = getFeedbackMentoringUrl(challengeType);
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={twMerge(
        'rounded-xxs text-xsmall14 inline-flex items-center justify-center border border-[var(--theme-color)] px-6 py-2.5 font-semibold text-[var(--theme-color)] transition-colors hover:bg-[var(--theme-color)] hover:text-white',
        className,
      )}
      style={
        {
          '--theme-color': themeColor,
        } as CSSProperties
      }
    >
      플랜별 상세 설명 확인하기
    </a>
  );
}

export default FeedbackMentoringLink;
