import { render, screen } from '@testing-library/react';
import VodHookSection from './VodHookSection';
import { VOD_HOOK } from '../data/vodHook';
import {
  LIVE_HR_CHECKLIST_URL,
  LIVE_TREND_TOTAL_URL,
  VOD_DETAIL_URL,
  VOD_JASOSEO_URL,
} from '../data/links';

/**
 * 이 섹션은 데이터(`data/vodHook.ts`)를 그대로 그리는 표현 컴포넌트다.
 * 그래서 검증 대상은 렌더 로직이 아니라 "데이터와 화면이 어긋나지 않는가" 다.
 *
 * 카드 수와 CTA 링크를 고정하는 이유 — 시즌마다 카드가 늘고 줄고, 링크가 프로그램 ID 를 담은
 * 하드코딩 URL 이다. 오타는 타입체크로 잡히지 않고 눌러봐야 404 로만 드러난다.
 */
describe('VodHookSection', () => {
  it('카드 4개를 그린다', () => {
    // 2026-08-28 요청이 VOD 4개다. 하나라도 빠지면 여기서 걸린다.
    render(<VodHookSection />);
    expect(VOD_HOOK.cards).toHaveLength(4);
    expect(screen.getAllByRole('article')).toHaveLength(4);
  });

  it('CTA 링크는 links.ts 상수를 쓴다', () => {
    // URL 문자열을 컴포넌트나 카피에 직접 박으면 링크 교체 시 한쪽만 바뀐다.
    render(<VodHookSection />);
    const hrefs = screen
      .getAllByRole('link')
      .map((el) => el.getAttribute('href'));
    expect(hrefs).toEqual([
      VOD_JASOSEO_URL,
      VOD_DETAIL_URL,
      LIVE_HR_CHECKLIST_URL,
      LIVE_TREND_TOTAL_URL,
    ]);
  });

  it('CTA 는 새 탭으로 열고 rel 로 참조를 끊는다', () => {
    render(<VodHookSection />);
    screen.getAllByRole('link').forEach((el) => {
      expect(el).toHaveAttribute('target', '_blank');
      expect(el).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('배지는 "패스 신청 시 녹화본 무료 제공" 이다', () => {
    // 2026-08-28 요청으로 "멤버십 신청 시 무료 제공" 에서 두 번 바꿨다. 되돌아가면 여기서 걸린다.
    render(<VodHookSection />);
    const badges = screen.getAllByText(/무료 제공/);
    expect(badges).toHaveLength(VOD_HOOK.cards.length);
    badges.forEach((el) => {
      expect(el).toHaveTextContent('패스 신청 시 녹화본 무료 제공');
      expect(el).not.toHaveTextContent('멤버십');
    });
  });

  it('제목에 "[렛츠 VOD]"·"[렛츠 세미나]" 접두사를 달지 않는다', () => {
    // 상품 종류는 제목이 아니라 배지("녹화본")가 알린다(2026-08-28 요청).
    render(<VodHookSection />);
    VOD_HOOK.cards.forEach((c) => {
      expect(c.title).not.toMatch(/^\[렛츠/);
    });
  });

  it('CTA 문구는 네 장 모두 "자세히 보기" 다', () => {
    render(<VodHookSection />);
    const labels = screen.getAllByRole('link').map((el) => el.textContent);
    expect(labels).toEqual(Array(VOD_HOOK.cards.length).fill('자세히 보기 →'));
  });

  it('가격은 네 장 모두 "정가 29,000원 / 무료" 로 통일한다', () => {
    // 취소선만 있고 "무료" 가 없으면 유료로 읽힌다. 훅 섹션의 핵심 카피다.
    // 카드마다 표기가 갈리면 4열에서 바로 눈에 띈다(2026-08-28 요청으로 통일).
    const { container } = render(<VodHookSection />);
    const olds = [...container.querySelectorAll('.vodhook-price-old')];
    const frees = [...container.querySelectorAll('.vodhook-price-free')];
    expect(olds).toHaveLength(VOD_HOOK.cards.length);
    expect(frees).toHaveLength(VOD_HOOK.cards.length);
    olds.forEach((el) => expect(el).toHaveTextContent('정가 29,000원'));
    frees.forEach((el) => expect(el).toHaveTextContent('무료'));
  });

  it('섹션 직후 프로모 띠를 그린다', () => {
    render(<VodHookSection />);
    expect(screen.getByText(VOD_HOOK.promoStrip)).toBeInTheDocument();
  });
});
