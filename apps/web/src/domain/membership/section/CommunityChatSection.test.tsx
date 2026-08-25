import { render, screen } from '@testing-library/react';
import CommunityChatSection from './CommunityChatSection';
import { CHAT_SHOTS, COMMUNITY_CHAT } from '../data/communityChat';

/**
 * 이 섹션은 matchMedia 로 데스크톱/모바일 렌더를 가른다.
 * jsdom 에는 matchMedia 가 없으므로 데스크톱(메이슨리)으로 고정한다.
 */
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

describe('CommunityChatSection', () => {
  it('헤더는 텍스트로 그린다', () => {
    // 이미지에 넣으면 제목이 사라져 검색에서 통째로 빠진다.
    // 혜택 묶음의 형제 블록이라 h2 가 아니라 h3 다 — 이 묶음의 h2 는 CoursePlanSection 이 그린다.
    render(<CommunityChatSection />);
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(COMMUNITY_CHAT.titleTop);
    expect(heading).toHaveTextContent(COMMUNITY_CHAT.titleMain);
    expect(screen.getByText(COMMUNITY_CHAT.subtitle)).toBeInTheDocument();
  });

  it('강조 어절 두 개를 각각 .hl 로 감싼다', () => {
    // 강조어가 둘이라 재귀로 훑는다. 한 번만 치면 뒤엣것을 놓친다.
    // .hl 색은 base.css 가 아니라 styles/community-chat.css 가 직접 선언한다.
    const { container } = render(<CommunityChatSection />);
    const marks = [...container.querySelectorAll('.cchat-head h3 .hl')];
    expect(marks.map((el) => el.textContent)).toEqual([
      ...COMMUNITY_CHAT.titleHighlights,
    ]);
  });

  it('캡처 4장을 모두 렌더한다', () => {
    render(<CommunityChatSection />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(CHAT_SHOTS.length);
    expect(images.map((img) => img.getAttribute('src'))).toEqual(
      CHAT_SHOTS.map((shot) => shot.src),
    );
  });

  it('반입 이미지는 전부 WebP 다', () => {
    // PRD 7-3: PNG·JPG 반입 금지.
    for (const shot of CHAT_SHOTS) {
      expect(shot.src.endsWith('.webp')).toBe(true);
    }
  });

  it('CLS 방지를 위해 width·height 를 직접 지정한다', () => {
    // domain/membership 은 next/image 를 쓰지 않아 크기 예약이 자동으로 되지 않는다.
    render(<CommunityChatSection />);
    const images = screen.getAllByRole('img');
    images.forEach((img, i) => {
      expect(img).toHaveAttribute('width', String(CHAT_SHOTS[i].width));
      expect(img).toHaveAttribute('height', String(CHAT_SHOTS[i].height));
      expect(img).toHaveAttribute('alt', CHAT_SHOTS[i].alt);
      expect(img).toHaveAttribute('decoding', 'async');
    });
  });

  it('alt 는 이름표가 아니라 대화 내용을 옮긴 문장이다', () => {
    for (const shot of CHAT_SHOTS) {
      expect(shot.alt.length).toBeGreaterThan(30);
    }
  });

  it('앵커·제거 용이성을 위해 section id 를 유지한다', () => {
    const { container } = render(<CommunityChatSection />);
    expect(container.querySelector('section#community-chat')).not.toBeNull();
  });
});
