'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  pickNextBase,
  probeJitsiExternalApi,
  safeHost,
} from './jitsiHealthCheck';

/**
 * - `probing`     : external_api.js 로드 프로브 진행 중 (아직 회의실 미마운트)
 * - `ready`       : 프로브 성공 — 회의실 마운트 가능
 * - `reconnecting`: 로드/접속 실패 → 다른 서버로 재등록 중 (부모 refetch 대기)
 * - `failed`      : 후보 소진 또는 재등록 실패 — 종단 에러
 */
export type JitsiConnectionStatus =
  | 'probing'
  | 'ready'
  | 'reconnecting'
  | 'failed';

export interface UseJitsiConnectionOptions {
  /** BE 가 합성한 회의실 URL. 프로브·마운트 대상. */
  roomUrl: string;
  /** 우선순위 순 jitsi base 후보 (앱별 env). 없으면 failover 없이 프로브만. */
  baseCandidates?: ReadonlyArray<string | undefined>;
  /**
   * 다음 base 를 BE 에 재등록하는 콜백 (앱별 `PATCH /feedback/{id}/meeting-url`).
   * 성공하면 부모가 쿼리 invalidate → refetch → `roomUrl` 이 갱신되어 재프로브된다.
   * (BE `updateValue` patch-semantics 로 기존 meetingUrl 을 덮어쓴다.)
   */
  registerBaseUrl?: (base: string) => Promise<void>;
  /** 모든 후보 소진(입장 가능한 서버 없음) 시 호출. */
  onExhausted?: () => void;
}

/**
 * Jitsi 회의실 연결 상태 머신 — 사전 프로브 + 서버 failover.
 *
 * SDK(`@jitsi/react-sdk`)는 external_api.js 로드 실패를 `console.error` 로 삼키고,
 * 모듈 전역 `scriptPromise` 싱글톤이 한 번 reject 되면 재사용되어 도메인만 바꿔
 * remount 해도 재시도가 안 된다. 그래서 **SDK 를 태우기 전에** 우리가 직접 프로브해
 * 성공한 서버로만 회의실을 마운트하고, 실패하면 다음 후보로 재등록한다.
 */
export function useJitsiConnection({
  roomUrl,
  baseCandidates,
  registerBaseUrl,
  onExhausted,
}: UseJitsiConnectionOptions) {
  const [status, setStatus] = useState<JitsiConnectionStatus>('probing');

  // 이미 실패한 도메인 host — roomUrl 이 바뀌어도(재프로브) 유지되어 루프를 막는다.
  const triedHostsRef = useRef<Set<string>>(new Set());
  // 재등록 in-flight 가드 — connectionFailed 연속 발화로 중복 failover 방지.
  const failingRef = useRef(false);
  // 최신 옵션을 ref 로 잡아 프로브 effect 의존성을 roomUrl 로 고정(배열 리터럴 재생성 무시).
  const optsRef = useRef({ baseCandidates, registerBaseUrl, onExhausted });
  optsRef.current = { baseCandidates, registerBaseUrl, onExhausted };

  const failover = useCallback(async (failedUrl: string) => {
    if (failingRef.current) return;
    failingRef.current = true;
    try {
      const {
        baseCandidates: candidates,
        registerBaseUrl: register,
        onExhausted: exhausted,
      } = optsRef.current;

      const host = safeHost(failedUrl);
      if (host) triedHostsRef.current.add(host);

      const next = pickNextBase(candidates ?? [], triedHostsRef.current);
      if (!next || !register) {
        setStatus('failed');
        exhausted?.();
        return;
      }

      setStatus('reconnecting');
      try {
        // 재등록 성공 → 부모 refetch → roomUrl 갱신 → 아래 effect 가 새 도메인 재프로브.
        await register(next);
      } catch {
        setStatus('failed');
        exhausted?.();
      }
    } finally {
      failingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus('probing');
    probeJitsiExternalApi(roomUrl).then((ok) => {
      if (cancelled) return;
      if (ok) setStatus('ready');
      else failover(roomUrl);
    });
    return () => {
      cancelled = true;
    };
  }, [roomUrl, failover]);

  /** 접속 후 런타임 실패(connectionFailed 등) → 동일 failover 경로. */
  const reportRuntimeError = useCallback(() => {
    failover(roomUrl);
  }, [failover, roomUrl]);

  return { status, reportRuntimeError };
}
