/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import JitsiEmbedModal, { type JitsiMeta } from './JitsiEmbedModal';

const baseMeta: JitsiMeta = {
  challengeName: '취준 챌린지',
  missionName: '1주차 자소서',
  menteeName: '홍길동',
  startDate: '2026-05-21T19:00:00+09:00',
  feedbackId: 42,
};

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_JITSI_BASE_URL;
const ORIGINAL_FALLBACK = process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL;

describe('JitsiEmbedModal', () => {
  beforeAll(() => {
    // ModalPortal target 컨테이너 보장
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_JITSI_BASE_URL = ORIGINAL_BASE;
    process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL = ORIGINAL_FALLBACK;
  });

  it('env가 설정되어 있으면 동일 meta에 대해 동일한 roomUrl을 렌더한다', () => {
    process.env.NEXT_PUBLIC_JITSI_BASE_URL = 'https://meet.jit.si/';
    process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL =
      'https://jitsi-letscareer.supabin.com/';

    const { rerender } = render(
      <JitsiEmbedModal isOpen onClose={() => {}} meta={baseMeta} />,
    );

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const firstSrc = iframe?.getAttribute('src');
    expect(firstSrc).toMatch(/^https:\/\/meet\.jit\.si\//);

    // 동일 meta 객체를 새로 만들어 재렌더 → 같은 URL 산출
    rerender(
      <JitsiEmbedModal isOpen onClose={() => {}} meta={{ ...baseMeta }} />,
    );
    const iframeAfter = document.querySelector('iframe');
    expect(iframeAfter?.getAttribute('src')).toBe(firstSrc);
  });

  it('env가 누락되면 안내 카피를 렌더한다', () => {
    delete process.env.NEXT_PUBLIC_JITSI_BASE_URL;
    delete process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL;

    render(<JitsiEmbedModal isOpen onClose={() => {}} meta={baseMeta} />);

    expect(
      screen.getByText(/Jitsi 회의실 설정이 누락되었습니다/),
    ).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });
});
