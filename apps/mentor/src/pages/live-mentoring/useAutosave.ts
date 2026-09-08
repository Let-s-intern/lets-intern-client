import { useEffect, useMemo, useRef, useState } from 'react';

/** 저장 시도의 결과. 실패 사유는 하단 바에 그대로 붙는다. */
export interface AutosaveResult {
  ok: boolean;
  /** 실패했을 때 멘토에게 보여줄 한 줄. 없으면 일반 문구를 쓴다. */
  reason?: string;
}

/**
 * 실시간 저장의 현재 상태.
 *
 * `blocked` 는 **아직 보내지 않은** 상태다 — 서버가 `@NotBlank` 로 거절할 값이 남아 있어
 * 보내 봐야 400 이 온다. 이걸 `failed` 와 같은 말로 묶으면 멘토는 고장난 줄 알고 멈춘다.
 */
export type AutosaveStatus =
  /** 보낼 것이 없다. 이번 세션에서 한 번도 저장하지 않았다. */
  | { kind: 'clean' }
  /** 보낼 것이 없다. 방금 저장이 성공했다. */
  | { kind: 'saved' }
  | { kind: 'pending' }
  | { kind: 'saving' }
  | { kind: 'blocked'; reason: string }
  | { kind: 'failed'; reason?: string };

/** 하단 바 왼쪽 한 줄. 무엇이 왜 멈춰 있는지까지 한 문장에 담는다. */
export const autosaveMessage = (status: AutosaveStatus): string => {
  switch (status.kind) {
    /*
      "아직 저장한 적 없음" 과 "방금 저장함" 을 한 문구로 묶지 않는다. 화면을 열자마자
      `저장된 상태예요.` 가 뜨면 손대지도 않았는데 방금 저장이 일어난 것처럼 읽힌다.
     */
    case 'clean':
      return '변경사항이 없어요.';
    case 'saved':
      return '저장했어요.';
    case 'pending':
      return '입력을 멈추면 자동으로 저장돼요.';
    case 'saving':
      return '저장 중...';
    case 'blocked':
      return `저장 대기 · ${status.reason}`;
    case 'failed':
      return status.reason
        ? `저장 실패 · ${status.reason}`
        : '저장하지 못했어요. 내용을 고치면 다시 시도해요.';
  }
};

/** 경고색으로 그릴 상태 — 멘토가 손대야 풀리는 것만 해당한다. */
export const isAutosaveAttention = (status: AutosaveStatus): boolean =>
  status.kind === 'blocked' || status.kind === 'failed';

/**
 * 입력이 멈추면 저장하는 훅 (LC-3282).
 *
 * 하단 바의 「저장」 버튼이 사라지면서 저장을 누를 자리가 없어졌다. 대신 편집이 멎으면
 * 보낸다. 세 가지를 지킨다.
 *
 * - **디바운스는 값으로 건다.** `isDirty` 같은 불리언을 의존성으로 쓰면 첫 글자에서 true 가
 *   된 뒤 계속 true 라 타이머가 다시 시작되지 않는다. 그러면 타이핑 중간에 저장이 나간다
 * - **저장은 겹치지 않는다.** 앞의 요청이 끝난 뒤 다음이 나가도록 한 줄로 세운다.
 *   PUT 두 개가 순서를 바꿔 도착하면 옛 내용이 최종본이 된다
 * - **실패하면 재시도하지 않는다.** 값이 그대로면 결과도 그대로다. 멘토가 다시 고칠 때
 *   자연히 재시도된다 — 같은 요청을 1.5초마다 두들기지 않는다
 */
export const useAutosave = ({
  fingerprint,
  isDirty,
  blockedReason,
  save,
  delay = 1500,
}: {
  /** 저장 대상의 현재 값. 이게 바뀔 때마다 디바운스가 처음부터 다시 간다. */
  fingerprint: string;
  isDirty: boolean;
  /** 지금 보내면 서버가 거절할 이유. null 이면 보낸다. */
  blockedReason: string | null;
  save: () => Promise<AutosaveResult>;
  delay?: number;
}): AutosaveStatus => {
  const [isSaving, setIsSaving] = useState(false);
  const [failure, setFailure] = useState<{ reason?: string } | null>(null);
  /** 이번 세션에서 저장이 한 번이라도 성공했는지. 첫 진입 문구를 가르는 값이다. */
  const [hasSaved, setHasSaved] = useState(false);

  /* 매 렌더 새 함수가 와도 타이머를 다시 걸지 않는다 — 부를 때 최신이면 된다. */
  const saveRef = useRef(save);
  saveRef.current = save;
  /* 저장 요청을 한 줄로 세우는 꼬리. 앞의 것이 끝나야 다음이 나간다. */
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (!isDirty || blockedReason) return;
    setFailure(null);

    const timer = setTimeout(() => {
      queueRef.current = queueRef.current.then(async () => {
        setIsSaving(true);
        try {
          const result = await saveRef.current();
          setFailure(result.ok ? null : { reason: result.reason });
          if (result.ok) setHasSaved(true);
        } finally {
          setIsSaving(false);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [fingerprint, isDirty, blockedReason, delay]);

  /*
    상태를 메모한다. 매 렌더 새 객체를 돌려주면, 이 값을 위로 올려 하단 바를 그리는
    화면(오픈 설정 스텝)에서 `useEffect` → `setState` 가 렌더마다 돌아 무한 루프가 된다.
   */
  return useMemo((): AutosaveStatus => {
    if (isSaving) return { kind: 'saving' };
    if (!isDirty) return hasSaved ? { kind: 'saved' } : { kind: 'clean' };
    if (failure) return { kind: 'failed', reason: failure.reason };
    if (blockedReason) return { kind: 'blocked', reason: blockedReason };
    return { kind: 'pending' };
  }, [isSaving, isDirty, failure, blockedReason, hasSaved]);
};
