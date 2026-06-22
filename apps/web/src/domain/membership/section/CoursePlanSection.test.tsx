import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CoursePlanSection from './CoursePlanSection';

describe('CoursePlanSection 토글 전환', () => {
  it('초기에는 전체 플랜(매트릭스) 뷰를 보여준다', () => {
    render(<CoursePlanSection />);
    // 매트릭스 셀 30개 존재
    expect(screen.getAllByRole('cell')).toHaveLength(30);
    // 타임라인 리스트는 아직 없음
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('월별 플랜 버튼을 누르면 13주 타임라인으로 전환된다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);

    await user.click(screen.getByRole('button', { name: '월별 플랜' }));

    expect(screen.getAllByRole('listitem')).toHaveLength(13);
    expect(screen.queryByRole('cell')).not.toBeInTheDocument();
  });

  it('전체 플랜 버튼으로 다시 매트릭스로 돌아온다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);

    await user.click(screen.getByRole('button', { name: '월별 플랜' }));
    await user.click(screen.getByRole('button', { name: '전체 플랜' }));

    expect(screen.getAllByRole('cell')).toHaveLength(30);
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

  it('owner 범례 3종(직접/무료 자료/챌린지)을 표시한다', () => {
    render(<CoursePlanSection />);
    const labels = screen
      .getAllByText(/^(직접|무료 자료|챌린지)$/)
      .map((el) => el.textContent);
    // 범례에 세 라벨이 모두 한 번 이상 등장
    expect(labels).toEqual(expect.arrayContaining(['직접', '무료 자료', '챌린지']));
  });
});
