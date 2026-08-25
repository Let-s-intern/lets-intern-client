import { fireEvent, render, screen } from '@testing-library/react';
import { CHALLENGE_ITEMS } from '../data/challengeModalItems';
import { GUIDEBOOK_CARD, STUDY_CARD } from '../data/guidebooks';
import BenefitsSection from './BenefitsSection';

// 썸네일 조회는 lib/useChallengeThumbnails 가 맡고, 여기서는 섹션의 렌더만 본다.
// 실제 훅은 @/utils/axios 를 끌어오는데 그 경로에 jest 가 파싱하지 못하는 모듈이 있다.
jest.mock('../lib/useChallengeThumbnails', () => ({
  useChallengeThumbnails: () => ({}),
}));

describe('BenefitsSection', () => {
  // 시안 6-0 헤더는 앞 섹션(CoursePlanSection)이 렌더한다. 여기서 다시 그리면 중복이다.
  it('시안 6-0 헤더 문구를 다시 그리지 않는다', () => {
    render(<BenefitsSection />);
    expect(
      screen.queryByText('공채 준비 올인원 패스 혜택'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('하반기 공채 준비에 필요한'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        '개별 구매보다 더 저렴한 가격으로 혜택은 더 풍성하게 준비했어요.',
      ),
    ).not.toBeInTheDocument();
  });

  it('앵커 네비가 쓰는 id="benefits" 를 유지한다', () => {
    const { container } = render(<BenefitsSection />);
    expect(container.querySelector('section#benefits')).not.toBeNull();
  });

  it('블록 소제목 3개를 위에서 아래로 보여준다', () => {
    render(<BenefitsSection />);
    expect(
      screen.getByText('취업 준비 핵심 단계 가이드북 6종 무료 제공'),
    ).toBeInTheDocument();
    expect(screen.getByText('혼자서 하기 힘들다면?')).toBeInTheDocument();
    expect(screen.getByText('챌린지 7종 1회씩 무료 참여')).toBeInTheDocument();
    expect(screen.getByText('직무별 챌린지')).toBeInTheDocument();
    // 렛츠런 스터디 블록은 프로그램 종료로 렌더하지 않는다
    expect(screen.queryByText('렛츠런 스터디 참여')).not.toBeInTheDocument();
  });

  it('챌린지 카드 10개를 core 7개 · job 3개로 렌더한다', () => {
    const { container } = render(<BenefitsSection />);
    // core 7종만. 스터디 카드는 렌더하지 않는다
    expect(
      container.querySelectorAll('.cb-card--core:not(.cb-card--wide)'),
    ).toHaveLength(7);
    expect(container.querySelectorAll('.cb-card--job')).toHaveLength(3);
    for (const item of CHALLENGE_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });

  it('모든 챌린지 링크가 /challenge/{slug}/latest 를 가리킨다', () => {
    render(<BenefitsSection />);
    const links = screen.getAllByRole('link', { name: /챌린지 자세히 보기/ });
    expect(links).toHaveLength(10);
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^\/challenge\/.+\/latest$/);
    }
  });

  it('가이드북 카드만 렌더하고 스터디 카드는 렌더하지 않는다', () => {
    const { container } = render(<BenefitsSection />);
    expect(screen.getByText(GUIDEBOOK_CARD.title)).toBeInTheDocument();
    expect(screen.getByText(GUIDEBOOK_CARD.desc)).toBeInTheDocument();
    expect(screen.queryByText(STUDY_CARD.title)).not.toBeInTheDocument();

    // 배지는 소제목의 강조 문구와 글자가 겹치므로 카드 안에서만 찾는다
    const badges = Array.from(container.querySelectorAll('.cb-badge')).map(
      (el) => el.textContent,
    );
    expect(badges).toContain('11/30까지 열람 가능');
    const detailLinks = screen.getAllByRole('link', { name: /자세히 보기/ });
    const guidebookLink = detailLinks.find(
      (l) => l.getAttribute('href') === GUIDEBOOK_CARD.url,
    );
    const studyLink = detailLinks.find(
      (l) => l.getAttribute('href') === STUDY_CARD.url,
    );
    expect(guidebookLink).toBeDefined();
    expect(studyLink).toBeUndefined();
  });

  it('카드를 클릭해도 모달이 열리지 않는다', () => {
    const { container } = render(<BenefitsSection />);
    const card = container.querySelector('.cb-card');
    expect(card).not.toBeNull();
    fireEvent.click(card as Element);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(container.querySelector('.modal-head')).toBeNull();
  });

  it('가이드북 링크는 앱 내부 가이드북 목록으로 보낸다', () => {
    // 카드가 "6종"을 소개하므로 한 권 상세로 보내면 나머지를 못 찾는다.
    // 절대 URL 이면 dev·로컬에서 프로덕션 도메인으로 나가버린다.
    render(<BenefitsSection />);
    const link = screen
      .getAllByRole('link', { name: /자세히 보기/ })
      .find((l) => l.getAttribute('href') === GUIDEBOOK_CARD.url);
    expect(link).toBeDefined();
    expect(GUIDEBOOK_CARD.url).toBe('/program?type=GUIDEBOOK');
    // 내부 경로는 같은 탭에서 연다
    expect(link).not.toHaveAttribute('target');
  });
});
