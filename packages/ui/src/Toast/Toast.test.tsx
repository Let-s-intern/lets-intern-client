import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { Toast } from './Toast';
import { ToastProvider, ToastViewport } from './primitives';
import { Toaster } from './Toaster';
import { useToast } from './useToast';
import { SuccessToast } from './SuccessToast';
import { ErrorToast } from './ErrorToast';

function withProvider(ui: React.ReactNode) {
  return (
    <ToastProvider swipeDirection="right">
      {ui}
      <ToastViewport />
    </ToastProvider>
  );
}

describe('Toast (Layer 1)', () => {
  it('open=true 일 때 title이 표시된다', () => {
    render(
      withProvider(
        <Toast open onOpenChange={() => {}} title="저장되었습니다" />,
      ),
    );
    expect(screen.getByText('저장되었습니다')).toBeInTheDocument();
  });

  it('description이 있으면 함께 렌더된다', () => {
    render(
      withProvider(
        <Toast
          open
          onOpenChange={() => {}}
          title="제목"
          description="설명입니다"
        />,
      ),
    );
    expect(screen.getByText('설명입니다')).toBeInTheDocument();
  });

  it('variant="success" 일 때 data-variant=success + 아이콘 wrapper에 green 톤 적용', () => {
    const { container } = render(
      withProvider(
        <Toast open onOpenChange={() => {}} title="성공" variant="success" />,
      ),
    );
    const toast = screen.getByText('성공').closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'success');
    // 아이콘 wrapper에 variant 컬러 톤 적용 확인
    expect(container.innerHTML).toContain('bg-green-50');
    expect(container.innerHTML).toContain('text-green-600');
  });

  it('variant="error" 일 때 data-variant=error + 아이콘 wrapper에 red 톤 적용', () => {
    const { container } = render(
      withProvider(
        <Toast open onOpenChange={() => {}} title="실패" variant="error" />,
      ),
    );
    const toast = screen.getByText('실패').closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'error');
    expect(container.innerHTML).toContain('bg-red-50');
    expect(container.innerHTML).toContain('text-red-600');
  });

  it('variant 미지정 시 data-variant=default 가 적용된다', () => {
    render(
      withProvider(<Toast open onOpenChange={() => {}} title="기본" />),
    );
    const toast = screen.getByText('기본').closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'default');
  });

  it('닫기 버튼 클릭 시 onOpenChange(false)가 호출된다', async () => {
    const onOpenChange = vi.fn();
    render(
      withProvider(
        <Toast open onOpenChange={onOpenChange} title="제목" />,
      ),
    );
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });
});

describe('SuccessToast (Layer 2a)', () => {
  it('variant=success 가 강제되어 data-variant=success 가 적용된다', () => {
    render(
      withProvider(
        <SuccessToast open onOpenChange={() => {}} title="저장 완료" />,
      ),
    );
    const toast = screen.getByText('저장 완료').closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'success');
  });
});

describe('ErrorToast (Layer 2b)', () => {
  it('variant=error 가 강제되어 data-variant=error 가 적용된다', () => {
    render(
      withProvider(
        <ErrorToast open onOpenChange={() => {}} title="저장 실패" />,
      ),
    );
    const toast = screen.getByText('저장 실패').closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'error');
  });
});

describe('Toaster + useToast', () => {
  function Trigger({
    fire,
  }: {
    fire: (toast: ReturnType<typeof useToast>) => void;
  }) {
    const toast = useToast();
    return (
      <button type="button" onClick={() => fire(toast)}>
        trigger
      </button>
    );
  }

  it('toast.success 호출 시 success variant toast가 렌더된다', async () => {
    render(
      <Toaster>
        <Trigger fire={(t) => t.success('비밀번호가 변경되었습니다')} />
      </Toaster>,
    );
    await userEvent.click(screen.getByText('trigger'));
    const node = await screen.findByText('비밀번호가 변경되었습니다');
    const toast = node.closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'success');
  });

  it('toast.error 호출 시 error variant toast가 렌더된다', async () => {
    render(
      <Toaster>
        <Trigger fire={(t) => t.error('비밀번호 변경에 실패했습니다')} />
      </Toaster>,
    );
    await userEvent.click(screen.getByText('trigger'));
    const node = await screen.findByText('비밀번호 변경에 실패했습니다');
    const toast = node.closest('[data-variant]');
    expect(toast).toHaveAttribute('data-variant', 'error');
  });

  it('toast({ variant, title, description }) 일반 호출도 동작한다', async () => {
    render(
      <Toaster>
        <Trigger
          fire={(t) =>
            t.toast({
              variant: 'default',
              title: '안내',
              description: '상세 설명',
            })
          }
        />
      </Toaster>,
    );
    await userEvent.click(screen.getByText('trigger'));
    expect(await screen.findByText('안내')).toBeInTheDocument();
    expect(screen.getByText('상세 설명')).toBeInTheDocument();
  });

  it('Toaster 외부에서 useToast 호출 시 에러를 throw한다', () => {
    function Bad() {
      useToast();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(/Toaster/);
    spy.mockRestore();
  });
});
