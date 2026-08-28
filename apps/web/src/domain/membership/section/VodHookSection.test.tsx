import { render, screen } from '@testing-library/react';
import VodHookSection from './VodHookSection';
import { VOD_HOOK } from '../data/vodHook';
import { VOD_DETAIL_URL, VOD_JASOSEO_URL } from '../data/links';

/**
 * 이 섹션은 데이터(`data/vodHook.ts`)를 그대로 그리는 표현 컴포넌트다.
 * 그래서 검증 대상은 렌더 로직이 아니라 "데이터와 화면이 어긋나지 않는가" 다.
 *
 * 카드 수와 CTA 링크를 고정하는 이유 — 시즌마다 카드가 늘고 줄고, 링크가 프로그램 ID 를 담은
 * 하드코딩 URL 이다. 오타는 타입체크로 잡히지 않고 눌러봐야 404 로만 드러난다.
 */
describe('VodHookSection', () => {
  it('카드를 데이터 개수만큼 그린다', () => {
    render(<VodHookSection />);
    expect(screen.getAllByRole('article')).toHaveLength(VOD_HOOK.cards.length);
  });

  it('CTA 링크는 links.ts 상수를 쓴다', () => {
    // URL 문자열을 컴포넌트나 카피에 직접 박으면 링크 교체 시 한쪽만 바뀐다.
    render(<VodHookSection />);
    const hrefs = screen
      .getAllByRole('link')
      .map((el) => el.getAttribute('href'));
    expect(hrefs).toEqual([VOD_JASOSEO_URL, VOD_DETAIL_URL]);
  });

  it('CTA 는 새 탭으로 열고 rel 로 참조를 끊는다', () => {
    render(<VodHookSection />);
    screen.getAllByRole('link').forEach((el) => {
      expect(el).toHaveAttribute('target', '_blank');
      expect(el).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('무료 제공 배지는 "패스" 로 부른다', () => {
    // 2026-08-28 요청으로 "멤버십 신청 시" 에서 바꿨다. 되돌아가면 여기서 걸린다.
    render(<VodHookSection />);
    const badges = screen.getAllByText(/신청 시 무료 제공/);
    expect(badges).toHaveLength(VOD_HOOK.cards.length);
    badges.forEach((el) => {
      expect(el).toHaveTextContent('패스 신청 시 무료 제공');
      expect(el).not.toHaveTextContent('멤버십');
    });
  });

  it('가격은 정가 취소선과 무료를 함께 보여준다', () => {
    // 취소선만 있고 "무료" 가 없으면 유료로 읽힌다. 훅 섹션의 핵심 카피다.
    const { container } = render(<VodHookSection />);
    expect(container.querySelectorAll('.vodhook-price-old')).toHaveLength(
      VOD_HOOK.cards.length,
    );
    expect(container.querySelectorAll('.vodhook-price-free')).toHaveLength(
      VOD_HOOK.cards.length,
    );
  });

  it('섹션 직후 프로모 띠를 그린다', () => {
    render(<VodHookSection />);
    expect(screen.getByText(VOD_HOOK.promoStrip)).toBeInTheDocument();
  });
});
