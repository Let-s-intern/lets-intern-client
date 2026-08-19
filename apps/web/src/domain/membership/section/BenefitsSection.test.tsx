import { fireEvent, render, screen } from '@testing-library/react';
import { CHALLENGE_ITEMS } from '../data/challengeModalItems';
import { GUIDEBOOK_CARD, STUDY_CARD } from '../data/guidebooks';
import BenefitsSection from './BenefitsSection';

describe('BenefitsSection', () => {
  it('섹션 배지와 헤드라인을 렌더한다', () => {
    render(<BenefitsSection />);
    expect(screen.getByText('공채 준비 올인원 패스 혜택')).toBeInTheDocument();
    expect(screen.getByText('하반기 공채 준비에 필요한')).toBeInTheDocument();
    expect(screen.getByText('올인원 패스')).toBeInTheDocument();
    expect(screen.getByText('모든 혜택')).toBeInTheDocument();
    expect(
      screen.getByText(
        '개별 구매보다 더 저렴한 가격으로 혜택은 더 풍성하게 준비했어요.',
      ),
    ).toBeInTheDocument();
  });

  it('앵커 네비가 쓰는 id="benefits" 를 유지한다', () => {
    const { container } = render(<BenefitsSection />);
    expect(container.querySelector('section#benefits')).not.toBeNull();
  });

  it('블록 소제목 4개를 위에서 아래로 보여준다', () => {
    render(<BenefitsSection />);
    expect(
      screen.getByText('취업 준비 핵심 단계 가이드북 6종 무료 제공'),
    ).toBeInTheDocument();
    expect(screen.getByText('혼자서 하기 힘들다면?')).toBeInTheDocument();
    expect(screen.getByText('챌린지 7종 1회씩 무료 참여')).toBeInTheDocument();
    expect(screen.getByText('직무별 챌린지')).toBeInTheDocument();
    expect(screen.getByText('렛츠런 스터디 참여')).toBeInTheDocument();
  });

  it('챌린지 카드 10개를 core 7개 · job 3개로 렌더한다', () => {
    const { container } = render(<BenefitsSection />);
    expect(
      container.querySelectorAll('.cb-card--core:not(.cb-card--wide)'),
    ).toHaveLength(7 + 1); // core 7종 + 스터디 카드
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

  it('가이드북 카드와 스터디 카드를 렌더한다', () => {
    const { container } = render(<BenefitsSection />);
    expect(screen.getByText(GUIDEBOOK_CARD.title)).toBeInTheDocument();
    expect(screen.getByText(GUIDEBOOK_CARD.desc)).toBeInTheDocument();
    expect(screen.getByText(STUDY_CARD.title)).toBeInTheDocument();

    // 배지는 소제목의 강조 문구와 글자가 겹치므로 카드 안에서만 찾는다
    const badges = Array.from(container.querySelectorAll('.cb-badge')).map(
      (el) => el.textContent,
    );
    expect(badges).toContain('11/30까지 열람 가능');
    expect(badges).toContain('무료 참여');
    expect(badges).toContain('페이백 불가');

    const detailLinks = screen.getAllByRole('link', { name: /자세히 보기/ });
    const guidebookLink = detailLinks.find(
      (l) => l.getAttribute('href') === GUIDEBOOK_CARD.url,
    );
    const studyLink = detailLinks.find(
      (l) => l.getAttribute('href') === STUDY_CARD.url,
    );
    expect(guidebookLink).toBeDefined();
    expect(studyLink).toBeDefined();
  });

  it('카드를 클릭해도 모달이 열리지 않는다', () => {
    const { container } = render(<BenefitsSection />);
    const card = container.querySelector('.cb-card');
    expect(card).not.toBeNull();
    fireEvent.click(card as Element);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(container.querySelector('.modal-head')).toBeNull();
  });
});
