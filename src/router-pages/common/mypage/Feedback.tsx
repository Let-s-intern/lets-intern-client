import { useMentorListQuery, useUserQuery } from '@/api/user';
import useAuthStore from '@/store/useAuthStore';
import { useMemo } from 'react';

const Feedback = () => {
  const { isLoggedIn } = useAuthStore();
  const { data: user } = useUserQuery({ enabled: isLoggedIn, retry: 1 });
  const { data: mentorListData } = useMentorListQuery();
  // console.log(mentorListData);
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
              className="flex w-[550px] items-center justify-between gap-2 rounded-sm border border-neutral-200 p-2"
            >
              <div className="flex items-center gap-4">
                <img
                  src="/images/community1.png"
                  alt="챌린지 썸네일"
                  className="h-24 w-40 rounded-sm object-cover"
                />
                <div className="flex flex-col">
                  <p className="text-xsmall16 font-bold text-neutral-900">
                    [HANCOM AI 아카데미 1기]
                  </p>
                  <h3 className="text-base font-bold">취업 준비 시작 챌린지</h3>
                  <p className="text-sm text-neutral-600">
                    경험 정리와 직무 탐색으로 시작해 이력서를 완성하는 2주
                    챌린지입니다.
                  </p>
                  <p className="mt-2 text-xxsmall12 font-semibold">
                    진행기간{' '}
                    <span className="text-xxsmall12 font-semibold text-blue-700">
                      25.04.25 ~ 25.07.13
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
