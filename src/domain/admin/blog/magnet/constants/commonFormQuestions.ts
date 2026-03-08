import { MagnetQuestionReqBody } from '@/api/magnet/magnet';

/** 프론트에 하드코딩된 공통 신청폼 질문 (type: BASE) */
export const COMMON_FORM_QUESTIONS: MagnetQuestionReqBody[] = [
  {
    type: 'BASE',
    question: '관심 직무를 선택해주세요',
    description: '복수 선택이 가능합니다',
    isRequired: true,
    answerType: 'CHOICE',
    choiceType: 'MULTIPLE',
    options: '마케팅,기획,개발,디자인,기타(직접입력)',
  },
  {
    type: 'BASE',
    question: '이름을 입력해주세요',
    description: '',
    isRequired: false,
    answerType: 'TEXT',
    choiceType: 'SINGLE',
    options: null,
  },
];
