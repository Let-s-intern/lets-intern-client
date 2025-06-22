import LinkButton from '@/components/common/mypage/ui/button/LinkButton';

interface Challenge {
  challengeId: number;
  title: string;
  shortDesc: string;
  thumbnail?: string;
  startDate: string;
  endDate: string;
}

interface FeedbackCardProps {
  challenge: Challenge;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ challenge }) => {
  return (
    <div className="flex h-full w-[169px] flex-col items-start gap-4 overflow-hidden rounded-xs md:w-full md:flex-row md:border md:border-neutral-85 md:p-2.5">
      <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:gap-4">
        <img
          src={challenge.thumbnail || '/images/community1.png'}
          alt="챌린지 썸네일"
          className="h-[7.5rem] w-full bg-primary-light object-cover md:h-[9rem] md:w-[11rem] md:rounded-xs"
        />
        <div className="flex flex-1 flex-col justify-between gap-2 py-2">
          <div className="flex w-full flex-col gap-y-0.5">
            <h2 className="font-semibold">{challenge.title}</h2>
            <p className="line-clamp-2 h-10 text-sm text-neutral-30">
              {challenge.shortDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 md:justify-start">
            <span className="text-xs text-neutral-0">진행기간</span>
            <span className="text-xs font-medium text-primary-dark">
              {new Date(challenge.startDate)
                .toLocaleDateString('ko-KR', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\./g, '.')
                .replace(/\s/g, '')}{' '}
              ~{' '}
              {new Date(challenge.endDate)
                .toLocaleDateString('ko-KR', {
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                })
                .replace(/\./g, '.')
                .replace(/\s/g, '')}
            </span>
          </div>
        </div>
      </div>
      <LinkButton
        to={`/admin/challenge/operation/${challenge.challengeId}/feedback`}
        target="_blank"
        rel="noopener noreferrer"
      >
        피드백 페이지 이동
      </LinkButton>
    </div>
  );
};

export default FeedbackCard;
