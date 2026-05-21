import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { JitsiEmbed } from './index';

const PRIMARY_URL = 'https://meet.jit.si/room-abcd';
const FALLBACK_URL = 'https://jitsi-letscareer.supabin.com/room-abcd';

function renderEmbed(overrides?: Partial<React.ComponentProps<typeof JitsiEmbed>>) {
  const onClose = overrides?.onClose ?? vi.fn();
  const utils = render(
    <JitsiEmbed
      roomUrl={PRIMARY_URL}
      fallbackUrl={FALLBACK_URL}
      onClose={onClose}
      {...overrides}
    />,
  );
  return { ...utils, onClose };
}

describe('JitsiEmbed', () => {
  it('초기 렌더 시 primary URL을 iframe src로 사용한다', () => {
    renderEmbed();
    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toBe(PRIMARY_URL);
  });

  it('"다른 서버로 입장" 버튼 클릭 시 fallback URL로 src가 교체된다', () => {
    renderEmbed();
    const button = screen.getByRole('button', { name: '다른 서버로 입장' });
    fireEvent.click(button);
    const iframe = document.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toBe(FALLBACK_URL);
  });

  it('fallback 상태에서 토글 버튼 라벨이 "공식 서버로 입장"으로 바뀐다', () => {
    renderEmbed();
    fireEvent.click(screen.getByRole('button', { name: '다른 서버로 입장' }));
    expect(
      screen.getByRole('button', { name: '공식 서버로 입장' }),
    ).toBeInTheDocument();
  });

  it('한 번 더 클릭하면 primary URL로 돌아온다', () => {
    renderEmbed();
    fireEvent.click(screen.getByRole('button', { name: '다른 서버로 입장' }));
    fireEvent.click(screen.getByRole('button', { name: '공식 서버로 입장' }));
    const iframe = document.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toBe(PRIMARY_URL);
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    const onClose = vi.fn();
    renderEmbed({ onClose });
    fireEvent.click(screen.getByRole('button', { name: '닫기' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('spaceName을 prop으로 받으면 헤더에 표시한다', () => {
    renderEmbed({ spaceName: '1주차 자소서 피드백' });
    expect(screen.getByText('1주차 자소서 피드백')).toBeInTheDocument();
  });

  it('spaceName이 없으면 기본 라벨이 노출된다', () => {
    renderEmbed();
    expect(screen.getByText('Jitsi 라이브 피드백')).toBeInTheDocument();
  });

  it('iframe에 미디어 권한이 부여된다', () => {
    renderEmbed();
    const iframe = document.querySelector('iframe');
    const allow = iframe?.getAttribute('allow') ?? '';
    expect(allow).toContain('camera');
    expect(allow).toContain('microphone');
    expect(allow).toContain('display-capture');
  });

  it('"새 창에서 열기" 링크가 현재 활성 서버 URL을 가리킨다', () => {
    renderEmbed();
    const link = screen.getByRole('link', { name: '새 창에서 열기' });
    expect(link).toHaveAttribute('href', PRIMARY_URL);
    fireEvent.click(screen.getByRole('button', { name: '다른 서버로 입장' }));
    expect(screen.getByRole('link', { name: '새 창에서 열기' })).toHaveAttribute(
      'href',
      FALLBACK_URL,
    );
  });
});
