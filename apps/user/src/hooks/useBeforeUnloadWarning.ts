import { useEffect } from 'react';

/**
 * @function useBeforeUnloadWarning
 * @description
 * 특정 조건(condition)이 true일 때, 사용자가 페이지를 새로고침하거나 닫으려 할 때
 * 브라우저의 beforeunload 이벤트를 통해 경고창을 띄워주는 커스텀 훅입니다.
 * 저장되지 않은 변경사항이 있을 때 페이지 이탈을 방지하는 용도로 주로 사용됩니다.
 *
 * @param {boolean} condition - 경고창을 띄울지 여부를 결정하는 조건입니다. true일 때만 beforeunload 이벤트가 활성화됩니다.
 *
 * @example
 * // content가 원본과 다를 때만 경고창을 띄움
 * useBeforeUnloadWarning(content !== prevContent);
 *
 * @remarks
 * - condition이 true가 되면 beforeunload 이벤트 리스너를 등록합니다.
 * - condition이 false가 되면 리스너를 제거합니다.
 * - 컴포넌트 언마운트 시에도 리스너를 정리합니다.
 */

export default function useBeforeUnloadWarning(condition: boolean) {
  useEffect(() => {
    const beforeUnloadListener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return true;
    };

    if (!condition) {
      window.removeEventListener('beforeunload', beforeUnloadListener, {
        capture: true,
      });
    } else {
      window.addEventListener('beforeunload', beforeUnloadListener, {
        capture: true,
      });
    }

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadListener, {
        capture: true,
      });
    };
  }, [condition]);
}
