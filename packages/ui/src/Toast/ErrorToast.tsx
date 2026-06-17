'use client';

/**
 * Layer 2b — 실패/오류 알림 preset.
 *
 * 어떤 컴포넌트인가:
 *   Toast(Layer 1) 위에 얇게 얹은 wrapper. variant를 'error'로 고정해 호출부가
 *   톤 결정을 못 하도록 컴파일 타임에 차단한다. 작업 실패/검증 에러/네트워크 오류
 *   등 부정적인 결과 통보에 사용한다.
 *
 *   imperative 호출이 더 자연스러운 케이스(핸들러 안에서 즉시 발화)는 useToast의
 *   `toast.error(...)`를 쓰는 게 일반적이다. 이 컴포넌트는 토스트가 컴포넌트
 *   트리에 선언적으로 표현되어야 할 특수 케이스용.
 *
 * 어디에 쓰이는가:
 *   직접 호출처 0건 (apps/web — 2026-05-21).
 *   useToast의 toast.error로 처리되는 케이스는 useToast 주석을 참고.
 *   직접 사용 케이스가 생기면 여기에 기록해주세요.
 */

import { Toast, type ToastProps } from './Toast';

export type ErrorToastProps = Omit<ToastProps, 'variant'>;

export function ErrorToast(props: ErrorToastProps) {
  return <Toast {...props} variant="error" />;
}
