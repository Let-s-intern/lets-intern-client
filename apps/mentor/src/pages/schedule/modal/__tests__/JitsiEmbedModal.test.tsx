import { render, screen } from '@testing-library/react';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

import JitsiEmbedModal, { type JitsiMeta } from '../JitsiEmbedModal';

const baseMeta: JitsiMeta = {
  challengeName: '취준 챌린지',
  missionName: '1주차 자소서',
  menteeName: '홍길동',
  startDate: '2026-05-21T19:00:00+09:00',
  feedbackId: 42,
};

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
    vi.unstubAllEnvs();
  });

  it('env가 설정되어 있으면 동일 meta에 대해 동일한 roomUrl을 렌더한다', () => {
    vi.stubEnv('VITE_JITSI_BASE_URL', 'https://meet.jit.si/');
    vi.stubEnv(
      'VITE_JITSI_FALLBACK_URL',
      'https://jitsi-letscareer.supabin.com/',
    );

    const { rerender } = render(
      <JitsiEmbedModal isOpen onClose={() => {}} meta={baseMeta} />,
    );

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const firstSrc = iframe?.getAttribute('src');
    expect(firstSrc).toMatch(/^https:\/\/meet\.jit\.si\//);

    // 동일 meta 객체를 새로 만들어 재렌더 → 같은 URL 산출 (양측 동일 방 보장의 핵심)
    rerender(
      <JitsiEmbedModal isOpen onClose={() => {}} meta={{ ...baseMeta }} />,
    );
    const iframeAfter = document.querySelector('iframe');
    expect(iframeAfter?.getAttribute('src')).toBe(firstSrc);
  });

  it('env가 누락되면 안내 카피를 렌더한다', () => {
    vi.stubEnv('VITE_JITSI_BASE_URL', '');
    vi.stubEnv('VITE_JITSI_FALLBACK_URL', '');

    render(<JitsiEmbedModal isOpen onClose={() => {}} meta={baseMeta} />);

    expect(
      screen.getByText(/Jitsi 회의실 설정이 누락되었습니다/),
    ).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });
});
