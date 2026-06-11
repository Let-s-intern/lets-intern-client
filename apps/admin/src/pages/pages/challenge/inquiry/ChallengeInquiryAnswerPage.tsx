import {
  ChallengeQuestionItem,
  useAnswerQuestionMutation,
} from '@/api/challenge-question/challengeQuestion';
import EditorApp from '@/common/lexical/EditorApp';
import { useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ChallengeInquiryAnswerPage = () => {
  const { challengeId, questionId } = useParams<{
    challengeId: string;
    questionId: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const question = location.state?.question as
    | ChallengeQuestionItem
    | undefined;

  const answerRef = useRef<string>(question?.answer ?? '');

  const { mutate: saveAnswer, isPending } = useAnswerQuestionMutation();

  const handleSave = () => {
    if (!challengeId || !questionId) return;
    saveAnswer(
      {
        challengeId: Number(challengeId),
        questionId: Number(questionId),
        answer: answerRef.current,
      },
      { onSuccess: () => navigate('/challenge/inquiry') },
    );
  };

  if (!question) {
    return (
      <div className="px-12 pt-6 text-sm text-red-500">
        문의 데이터를 불러올 수 없습니다. 목록에서 다시 접근해주세요.
      </div>
    );
  }

  return (
    <div className="px-12 pt-6">
      <header className="mb-6 px-3">
        <h1 className="text-2xl font-semibold">챌린지 1:1 문의 - 답변하기</h1>
      </header>

      <section className="mb-6 rounded border border-gray-200 bg-gray-50 px-6 py-4">
        <p className="mb-3 text-base font-semibold">{question.title}</p>
        <ul className="text-xsmall14 space-y-1 text-gray-600">
          <li>· {question.challengeTitle}</li>
          <li>· {question.userName}</li>
          {question.challengePricePlanType && (
            <li>· {question.challengePricePlanType}</li>
          )}
          {(question.wishJob || question.wishCompany) && (
            <li>
              ·{' '}
              {[question.wishJob, question.wishCompany]
                .filter(Boolean)
                .join(' | ')}
            </li>
          )}
        </ul>
      </section>

      <section className="mb-6">
        <p className="text-xsmall14 mb-1 font-medium text-gray-700">
          문의 내용
        </p>
        <div className="whitespace-pre-wrap rounded border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800">
          {question.content}
        </div>
      </section>

      <section className="mb-8">
        <p className="text-xsmall14 mb-1 font-medium text-gray-700">답변</p>
        <EditorApp
          initialEditorStateJsonString={question.answer ?? undefined}
          onChange={(jsonString) => {
            answerRef.current = jsonString;
          }}
        />
      </section>

      <footer className="flex justify-end gap-3">
        <button
          className="rounded border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:bg-gray-50"
          onClick={() => navigate('/challenge/inquiry')}
        >
          리스트로 돌아가기
        </button>
        <button
          className="bg-primary rounded px-5 py-2 text-sm text-white disabled:opacity-50"
          disabled={isPending}
          onClick={handleSave}
        >
          저장
        </button>
      </footer>
    </div>
  );
};

export default ChallengeInquiryAnswerPage;
