import { render, screen, within } from '@testing-library/react';

import { WEEK_PLANS } from '../data/coursePlan';
import CoursePlanTimeline from './CoursePlanTimeline';

describe('CoursePlanTimeline', () => {
  it('주차 카드 10장, 월 구분선 3개, 시작 전 행 1개를 그린다', () => {
    render(<CoursePlanTimeline type="a" />);

    expect(screen.getAllByRole('article')).toHaveLength(10);
    expect(
      screen
        .getAllByRole('heading', { level: 5 })
        .map((heading) => heading.textContent),
    ).toEqual(['9월', '10월', '11월']);
    const prestart = screen.getAllByText('시작 전');
    expect(prestart).toHaveLength(1);
    // 라벨과 본문 사이 간격은 CSS 가 둔다
    expect(prestart[0].nextElementSibling).toHaveTextContent(
      '9.20 일 11:00 · 마케터 세부 직무 톺아보기 (놀유니버스 CRM 마케터)',
    );
  });

  // 막대 색은 월이 아니라 구간을 따른다 — 11월 첫 주인 7주차는 weapons(초록)
  it('주차 카드의 구간은 주차 번호로 정해진다', () => {
    render(<CoursePlanTimeline type="a" />);
    const phases = screen
      .getAllByRole('article')
      .map((card) => card.getAttribute('data-phase'));
    expect(phases[2]).toBe('documents');
    expect(phases[3]).toBe('weapons');
    expect(phases[6]).toBe('weapons');
    expect(phases[7]).toBe('apply');
  });

  it('유형을 바꾸면 주차 카드가 그 유형의 계획으로 바뀐다', () => {
    const { rerender } = render(<CoursePlanTimeline type="a" />);
    expect(screen.getByText(WEEK_PLANS.a[0].title)).toBeInTheDocument();

    rerender(<CoursePlanTimeline type="b" />);
    expect(screen.getByText(WEEK_PLANS.b[0].title)).toBeInTheDocument();
    expect(screen.queryByText(WEEK_PLANS.a[0].title)).not.toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(10);
  });

  it('라이브 세미나 항목은 일시·제목·연사를 함께 그린다', () => {
    render(<CoursePlanTimeline type="a" />);
    const first = screen.getAllByRole('article')[0];
    expect(
      within(first).getByText('라이브 세미나 · 9.22 화 20:00'),
    ).toBeInTheDocument();
    expect(
      within(first).getByText('AE가 가져야 할 역량과 포폴 작성법'),
    ).toBeInTheDocument();
    expect(within(first).getByText('대학내일 AE')).toBeInTheDocument();
  });
});
