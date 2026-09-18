import { render, screen } from '@testing-library/react';

import { LIVE_CLINIC } from '../data/liveClinic';
import LiveClinicSection from './LiveClinicSection';

describe('LiveClinicSection (개편 시안 7-0)', () => {
  it('배지·제목·3,000+ 칩을 그린다', () => {
    render(<LiveClinicSection />);

    expect(screen.getByText(LIVE_CLINIC.badge)).toBeInTheDocument();
    for (const line of LIVE_CLINIC.titleLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    expect(screen.getByText(LIVE_CLINIC.statValue)).toBeInTheDocument();
    expect(screen.getByText(LIVE_CLINIC.statLabel)).toBeInTheDocument();
  });

  /*
   * 운영에서 받은 영상이다(`https://youtu.be/gTYPWZCMANc`). ID 를 못박아 둔다 —
   * 시안에는 "영상 준비 중" 자리로만 그려져 있어 코드만 보면 임시값처럼 보인다.
   * 자동재생은 하지 않는다. 랜딩을 훑는 중에 소리가 나면 그대로 닫는다.
   */
  it('받은 유튜브 영상을 자동재생 없이 넣는다', () => {
    const { container } = render(<LiveClinicSection />);

    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute(
      'src',
      expect.stringContaining('/embed/gTYPWZCMANc'),
    );
    expect(iframe?.getAttribute('src')).toContain('autoplay=0');
  });

  it('STEP 카드가 3장이고 라벨이 01~03 이다', () => {
    const { container } = render(<LiveClinicSection />);

    expect(container.querySelectorAll('li')).toHaveLength(3);
    expect(LIVE_CLINIC.steps.map((step) => step.label)).toEqual([
      'STEP 01',
      'STEP 02',
      'STEP 03',
    ]);
    for (const step of LIVE_CLINIC.steps) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });
});
