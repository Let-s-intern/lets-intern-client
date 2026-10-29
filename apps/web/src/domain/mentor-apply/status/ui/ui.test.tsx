import type { MentorApplicationStatus } from '@/api/mentor-application/mentorApplication';
import { render, screen, within } from '@testing-library/react';

import StatusResultCard from './StatusResultCard';
import StatusStepper from './StatusStepper';

const application = (
  overrides: Partial<MentorApplicationStatus> = {},
): MentorApplicationStatus => ({
  submittedAt: '2026-10-28T14:03:00',
  status: 'REVIEWING',
  expectedReplyDate: '2026-11-04',
  ...overrides,
});

/** 단계 번호 동그라미가 강조(bg-[#4d55f5])됐는지 */
const reachedSteps = () =>
  screen
    .getAllByRole('listitem')
    .map((li) => li.querySelector('span')!.className.includes('bg-[#4d55f5]'));

describe('StatusStepper', () => {
  it.each([
    ['CHECKING', [true, false, false], '확인 중'],
    ['REVIEWING', [true, true, false], '검토 중'],
    ['REPLIED', [true, true, true], '회신 완료'],
  ] as const)('%s 이면 현재 단계까지 강조한다', (status, reached, current) => {
    render(<StatusStepper status={status} />);

    expect(reachedSteps()).toEqual(reached);
    const currentStep = screen
      .getAllByRole('listitem')
      .find((li) => li.getAttribute('aria-current') === 'step')!;
    expect(within(currentStep).getByText(current)).toBeInTheDocument();
  });
});

describe('StatusResultCard', () => {
  it('신청일, 상태 제목, 예상 회신일을 시안 형식으로 그린다', () => {
    render(<StatusResultCard application={application()} />);

    expect(screen.getByText('신청일 2026. 10. 28.')).toBeInTheDocument();
    expect(screen.getAllByText('검토 중')).toHaveLength(2);
    expect(screen.getByText('예상 회신일')).toBeInTheDocument();
    expect(screen.getByText('11월 4일 (수)')).toBeInTheDocument();
  });

  it('회신 완료면 예상 회신일 배지를 숨긴다', () => {
    render(
      <StatusResultCard application={application({ status: 'REPLIED' })} />,
    );

    expect(screen.queryByText('예상 회신일')).not.toBeInTheDocument();
    expect(screen.getAllByText('회신 완료')).toHaveLength(2);
  });

  it('예상 회신일이 비어 있으면 배지를 그리지 않는다', () => {
    render(
      <StatusResultCard
        application={application({
          status: 'CHECKING',
          expectedReplyDate: null,
        })}
      />,
    );

    expect(screen.queryByText('예상 회신일')).not.toBeInTheDocument();
  });
});
