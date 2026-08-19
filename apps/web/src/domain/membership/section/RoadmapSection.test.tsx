import { render, screen } from '@testing-library/react';
import { ROADMAP } from '../data/roadmap';
import RoadmapSection from './RoadmapSection';

describe('RoadmapSection', () => {
  it('섹션 배지·헤드라인·서브카피를 렌더한다', () => {
    render(<RoadmapSection />);
    expect(screen.getByText('2026 하반기 공채 로드맵')).toBeInTheDocument();
    expect(
      screen.getByText('공채 일정에 맞춰, 지금 필요한 준비를 이어가세요'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        '서류 접수부터 최종 면접까지, 전형별로 필요한 준비를 놓치지 마세요',
      ),
    ).toBeInTheDocument();
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
    expect(
      screen.getByText(
        '올인원 패스로 하반기 공채 전형을 단계별로 탄탄하게 대비해 보세요.',
      ),
    ).toBeInTheDocument();
  });
});
