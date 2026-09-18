import { fireEvent, render, screen } from '@testing-library/react';

import { PLAYBOOK_STRUCTURE as S } from '../data/playbookDashboard';
import PlaybookMockTabs from './PlaybookMockTabs';

const [PLAN, JOBS, LEADERBOARD] = S.tabs;

/**
 * 지금 선택된 탭. 하나가 아니면 여기서 바로 실패한다 — 선택 표시가 둘이거나
 * 없으면 어느 화면을 보고 있는지 알 수 없다.
 *
 * 라벨 대신 요소로 비교한다. 탭 안의 아이콘은 `aria-hidden` 이라 이름에는 빠지지만
 * `textContent` 에는 남는다.
 */
const selectedTab = () => screen.getByRole('tab', { selected: true });
const tabNamed = (label: string) => screen.getByRole('tab', { name: label });

describe('PlaybookMockTabs (PRD 5.1)', () => {
  it('탭을 button 으로 그리고 첫 탭이 선택된 상태로 시작한다', () => {
    render(<PlaybookMockTabs />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
    for (const tab of tabs) {
      expect(tab.tagName).toBe('BUTTON');
    }
    expect(selectedTab()).toBe(tabNamed(PLAN.label));
  });

  it('탭을 누르면 aria-selected 가 그 탭으로 옮겨 간다', () => {
    render(<PlaybookMockTabs />);

    fireEvent.click(tabNamed(JOBS.label));
    expect(selectedTab()).toBe(tabNamed(JOBS.label));

    fireEvent.click(tabNamed(LEADERBOARD.label));
    expect(selectedTab()).toBe(tabNamed(LEADERBOARD.label));

    fireEvent.click(tabNamed(PLAN.label));
    expect(selectedTab()).toBe(tabNamed(PLAN.label));
  });

  it('탭을 누르면 본문이 그 탭의 것으로 바뀐다', () => {
    render(<PlaybookMockTabs />);

    expect(screen.getByText(S.weekDesc)).toBeInTheDocument();

    fireEvent.click(tabNamed(JOBS.label));
    expect(screen.getByText(S.jobs.title)).toBeInTheDocument();
    expect(screen.queryByText(S.weekDesc)).not.toBeInTheDocument();

    fireEvent.click(tabNamed(LEADERBOARD.label));
    expect(screen.getByText(S.leaderboard.title)).toBeInTheDocument();
    expect(screen.queryByText(S.jobs.title)).not.toBeInTheDocument();
  });

  /*
   * 선택된 탭만 흰 배경 + 파란 테두리다. 선택 표시가 두 곳에 남으면 어느 화면을
   * 보고 있는지 알 수 없다.
   */
  it('선택된 탭에만 흰 배경과 파란 테두리를 준다', () => {
    render(<PlaybookMockTabs />);

    fireEvent.click(tabNamed(JOBS.label));

    const highlighted = screen
      .getAllByRole('tab')
      .filter((tab) => tab.className.includes('border-primary'));
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0]).toBe(tabNamed(JOBS.label));
    expect(highlighted[0]).toHaveClass('bg-white', 'text-primary');
  });

  describe('탭 2 — 마케팅 채용공고 모음 (PRD 5.3)', () => {
    function openJobs() {
      render(<PlaybookMockTabs />);
      fireEvent.click(tabNamed(JOBS.label));
    }

    it('공고 4줄의 회사 · 제목 · 태그를 그린다', () => {
      openJobs();

      for (const row of S.jobs.rows) {
        expect(screen.getByText(row.company)).toBeInTheDocument();
        expect(screen.getByText(row.title)).toBeInTheDocument();
        for (const tag of row.tags) {
          expect(screen.getByText(tag)).toBeInTheDocument();
        }
      }
    });

    it('마감 배지 4종을 데이터 문구 그대로 그린다', () => {
      openJobs();

      expect(S.jobs.rows.map((row) => row.deadline)).toEqual([
        'D-3',
        'D-7',
        'D-14',
        '상시',
      ]);
      for (const row of S.jobs.rows) {
        expect(screen.getByText(row.deadline)).toBeInTheDocument();
      }
    });

    /*
     * 상시 채용은 남은 날이 없으니 마감이 임박한 공고와 같은 붉은 배지로 그리면
     * 신호가 거짓이 된다. 회색 테두리로 구분한다.
     */
    it('상시 채용만 회색 테두리이고 나머지는 연분홍 바탕이다', () => {
      openJobs();

      for (const row of S.jobs.rows) {
        const badge = screen.getByText(row.deadline);
        if (row.alwaysOpen) {
          expect(badge).toHaveClass('border', 'border-neutral-80', 'bg-white');
        } else {
          expect(badge).toHaveClass('bg-[#FFF2F0]', 'text-[#F0563F]');
        }
      }
    });
  });

  /*
   * 목업 안의 체크박스는 보여주기용이다(PRD 5.1). 눌러도 아무 일이 없는 컨트롤은
   * 사용자를 속이므로 input 으로 그리지 않는다.
   */
  it('체크박스를 누를 수 있는 컨트롤로 만들지 않는다', () => {
    const { container } = render(<PlaybookMockTabs />);

    expect(container.querySelectorAll('input')).toHaveLength(0);
    expect(container.querySelectorAll('button')).toHaveLength(3);
  });
});
