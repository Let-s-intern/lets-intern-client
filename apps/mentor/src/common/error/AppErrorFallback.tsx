interface AppErrorFallbackProps {
  /** Sentry ErrorBoundary 가 넘겨주는 복구 콜백. 경계 안쪽을 다시 마운트한다. */
  resetError: () => void;
}

/**
 * 앱 최상위에서 렌더 예외를 잡았을 때 보여주는 화면.
 *
 * 이 경계가 없으면 예외가 흰 화면으로 끝나고, 멘토는 무엇이 잘못됐는지도 다시
 * 시도할 방법도 알 수 없다. Next 는 `global-error.tsx` 가 이 역할을 자동으로
 * 맡지만 Vite SPA 에는 그런 장치가 없어 직접 둔다.
 *
 * "새로고침"을 함께 두는 이유는 배포 직후 stale chunk 로 인한 실패가 이 화면으로
 * 오기 때문이다. 그 경우 resetError 로는 같은 청크를 다시 요청해 복구되지 않는다.
 */
const AppErrorFallback = ({ resetError }: AppErrorFallbackProps) => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-center text-lg font-bold text-neutral-900">
        화면을 표시하지 못했습니다
      </h1>
      <p className="mt-2 text-center text-sm text-neutral-500">
        오류가 자동으로 전달되었습니다. 잠시 후 다시 시도해주세요.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <button
          type="button"
          onClick={resetError}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-gray-50"
        >
          다시 시도
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-primary hover:bg-primary-hover rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          새로고침
        </button>
      </div>
    </div>
  </div>
);

export default AppErrorFallback;
