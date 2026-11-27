import { useAllChallengeQuestionsQuery } from '@/api/challenge-question/challengeQuestion';
import MuiPagination from '@/domain/program/pagination/MuiPagination';
import { useState } from 'react';

const PAGE_SIZE = 20;

const formatCreateDate = (value: string) =>
  `${value.slice(0, 10)} ${value.slice(11, 16)}`;

/**
 * 유저가 올린 챌린지 1:1 문의. 문의 탭을 열 때만 렌더되므로 그때서야 조회한다.
 * 행을 누르면 기존 답변 화면을 새 탭으로 연다. 문의 종류는 챌린지 1:1 문의뿐이다.
 */
const UserInquirySection = ({ userId }: { userId: number }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAllChallengeQuestionsQuery({
    userId,
    page,
    size: PAGE_SIZE,
  });

  if (isLoading) return <div>로딩 중...</div>;

  // 서버가 userId 조건을 모르는 배포 전에는 전체 문의가 오므로, 다른 유저의 문의가 비치지 않게 한 번 더 거른다.
  const questions = (data?.questionList ?? []).filter(
    (question) => question.userId === userId,
  );
  if (questions.length === 0) return <div>등록한 문의가 없습니다.</div>;

  return (
    <div>
      <ul className="flex flex-col gap-y-3">
        {questions.map((question) => (
          <li key={question.id}>
            <a
              href={`/challenge/inquiry/${question.challengeId}/${question.id}/answer`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xs border border-[#E4E4E7] p-4 hover:bg-neutral-50"
            >
              <div className="flex items-start justify-between gap-x-4">
                <span className="font-semibold">{question.title}</span>
                <span className="shrink-0 text-sm">
                  {question.answerStatus === 'WAITING'
                    ? '답변 대기'
                    : '답변 완료'}
                  {' · '}
                  {question.isVisible ? '노출' : '비노출'}
                </span>
              </div>
              <div className="mt-1 text-sm text-neutral-500">
                {question.challengeTitle} ·{' '}
                {formatCreateDate(question.createDate)}
              </div>
            </a>
          </li>
        ))}
      </ul>
      {data && data.pageInfo.totalPages > 1 && (
        <MuiPagination
          className="mt-4"
          pageInfo={data.pageInfo}
          page={page}
          onChange={(_, nextPage) => setPage(nextPage)}
        />
      )}
    </div>
  );
};

export default UserInquirySection;
