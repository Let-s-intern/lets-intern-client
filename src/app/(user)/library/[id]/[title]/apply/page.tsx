'use client';

import MagnetApplyContent from '@/domain/library/apply/MagnetApplyContent';
import { MagnetQuestion } from '@/domain/library/apply/MagnetSurveySection';
import { findMockLibrary } from '@/domain/library/data/mockLibraryData';
import { notFound } from 'next/navigation';
import { useParams, useSearchParams } from 'next/navigation';

// TODO: API 연동 시 실제 마그넷 질문 데이터로 대체
const MOCK_QUESTIONS: MagnetQuestion[] = [
  {
    questionId: 1,
    questionType: 'OBJECTIVE',
    isRequired: 'REQUIRED',
    question:
      '(이력서 챌린지 24기)를 알게 된 후, 결제하기까지 얼마나 고민하셨나요?',
    description:
      '처음 챌린지 소식을 접한 시점부터 결제 완료까지의 기간을 선택해주세요.',
    selectionMethod: 'SINGLE',
    items: [
      { itemId: 1, value: '바로 결제했어요(당일)', isOther: false },
      { itemId: 2, value: '1-3일 정도 고민했어요', isOther: false },
      { itemId: 3, value: '1주일 정도 고민했어요', isOther: false },
      { itemId: 4, value: '2주 이상 고민했어요', isOther: false },
    ],
  },
  {
    questionId: 2,
    questionType: 'OBJECTIVE',
    isRequired: 'OPTIONAL',
    question:
      '현재 취준을 준비하며 가장 필요하다고 느끼는 프로그램은 무엇인가요?',
    description: null,
    selectionMethod: 'MULTIPLE',
    items: [
      { itemId: 5, value: '챌린지 1', isOther: false },
      { itemId: 6, value: '챌린지 2', isOther: false },
      { itemId: 7, value: '챌린지 3', isOther: false },
      { itemId: 8, value: '챌린지 4', isOther: false },
      { itemId: 9, value: '챌린지 5', isOther: false },
      { itemId: 10, value: '챌린지 6', isOther: false },
      { itemId: 11, value: '챌린지 7', isOther: false },
    ],
  },
  {
    questionId: 3,
    questionType: 'OBJECTIVE',
    isRequired: 'OPTIONAL',
    question: '해당 프로그램이 출시되면 소식을 받아보시겠어요?',
    description: null,
    selectionMethod: 'SINGLE',
    items: [
      { itemId: 12, value: '네, 받아볼래요', isOther: false },
      { itemId: 13, value: '아니요, 괜찮아요', isOther: false },
    ],
  },
];

export default function LibraryApplyPage() {
  const params = useParams<{ id: string; title: string }>();
  const searchParams = useSearchParams();
  const variant =
    searchParams.get('type') === 'launch-alert' ? 'launch-alert' : 'apply';

  const libraryInfo = findMockLibrary(params.id);
  if (!libraryInfo) notFound();

  // TODO: API 연동 시 useGetMagnetDetailQuery로 대체
  // const { data: magnetDetail } = useGetMagnetDetailQuery(Number(params.id));
  // const questions = magnetDetail?.magnetQuestionInfo ?? [];

  return (
    <MagnetApplyContent
      magnetId={libraryInfo.id}
      title={libraryInfo.title}
      thumbnail={libraryInfo.thumbnail}
      questions={MOCK_QUESTIONS}
      variant={variant}
    />
  );
}
