import { render, screen } from '@testing-library/react';

import { ROADMAP } from '../data/roadmap';
import RoadmapSection from './RoadmapSection';

describe('RoadmapSection (시안 4)', () => {
  it('다섯 단계의 제목이 모두 보인다', () => {
    render(<RoadmapSection />);

    for (const step of ROADMAP.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });

  it('단계 라벨을 그린다', () => {
    render(<RoadmapSection />);
    expect(screen.getByText('STEP 01')).toBeInTheDocument();
    expect(screen.getByText('STEP 05')).toBeInTheDocument();
  });
});
