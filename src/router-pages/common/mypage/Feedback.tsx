import { useMentorChallengeListQuery, useUserQuery } from '@/api/user';
import useAuthStore from '@/store/useAuthStore';

const Feedback = () => {
  const { isLoggedIn } = useAuthStore();
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: mentorChallengeData, isLoading } =
    useMentorChallengeListQuery();
  const challengeList = mentorChallengeData?.myChallengeMentorVoList || [];

  if (!user) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">참여 중</h2>
      {isLoading ? (
        <div className="text-neutral-500">로딩 중...</div>
      ) : challengeList.length > 0 ? (
        <>
          {challengeList.map((challenge) => (
            <div
              key={challenge.challengeId}
              className="flex w-[550px] items-center justify-between gap-2 rounded-sm border border-neutral-200 p-2"
            >
              <div className="flex items-center gap-4">
                <img
                  src={challenge.thumbnail || '/images/community1.png'}
                  alt="챌린지 썸네일"
                  className="h-24 w-40 rounded-sm object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-xsmall16 font-bold text-neutral-900">
                    {challenge.programStatusType === 'PREV'
                      ? '[이전]'
                      : challenge.programStatusType === 'CURRENT'
                        ? '[진행중]'
                        : '[예정]'}
                  </p>
                  <h3 className="text-base font-bold">{challenge.title}</h3>
                  <p className="text-sm text-neutral-600">
                    {challenge.shortDesc}
                  </p>
                  <p className="mt-2 text-xxsmall12 font-semibold">
                    진행기간{' '}
                    <span className="text-xxsmall12 font-semibold text-blue-700">
                      {new Date(challenge.startDate).toLocaleDateString(
                        'ko-KR',
                      )}{' '}
                      ~{' '}
                      {new Date(challenge.endDate).toLocaleDateString('ko-KR')}
                    </span>
                  </p>
                </div>
              </div>
              <button
                className="whitespace-nowrap rounded-xs border border-neutral-300 px-3 py-1 text-sm font-medium"
                onClick={() => alert('이동 처리 예정')}
              >
                피드백 페이지 이동
              </button>
            </div>
          ))}
        </>
      ) : (
        <div className="text-neutral-500">참여 중인 챌린지가 없습니다.</div>
      )}
    </section>
  );
};

export default Feedback;
