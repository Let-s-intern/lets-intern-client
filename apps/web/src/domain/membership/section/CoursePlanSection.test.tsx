import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoursePlanSection from './CoursePlanSection';

describe('CoursePlanSection 토글 전환', () => {
  it('초기에는 전체 플랜(매트릭스) 뷰를 보여준다', () => {
    render(<CoursePlanSection />);
    // 매트릭스 카테고리 셀(채용 캘린더 등)이 보이고, 월별 카드(WEEK)는 아직 없음
    expect(screen.getByText('채용 캘린더')).toBeInTheDocument();
    expect(screen.queryByText('WEEK')).not.toBeInTheDocument();
  });

  it('월별 플랜 버튼을 누르면 13주 타임라인으로 전환된다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);

    await user.click(screen.getByRole('button', { name: '월별 플랜' }));

    // 월별 카드 12개(WEEK 라벨)로 전환되고 매트릭스 셀은 사라짐
    expect(screen.getAllByText('WEEK')).toHaveLength(12);
    expect(screen.queryByText('채용 캘린더')).not.toBeInTheDocument();
  });

  it('전체 플랜 버튼으로 다시 매트릭스로 돌아온다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);

    await user.click(screen.getByRole('button', { name: '월별 플랜' }));
    await user.click(screen.getByRole('button', { name: '전체 플랜' }));

    expect(screen.getByText('채용 캘린더')).toBeInTheDocument();
  });

  it('활성 토글 버튼에 aria-pressed=true 가 설정된다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);

    const matrixBtn = screen.getByRole('button', { name: '전체 플랜' });
    const timelineBtn = screen.getByRole('button', { name: '월별 플랜' });

    expect(matrixBtn).toHaveAttribute('aria-pressed', 'true');
    expect(timelineBtn).toHaveAttribute('aria-pressed', 'false');

    await user.click(timelineBtn);

    expect(timelineBtn).toHaveAttribute('aria-pressed', 'true');
    expect(matrixBtn).toHaveAttribute('aria-pressed', 'false');
  });
});
