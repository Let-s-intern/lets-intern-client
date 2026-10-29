import type { GridInitialState } from '@mui/x-data-grid';
import type { GridApiCommunity } from '@mui/x-data-grid/internals';
import { type MutableRefObject, useCallback, useEffect } from 'react';

/**
 * DataGrid 의 정렬·필터·열 너비를 브라우저(localStorage)에 남겨 다시 들어와도 유지한다.
 * 페이지 번호는 URL(?page=)이 원본이라 저장하지 않는다.
 */
export const usePersistedGridState = (
  storageKey: string,
  apiRef: MutableRefObject<GridApiCommunity>,
) => {
  const save = useCallback(() => {
    if (!apiRef.current?.exportState) return;
    // 열린 메뉴(preferencePanel)와 페이지는 복원 대상이 아니다
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { pagination, preferencePanel, ...state } =
      apiRef.current.exportState();
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // 저장 공간이 없거나 막힌 브라우저면 저장만 건너뛴다
    }
  }, [apiRef, storageKey]);

  // 변경 콜백은 DataGrid 상태가 반영되기 전에 불릴 수 있어 다음 틱에 저장한다
  const saveLater = useCallback(() => {
    setTimeout(save, 0);
  }, [save]);

  // 새로고침·탭 닫기에도 마지막 상태를 남긴다
  useEffect(() => {
    window.addEventListener('beforeunload', save);
    return () => window.removeEventListener('beforeunload', save);
  }, [save]);

  return { initialState: readGridState(storageKey), saveLater };
};

export const readGridState = (
  storageKey: string,
): GridInitialState | undefined => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === 'object'
      ? (parsed as GridInitialState)
      : undefined;
  } catch {
    return undefined;
  }
};
