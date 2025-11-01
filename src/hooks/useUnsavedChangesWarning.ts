import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * @function useUnsavedChangesWarning
 * @description
 * 저장되지 않은 변경사항이 있을 때 페이지 이탈을 방지하는 훅입니다.
 * - 브라우저 새로고침/탭 닫기 시도 시 경고
 * - Next.js 라우터를 통한 페이지 이동 시도 시 확인 다이얼로그
 *
 * @param {boolean} hasUnsavedChanges - 저장되지 않은 변경사항이 있는지 여부
 * @param {string} message - 사용자에게 표시할 경고 메시지 (기본값: "저장하지 않은 변경사항이 있습니다. 페이지를 나가시겠습니까?")
 *
 * @example
 * // 폼이 수정되었을 때 경고 표시
 * const { isDirty } = useForm();
 * useUnsavedChangesWarning(isDirty);
 *
 * @example
 * // 커스텀 메시지와 함께 사용
 * useUnsavedChangesWarning(
 *   content !== originalContent,
 *   "작성 중인 내용이 저장되지 않았습니다. 정말 나가시겠습니까?"
 * );
 */
export function useUnsavedChangesWarning(
  hasUnsavedChanges: boolean,
  message: string = '저장하지 않은 변경사항이 있습니다. 페이지를 나가시겠습니까?',
) {
  const router = useRouter();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // 1. 브라우저 새로고침/탭 닫기 방지
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        // 최신 브라우저에서는 커스텀 메시지가 무시되고 브라우저 기본 메시지가 표시됩니다
        return (event.returnValue = message);
      }
    };

    // 2. 브라우저 뒤로가기/앞으로가기 방지
    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChanges && !isNavigatingRef.current) {
        const confirmLeave = window.confirm(message);
        if (!confirmLeave) {
          // 사용자가 취소를 선택하면 현재 페이지로 되돌림
          window.history.pushState(null, '', window.location.href);
        } else {
          isNavigatingRef.current = true;
        }
      }
    };

    // 3. 페이지 이탈 시도 감지 (링크 클릭 등)
    const handleClick = (event: MouseEvent) => {
      if (!hasUnsavedChanges) return;

      const target = event.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.href) {
        const currentUrl = window.location.href;
        const targetUrl = anchor.href;

        // 같은 페이지가 아니고, 외부 링크가 아닌 경우
        if (
          targetUrl !== currentUrl &&
          targetUrl.startsWith(window.location.origin)
        ) {
          const confirmLeave = window.confirm(message);
          if (!confirmLeave) {
            event.preventDefault();
            event.stopPropagation();
          } else {
            isNavigatingRef.current = true;
          }
        }
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      document.addEventListener('click', handleClick, true);

      // 페이지 로드 시 히스토리 스택에 현재 페이지 추가 (뒤로가기 방지용)
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
      isNavigatingRef.current = false;
    };
  }, [hasUnsavedChanges, message]);

  // router.push, router.replace 등을 래핑하여 경고 표시
  const safeRouter = {
    push: (href: string, options?: any) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          isNavigatingRef.current = true;
          router.push(href, options);
        }
      } else {
        router.push(href, options);
      }
    },
    replace: (href: string, options?: any) => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          isNavigatingRef.current = true;
          router.replace(href, options);
        }
      } else {
        router.replace(href, options);
      }
    },
    back: () => {
      if (hasUnsavedChanges) {
        const confirmLeave = window.confirm(message);
        if (confirmLeave) {
          isNavigatingRef.current = true;
          router.back();
        }
      } else {
        router.back();
      }
    },
  };

  return safeRouter;
}
