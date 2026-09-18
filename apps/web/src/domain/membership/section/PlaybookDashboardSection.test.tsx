import { render, screen } from '@testing-library/react';

import { PLAYBOOK_STRUCTURE, PLAYBOOK_WITH } from '../data/playbookDashboard';
import PlaybookDashboardSection from './PlaybookDashboardSection';

describe('PlaybookDashboardSection (개편 시안 10)', () => {
  describe("WITH LET'S CAREER", () => {
    it('혜택 4카드와 STEP 01~05 · GOAL 흐름을 그린다', () => {
      render(<PlaybookDashboardSection />);

      for (const benefit of PLAYBOOK_WITH.benefits) {
        expect(screen.getByText(benefit.title)).toBeInTheDocument();
      }
      for (const step of PLAYBOOK_WITH.flow) {
        expect(screen.getByText(step.no)).toBeInTheDocument();
        expect(screen.getByText(step.label)).toBeInTheDocument();
      }
    });
  });

  describe('PLAYBOOK STRUCTURE 목업', () => {
    it('탭 3개와 주소 표시줄을 그린다', () => {
      render(<PlaybookDashboardSection />);

      for (const tab of PLAYBOOK_STRUCTURE.tabs) {
        expect(screen.getByText(tab.label)).toBeInTheDocument();
      }
      expect(screen.getByText(PLAYBOOK_STRUCTURE.addressBar)).toBeVisible();
    });

    it('체크리스트 5줄을 그리고 완료 줄에 취소선을 붙인다', () => {
      render(<PlaybookDashboardSection />);

      for (const row of PLAYBOOK_STRUCTURE.checklist) {
        const label = screen.getByText(row.label);
        expect(label).toBeInTheDocument();
        expect(label.className.includes('line-through')).toBe(row.done);
      }
    });

    /*
     * 목업에서 누를 수 있는 것은 탭 세 개뿐이다(PRD 5.1). 체크박스를 input·button 으로
     * 그리면 눌러도 아무 일이 없어 사용자를 속인다.
     */
    it('탭 말고는 누를 수 있는 컨트롤을 두지 않는다', () => {
      const { container } = render(<PlaybookDashboardSection />);

      expect(container.querySelectorAll('input')).toHaveLength(0);
      expect(container.querySelectorAll('button')).toHaveLength(
        PLAYBOOK_STRUCTURE.tabs.length,
      );
      expect(screen.getAllByRole('tab')).toHaveLength(
        PLAYBOOK_STRUCTURE.tabs.length,
      );
    });
  });
});
