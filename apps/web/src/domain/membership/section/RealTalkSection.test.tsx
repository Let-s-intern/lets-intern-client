import { render, screen } from '@testing-library/react';

import { CHECKUP, CHECKUP_AREAS } from '../data/checkup';
import { REAL_TALK } from '../data/realTalk';
import RealTalkSection from './RealTalkSection';

describe('RealTalkSection (시안 1)', () => {
  it('취준생 말풍선 5개를 그린다', () => {
    render(<RealTalkSection />);

    expect(REAL_TALK.bubbles).toHaveLength(5);
    for (const bubble of REAL_TALK.bubbles) {
      expect(screen.getByText(bubble.who)).toBeInTheDocument();
    }
  });

  /*
   * 4카드는 CHECKUP_AREAS 를 그린다. 컴포넌트에 문구를 직접 적으면 진단 문항·결과와
   * 라벨이 갈라지므로, 데이터에서 온 값이 그대로 화면에 있는지 확인한다.
   */
  it('4영역 카드가 번호·라벨·부연과 함께 보인다', () => {
    render(<RealTalkSection />);

    expect(CHECKUP_AREAS).toHaveLength(4);
    for (const area of CHECKUP_AREAS) {
      expect(screen.getByText(area.no)).toBeInTheDocument();
      expect(screen.getByText(area.label)).toBeInTheDocument();
      expect(screen.getByText(area.desc)).toBeInTheDocument();
    }
  });

  it('"무료 진단 바로 하기" 가 진단 섹션 앵커를 가리킨다', () => {
    render(<RealTalkSection />);

    const cta = screen.getByRole('link', {
      name: new RegExp(REAL_TALK.ctaLabel),
    });
    expect(cta).toHaveAttribute('href', `#${CHECKUP.anchorId}`);
  });

  it('막히는 지점이 4가지라는 문구를 그린다', () => {
    const { container } = render(<RealTalkSection />);
    expect(container.textContent).toContain(
      '막히는 지점은 크게 4가지였습니다.',
    );
  });
});
