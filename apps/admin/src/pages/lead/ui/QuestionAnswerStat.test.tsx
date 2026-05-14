import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { MagnetApplicationByMagnet } from '@/api/leadManagement';

import QuestionAnswerStat from './QuestionAnswerStat';

const buildApplication = (
  overrides: Partial<MagnetApplicationByMagnet>,
): MagnetApplicationByMagnet => ({
  magnetApplicationId: 1,
  name: '홍길동',
  phoneNum: '01000000000',
  grade: '3학년',
  wishField: '개발',
  wishJob: '프론트엔드',
  wishIndustry: 'IT',
  wishCompany: '렛츠커리어',
  marketingAgree: true,
  questionAnswerList: [],
  createDate: '2026-05-10T09:00:00',
  ...overrides,
});

describe('QuestionAnswerStat', () => {
  it('3건 중 2건 답변 시 67%와 비율을 표시한다', () => {
    const applications: MagnetApplicationByMagnet[] = [
      buildApplication({
        magnetApplicationId: 1,
        questionAnswerList: [{ question: 'Q', answer: '응답' }],
      }),
      buildApplication({
        magnetApplicationId: 2,
        questionAnswerList: [{ question: 'Q', answer: '응답' }],
      }),
      buildApplication({
        magnetApplicationId: 3,
        questionAnswerList: [],
      }),
    ];

    const { getByText } = render(
      <QuestionAnswerStat applications={applications} />,
    );

    expect(getByText('질문 응답률')).toBeInTheDocument();
    expect(getByText('66.67%')).toBeInTheDocument();
    expect(getByText('2 / 3명')).toBeInTheDocument();
  });

  it('데이터가 비어 있으면 null을 반환한다', () => {
    const { container } = render(<QuestionAnswerStat applications={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
