import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { COURSE_PLAN_BODY, COURSE_PLAN_VIEWS } from '../data/coursePlan';
import CoursePlanSection from './CoursePlanSection';

// jsdom 에는 IntersectionObserver 가 없다 — 매트릭스·주 단위 캐러셀 도트 훅용 폴리필.
beforeAll(() => {
  global.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  } as unknown as typeof IntersectionObserver;
});

const typeButton = (label: 'TYPE A' | 'TYPE B') =>
  screen.getByRole('button', { name: new RegExp(label) });
const viewButton = (label: string) =>
  screen.getByRole('button', { name: label });

describe('CoursePlanSection 유형 선택', () => {
  it('처음에는 TYPE A 가 선택돼 있고 TYPE A 매트릭스를 그린다', () => {
    render(<CoursePlanSection />);
    expect(typeButton('TYPE A')).toHaveAttribute('aria-pressed', 'true');
    expect(typeButton('TYPE B')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('세부 직무 6종 훑기')).toBeInTheDocument();
    expect(
      screen.getByText(COURSE_PLAN_BODY.matrixTitle.a),
    ).toBeInTheDocument();
  });

  it('TYPE B 를 누르면 선택이 옮겨 가고 매트릭스와 설명이 TYPE B 로 바뀐다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);

    await user.click(typeButton('TYPE B'));

    expect(typeButton('TYPE B')).toHaveAttribute('aria-pressed', 'true');
    expect(typeButton('TYPE A')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('다음 커리어 방향 정하기')).toBeInTheDocument();
    expect(screen.queryByText('세부 직무 6종 훑기')).not.toBeInTheDocument();
    expect(
      screen.getByText(COURSE_PLAN_BODY.matrixTitle.b),
    ).toBeInTheDocument();
    // 라이브 세미나 줄은 공유 데이터라 그대로 남는다
    expect(screen.getByText('마케팅의 기본')).toBeInTheDocument();
  });

  it('유형을 바꿔도 보고 있던 보기가 유지된다', async () => {
    const user = userEvent.setup();
    render(<CoursePlanSection />);
    const timeline = COURSE_PLAN_VIEWS.timeline.label;

    await user.click(viewButton(timeline));
    await user.click(typeButton('TYPE B'));

    expect(viewButton(timeline)).toHaveAttribute('aria-pressed', 'true');

    await user.click(typeButton('TYPE A'));
    expect(viewButton(timeline)).toHaveAttribute('aria-pressed', 'true');

    // 플레이북 보기로 돌아가면 마지막에 고른 TYPE A 매트릭스다
    await user.click(viewButton(COURSE_PLAN_VIEWS.matrix.label));
    expect(screen.getByText('세부 직무 6종 훑기')).toBeInTheDocument();
  });
});
