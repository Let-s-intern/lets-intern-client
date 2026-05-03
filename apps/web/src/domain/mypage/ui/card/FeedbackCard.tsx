'use client';

import { buildCrossAppUrl } from '@/common/utils/crossAppUrl';
import LinkButton from '@/domain/mypage/ui/button/LinkButton';

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
  // 운영 배포에서 /mentor 는 별도 서브도메인(NEXT_PUBLIC_MENTOR_URL)으로 리다이렉트되며
  // 서브도메인은 localStorage 가 분리돼 그대로 이동하면 미로그인 상태가 된다.
  // buildCrossAppUrl 이 토큰을 #__sso= 해시로 붙여 자동 로그인하도록 한다.
  // env 미설정(=같은 web 내 라우트) 환경에서는 단순 경로로 fallback.
  const href = buildCrossAppUrl(
    process.env.NEXT_PUBLIC_MENTOR_URL,
    '/mentor',
    `/challenges/${challenge.challengeId}`,
  );

  return (
    <div className="rounded-xs md:border-neutral-85 flex h-full w-[169px] flex-col items-start gap-4 overflow-hidden md:w-full md:flex-row md:border md:p-2.5">
      <div className="flex w-full flex-1 flex-col gap-2 md:flex-row md:gap-4">
        <img
          src={challenge.thumbnail || '/images/community1.png'}
          alt="챌린지 썸네일"
          className="bg-primary-light md:rounded-xs h-[7.5rem] w-full object-cover md:h-[9rem] md:w-[11rem]"
        />
        <div className="flex flex-1 flex-col justify-between gap-2 py-2">
          <div className="flex w-full flex-col gap-y-0.5">
            <h2 className="font-semibold">{challenge.title}</h2>
            <p className="text-neutral-30 line-clamp-2 h-10 text-sm">
              {challenge.shortDesc}
            </p>
          </div>
          <div className="flex items-center gap-1.5 md:justify-start">
            <span className="text-neutral-0 text-xs">진행기간</span>
            <span className="text-primary-dark text-xs font-medium">
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
      <LinkButton to={href}>피드백 페이지 이동</LinkButton>
    </div>
  );
};

export default FeedbackCard;
