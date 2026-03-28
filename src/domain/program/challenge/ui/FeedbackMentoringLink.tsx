import { twMerge } from '@/lib/twMerge';
import { ChallengeType } from '@/schema';
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
        'inline-flex items-center justify-center rounded-xxs border px-6 py-2.5 text-xsmall14 font-semibold transition-colors',
        className,
      )}
      style={{
        color: themeColor,
        borderColor: themeColor,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = themeColor;
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = themeColor;
      }}
    >
      플랜별 설명확인하기
    </a>
  );
}

export default FeedbackMentoringLink;
