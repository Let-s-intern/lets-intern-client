import { render, screen } from '@testing-library/react';
import { ROADMAP } from '../data/roadmap';
import RoadmapSection from './RoadmapSection';

describe('RoadmapSection', () => {
  it('섹션 배지·헤드라인·서브카피를 렌더한다', () => {
    render(<RoadmapSection />);
    expect(screen.getByText('2026 하반기 공채 로드맵')).toBeInTheDocument();
    // 제목·설명은 의미 단위로 잘려 있고, 붙였다 떼는 것은 base.css 의 .brk 가 한다.
    const { container } = render(<RoadmapSection />);
    expect(container.querySelector('.sec-head h2')?.textContent).toBe(
      ROADMAP.titleLines.join(''),
    );
    expect(container.querySelector('.sec-head p')?.textContent).toBe(
      ROADMAP.subLines.join(''),
    );
  });

  it('5개 노드의 날짜 칩·제목·본문을 모두 렌더한다', () => {
    render(<RoadmapSection />);
    ROADMAP.nodes.forEach((node) => {
      expect(screen.getByText(node.dateChip)).toBeInTheDocument();
      expect(screen.getByText(node.title)).toBeInTheDocument();
      expect(screen.getByText(node.body)).toBeInTheDocument();
    });
  });

  it('트랙 위 번호는 1~4 이고 마지막 노드는 번호 대신 체크 아이콘이다', () => {
    const { container } = render(<RoadmapSection />);
    const steps = container.querySelectorAll('.rmap-step');
    expect(steps).toHaveLength(5);
    expect(
      Array.from(steps)
        .slice(0, 4)
        .map((el) => el.textContent),
    ).toEqual(['1', '2', '3', '4']);
    expect(steps[4].textContent).toBe('');
    expect(steps[4].querySelector('svg')).not.toBeNull();
  });

  it('카드가 트랙 선 위/아래로 번갈아 붙는다', () => {
    const { container } = render(<RoadmapSection />);
    const sides = Array.from(container.querySelectorAll('.rmap-node')).map(
      (el) => el.getAttribute('data-side'),
    );
    expect(sides).toEqual(['above', 'below', 'above', 'below', 'above']);
  });

  it('가로 트랙 선을 1개만 그린다', () => {
    const { container } = render(<RoadmapSection />);
    expect(container.querySelectorAll('.timeline .track')).toHaveLength(1);
  });

  it('하단 마무리 문구와 강조 어절을 렌더한다', () => {
    const { container } = render(<RoadmapSection />);
    expect(container.querySelector('.rmap-outro-lead')?.textContent).toBe(
      '전형은 이어지니까, 준비도 끊기지 않게',
    );
    expect(container.querySelector('.rmap-outro-lead .hl')?.textContent).toBe(
      '준비도 끊기지 않게',
    );
    expect(container.querySelector('.rmap-outro-sub')?.textContent).toBe(
      ROADMAP.outro.subLines.join(''),
    );
  });
});
