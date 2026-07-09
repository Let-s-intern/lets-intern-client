'use client';

import {
  useGetUserMagnetQuestionsQuery,
  userMagnetDetailQueryOptions,
} from '@/api/magnet/magnet';
import { UserMagnetQuestionItem } from '@/api/magnet/magnetSchema';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import MagnetApplyContent from '@/domain/library/apply/MagnetApplyContent';
import { MagnetQuestion } from '@/domain/library/apply/MagnetSurveySection';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'next/navigation';

function toMagnetQuestion(item: UserMagnetQuestionItem): MagnetQuestion {
  const options = item.options
    ? item.options.split(',').map((v) => v.trim())
    : [];

  return {
    questionId: item.magnetQuestionId,
    questionType: item.answerType === 'TEXT' ? 'SUBJECTIVE' : 'OBJECTIVE',
    isRequired: item.isRequired ? 'REQUIRED' : 'OPTIONAL',
    question: item.question,
    description: item.description,
    // 주관식은 choiceType 이 null — 사용처(MagnetSurveySection)가 'SINGLE' 비교만 하므로 무해한 디폴트.
    selectionMethod: item.choiceType ?? 'SINGLE',
    items: options.map((value, index) => ({
      itemId: index + 1,
      value,
    })),
  };
}

export default function LibraryApplyPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const variant =
    searchParams.get('type') === 'launch-alert' ? 'launch-alert' : 'apply';

  const magnetId = Number(params.id);

  return (
    <AsyncBoundary pendingFallback={null}>
      <LibraryApplyContent magnetId={magnetId} variant={variant} />
    </AsyncBoundary>
  );
}

function LibraryApplyContent({
  magnetId,
  variant,
}: {
  magnetId: number;
  variant: 'apply' | 'launch-alert';
}) {
  const { data } = useSuspenseQuery(userMagnetDetailQueryOptions(magnetId));
  // 신청 폼 질문은 전용 query-options 팩토리가 없어(useSuspenseQuery 전환 시 queryKey 중복
  // 또는 api/ 정의 수정 필요) useQuery 를 유지한다. 아래 AsyncBoundary 로 함께 격리됨.
  const { data: questionsData, isLoading: questionsLoading } =
    useGetUserMagnetQuestionsQuery(magnetId);

  if (questionsLoading) return null;

  const { magnetInfo } = data;
  const questions = (questionsData?.magnetQuestionList ?? []).map(
    toMagnetQuestion,
  );

  return (
    <MagnetApplyContent
      magnetId={magnetInfo.magnetId}
      magnetType={magnetInfo.type}
      title={magnetInfo.title}
      thumbnail={magnetInfo.desktopThumbnail}
      questions={questions}
      variant={variant}
      useLaunchAlert={magnetInfo.useLaunchAlert}
    />
  );
}
