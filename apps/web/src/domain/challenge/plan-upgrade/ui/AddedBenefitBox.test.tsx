import { render, screen } from '@testing-library/react';
import AddedBenefitBox from './AddedBenefitBox';

describe('AddedBenefitBox', () => {
  it('현재 플랜 혜택과 새 피드백 미션을 항목으로 보여준다', () => {
    render(
      <AddedBenefitBox
        currentPlanType="BASIC"
        currentPlanDescription="학습 콘텐츠, 미션 템플릿"
        feedbackMissions={[
          {
            missionId: 11,
            th: 3,
            title: '경험분석',
            feedbackType: 'WRITTEN_FEEDBACK',
          },
          {
            missionId: 12,
            th: 6,
            title: '자기소개서 완성',
            feedbackType: 'LIVE_FEEDBACK',
          },
        ]}
      />,
    );

    expect(screen.getByText('BASIC에서 추가되는 혜택')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('BASIC PLAN의 모든 혜택')).toBeInTheDocument();
    expect(screen.getByText('학습 콘텐츠, 미션 템플릿')).toBeInTheDocument();
    expect(screen.getByText('피드백 2회')).toBeInTheDocument();
    expect(
      screen.getByText('3회차 미션 경험분석 서면 멘토링'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('6회차 미션 자기소개서 완성 Live 멘토링'),
    ).toBeInTheDocument();
  });

  it('새 피드백 미션이 없으면 피드백 항목을 뺀다', () => {
    render(
      <AddedBenefitBox
        currentPlanType="BASIC"
        currentPlanDescription="학습 콘텐츠, 미션 템플릿"
        feedbackMissions={[]}
      />,
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.queryByText(/^피드백 \d+회$/)).not.toBeInTheDocument();
  });
});
