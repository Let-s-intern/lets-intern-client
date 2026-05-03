import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';
import { AsyncBoundary } from './AsyncBoundary';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
}

function ThrowError({ message }: { message: string }): never {
  throw new Error(message);
}

function SuspendForever(): never {
  throw new Promise(() => {});
}

describe('AsyncBoundary', () => {
  it('children을 정상적으로 렌더링한다', () => {
    render(
      <AsyncBoundary>
        <div>정상 콘텐츠</div>
      </AsyncBoundary>,
    );

    expect(screen.getByText('정상 콘텐츠')).toBeInTheDocument();
  });

  it('에러 발생 시 기본 에러 폴백을 렌더링한다', () => {
    // suppress console.error from ErrorBoundary
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AsyncBoundary>
        <ThrowError message="테스트 에러" />
      </AsyncBoundary>,
    );

    expect(screen.getByText('문제가 발생했습니다.')).toBeInTheDocument();
    expect(screen.getByText('다시 시도')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('커스텀 rejectedFallback을 렌더���한다', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AsyncBoundary
        rejectedFallback={({ error }) => (
          <div>커스텀 에러: {error.message}</div>
        )}
      >
        <ThrowError message="커스텀 테스트" />
      </AsyncBoundary>,
    );

    expect(screen.getByText('커스텀 에러: 커스텀 테스트')).toBeInTheDocument();

    spy.mockRestore();
  });

  it('Suspense 중 pendingFallback을 렌더링한다', () => {
    render(
      <AsyncBoundary pendingFallback={<div>로딩 중...</div>}>
        <SuspendForever />
      </AsyncBoundary>,
    );

    expect(screen.getByText('로딩 중...')).toBeInTheDocument();
  });

  it('다시 시도 버튼 클릭 시 resetErrorBoundary를 호출한다', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;

    function MaybeThrow() {
      if (shouldThrow) throw new Error('일시적 에��');
      return <div>복구 성공</div>;
    }

    render(
      <AsyncBoundary>
        <MaybeThrow />
      </AsyncBoundary>,
    );

    expect(screen.getByText('문제가 발생했습니다.')).toBeInTheDocument();

    shouldThrow = false;
    await userEvent.click(screen.getByText('다시 시도'));

    expect(screen.getByText('복구 성공')).toBeInTheDocument();

    spy.mockRestore();
  });
});
