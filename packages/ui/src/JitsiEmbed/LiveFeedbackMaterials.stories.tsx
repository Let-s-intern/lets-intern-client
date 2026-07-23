import type { Meta, StoryObj } from '@storybook/react-vite';

import { LiveFeedbackMaterials } from './LiveFeedbackMaterials';

const meta = {
  title: 'UI/JitsiEmbed/LiveFeedbackMaterials',
  component: LiveFeedbackMaterials,
  parameters: { layout: 'fullscreen' },
  // fixed 포지션(모달 좌하단)이라 어두운 화상 배경 위에 얹어 보여준다.
  decorators: [
    (Story) => (
      <div className="relative h-screen w-full bg-neutral-900">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LiveFeedbackMaterials>;

export default meta;
type Story = StoryObj<typeof meta>;

const PRE_QUESTION =
  '자기소개서 3번 문항(협업 경험)에 대한 피드백을 받고 싶어요. 특히 갈등 상황 서술이 설득력 있는지 봐주세요.';
// 노션이 아닌 일반 링크 → "새 탭에서 열기" 폴백 UI 로 표시(스토리에서 외부 임베드 로드 방지).
const SUBMISSION_URL = 'https://example.com/my-submission';

/** 멘토 관점 — "사전 QA" / "멘티 제출물"("{name} 님의 제출물"). */
export const Mentor: Story = {
  args: {
    viewer: 'MENTOR',
    menteeName: '홍길동',
    preQuestion: PRE_QUESTION,
    submissionUrl: SUBMISSION_URL,
  },
};

/** 멘티 관점 — "나의 사전 QA" / "나의 제출물". */
export const Mentee: Story = {
  args: {
    viewer: 'MENTEE',
    preQuestion: PRE_QUESTION,
    submissionUrl: SUBMISSION_URL,
  },
};

/** 사전질문만 있는 경우 — 제출물 버튼 미노출. */
export const OnlyPreQuestion: Story = {
  args: {
    viewer: 'MENTEE',
    preQuestion: PRE_QUESTION,
  },
};

/** 데이터 없음 — 아무것도 렌더하지 않음(null). */
export const Empty: Story = {
  args: {
    viewer: 'MENTEE',
  },
};
