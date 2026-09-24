import { ROADMAP } from './roadmap';

describe('roadmap 데이터 무결성', () => {
  it('노드는 5개다', () => {
    expect(ROADMAP.nodes).toHaveLength(5);
  });

  it('카드는 트랙 선 위/아래로 번갈아 붙는다', () => {
    expect(ROADMAP.nodes.map((node) => node.side)).toEqual([
      'above',
      'below',
      'above',
      'below',
      'above',
    ]);
  });

  it('앞 4개 노드는 1~4 번호를 갖고, 마지막 노드만 번호 대신 체크(null)다', () => {
    expect(ROADMAP.nodes.map((node) => node.step)).toEqual([1, 2, 3, 4, null]);
  });

  it('모든 노드의 날짜 칩·제목·본문이 비어 있지 않다', () => {
    ROADMAP.nodes.forEach((node) => {
      expect(node.dateChip.trim()).not.toBe('');
      expect(node.title.trim()).not.toBe('');
      expect(node.body.trim()).not.toBe('');
    });
  });

  it('아이콘 키가 노드마다 중복 없이 지정돼 있다', () => {
    const icons = ROADMAP.nodes.map((node) => node.icon);
    expect(new Set(icons).size).toBe(icons.length);
  });

  it('하단 마무리 문구는 강조 앞뒤가 분리돼 있다', () => {
    expect(ROADMAP.outro.lead).toContain('전형은 이어지니까');
    expect(ROADMAP.outro.highlight).toBe('준비도 끊기지 않게');
    expect(ROADMAP.outro.subLines.join(' ').trim()).not.toBe('');
  });

  it('제목·설명은 의미 단위로 잘려 있고 각 줄이 비어 있지 않다', () => {
    // 폭에 맡기면 마지막 어절만 떨어져 나온다. base.css 의 .brk 가 폭에 따라 붙인다.
    for (const lines of [
      ROADMAP.titleLines,
      ROADMAP.subLines,
      ROADMAP.outro.subLines,
    ]) {
      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) expect(line.trim()).not.toBe('');
    }
  });
});
