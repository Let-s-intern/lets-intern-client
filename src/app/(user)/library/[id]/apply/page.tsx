'use client';

import {
  useGetUserMagnetDetailQuery,
  useGetUserMagnetQuestionsQuery,
} from '@/api/magnet/magnet';
import { UserMagnetQuestionItem } from '@/api/magnet/magnetSchema';
import MagnetApplyContent from '@/domain/library/apply/MagnetApplyContent';
import { MagnetQuestion } from '@/domain/library/apply/MagnetSurveySection';
import { notFound } from 'next/navigation';
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
    selectionMethod: item.choiceType,
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
  const { data, isLoading } = useGetUserMagnetDetailQuery(magnetId);
  const { data: questionsData, isLoading: questionsLoading } =
    useGetUserMagnetQuestionsQuery(magnetId);

  if (isLoading || questionsLoading) return null;
  if (!data) notFound();

  const { magnetInfo } = data;
  const questions = (questionsData?.magnetQuestionList ?? []).map(
    toMagnetQuestion,
  );

  return (
    <MagnetApplyContent
      magnetId={magnetInfo.magnetId}
      title={magnetInfo.title}
      thumbnail={magnetInfo.desktopThumbnail}
      questions={questions}
      variant={variant}
    />
  );
}
