import { useMentorListQuery, useUserQuery } from '@/api/user';
import useAuthStore from '@/store/useAuthStore';
import { useMemo } from 'react';

const Feedback = () => {
  const { isLoggedIn } = useAuthStore();
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: mentorListData } = useMentorListQuery();

  const isMentorMatched = useMemo(() => {
    if (!user?.name || !mentorListData?.mentorList) return false;
    return mentorListData.mentorList.some(
      (mentor) => mentor.name === user.name,
    );
  }, [user, mentorListData]);

  if (!user) return null;

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">참여 중</h2>
      {isMentorMatched ? (
        <>
          {[1, 2].map((_, index) => (
            <div
              key={index}
              className="flex w-full items-center justify-between rounded-lg border border-neutral-200 p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/challenge-thumbnail.png"
                  alt="챌린지 썸네일"
                  className="h-24 w-40 rounded-md object-cover"
                />
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-neutral-400">
                    [HANCOM AI 아카데미 1기]
                  </p>
                  <h3 className="text-base font-bold">취업 준비 시작 챌린지</h3>
                  <p className="text-sm text-neutral-600">
                    경험 정리와 직무 탐색으로 시작해 이력서를 완성하는 2주
                    챌린지입니다.
                  </p>
                  <p className="text-sm">
                    진행기간{' '}
                    <span className="text-primary">25.04.25 ~ 25.07.13</span>
                  </p>
                </div>
              </div>
              <button
                className="rounded-md border border-neutral-300 px-3 py-1 text-sm font-medium"
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
