/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import JitsiEmbedModal, { type JitsiMeta } from './JitsiEmbedModal';

const baseMeta: JitsiMeta = {
  feedbackId: 42,
};

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_JITSI_BASE_URL;
const ORIGINAL_SALT = process.env.NEXT_PUBLIC_JITSI_ROOM_SALT;

describe('JitsiEmbedModal', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_JITSI_BASE_URL = ORIGINAL_BASE;
    process.env.NEXT_PUBLIC_JITSI_ROOM_SALT = ORIGINAL_SALT;
  });

  it('env가 설정되어 있으면 동일 meta에 대해 동일한 roomUrl을 렌더한다', () => {
    process.env.NEXT_PUBLIC_JITSI_BASE_URL =
      'https://jitsi-letscareer.supabin.com/';
    process.env.NEXT_PUBLIC_JITSI_ROOM_SALT = 'test-salt';

    const { rerender } = render(
      <JitsiEmbedModal isOpen onClose={() => {}} meta={baseMeta} />,
    );

    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    const firstSrc = iframe?.getAttribute('src');
    expect(firstSrc).toMatch(
      /^https:\/\/jitsi-letscareer\.supabin\.com\/letscareer-livefeedback-/,
    );

    rerender(
      <JitsiEmbedModal isOpen onClose={() => {}} meta={{ ...baseMeta }} />,
    );
    const iframeAfter = document.querySelector('iframe');
    expect(iframeAfter?.getAttribute('src')).toBe(firstSrc);
  });

  it('env가 누락되면 안내 카피를 렌더한다', () => {
    delete process.env.NEXT_PUBLIC_JITSI_BASE_URL;
    delete process.env.NEXT_PUBLIC_JITSI_ROOM_SALT;

    render(<JitsiEmbedModal isOpen onClose={() => {}} meta={baseMeta} />);

    expect(
      screen.getByText(/Jitsi 회의실 설정이 누락되었습니다/),
    ).toBeInTheDocument();
    expect(document.querySelector('iframe')).toBeNull();
  });
});
