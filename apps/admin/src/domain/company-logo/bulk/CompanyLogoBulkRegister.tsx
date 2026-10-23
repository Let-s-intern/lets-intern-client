import { Button, TextField } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import {
  AdminCompanyLogoQueryKey,
  createCompanyLogo,
  fetchCompanyLogoFaviconCandidates,
  uploadCompanyLogoFavicon,
  useAdminCompanyLogoListQuery,
} from '@/api/company-logo/companyLogo';
import { faviconErrorMessage } from '@/common/company-logo/faviconErrorMessage';

import type { BulkRow } from './types/bulkRow';
import BulkLogoRow from './ui/BulkLogoRow';
import { hostOf, MAX_BULK_SITES, parseSiteUrls } from './utils/parseSiteUrls';
import { runWithLimit } from './utils/runWithLimit';

/** 서버에 한 번에 보내는 요청 수 */
const CONCURRENCY = 3;

const normalizeName = (name: string) => name.trim().toLowerCase();

const saveErrorMessage = (error: unknown) => {
  const { status, code, message } = (error ?? {}) as {
    status?: number;
    code?: string;
    message?: string;
  };
  if (status === 409) return '같은 회사명이 이미 있습니다.';
  if (code?.startsWith('COMPANY_LOGO_FAVICON'))
    return faviconErrorMessage(error);
  return message ?? '저장하지 못했습니다.';
};

let rowSeq = 0;

interface Props {
  /** 저장하지 않은 행이 생기거나 사라질 때 알린다. 바깥 탭 이동을 막는 데 쓴다 */
  onDirtyChange?: (isDirty: boolean) => void;
  onGoToList: () => void;
}

/**
 * 회사 로고 일괄 등록. 사이트 주소를 줄마다 넣으면 사이트마다 로고 후보와 이름을 찾아 표로 보여 주고,
 * 고친 뒤 체크한 행만 「파비콘 올리기 → 로고 등록」 순서로 저장한다. 서버에는 동시에 3개씩만 보낸다.
 */
export default function CompanyLogoBulkRegister({
  onDirtyChange,
  onGoToList,
}: Props) {
  const queryClient = useQueryClient();
  const { data: libraryLogos = [] } = useAdminCompanyLogoListQuery();

  const [input, setInput] = useState('');
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  // 화면을 떠나면 진행 중인 가져오기를 멈춘다
  // (개발 모드 StrictMode 의 다시 마운트에도 새로 만들도록 effect 안에서 만든다)
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    return () => controller.abort();
  }, []);

  const isDirty = rows.some((row) => row.status !== 'saved');
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    if (!isSaving) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaving]);

  const updateRow = (key: string, patch: Partial<BulkRow>) =>
    setRows((prev) =>
      prev.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );

  const fetchRow = async (row: BulkRow) => {
    const signal = abortRef.current?.signal;
    try {
      const { candidates, siteName } = await fetchCompanyLogoFaviconCandidates(
        row.siteUrl,
        signal,
      );
      if (signal?.aborted) return;
      if (candidates.length === 0) {
        updateRow(row.key, {
          status: 'fetchFailed',
          error: faviconErrorMessage({
            code: 'COMPANY_LOGO_FAVICON_FETCH_FAILED',
          }),
          checked: false,
        });
        return;
      }
      updateRow(row.key, {
        status: 'ready',
        error: null,
        candidates,
        candidateUrl: candidates[0].url,
        name: siteName || row.host,
        checked: true,
      });
    } catch (error) {
      if (signal?.aborted) return;
      updateRow(row.key, {
        status: 'fetchFailed',
        error: faviconErrorMessage(error),
        checked: false,
      });
    }
  };

  const handleImport = () => {
    const { siteUrls, removedDuplicates, isOverLimit } = parseSiteUrls(
      input,
      rows.map((row) => row.host),
    );
    if (isOverLimit) {
      setNotice(
        `한 번에 ${MAX_BULK_SITES}개까지 가져올 수 있습니다. 지금 ${siteUrls.length}개입니다.`,
      );
      return;
    }
    setNotice(
      removedDuplicates > 0
        ? `같은 사이트 ${removedDuplicates}개를 뺐습니다.`
        : null,
    );
    if (siteUrls.length === 0) return;

    const newRows: BulkRow[] = siteUrls.map((siteUrl) => {
      rowSeq += 1;
      return {
        key: `row-${rowSeq}`,
        siteUrl,
        host: hostOf(siteUrl),
        status: 'loading',
        error: null,
        candidates: [],
        candidateUrl: '',
        name: '',
        checked: false,
        uploaded: null,
      };
    });
    setRows((prev) => [...prev, ...newRows]);
    setInput('');
    setSummary(null);
    void runWithLimit(newRows, CONCURRENCY, fetchRow, abortRef.current?.signal);
  };

  const handleRetry = (row: BulkRow) => {
    updateRow(row.key, { status: 'loading', error: null });
    void fetchRow(row);
  };

  const libraryNames = new Set(
    libraryLogos.map((logo) => normalizeName(logo.name)),
  );
  const nameCounts = rows.reduce<Record<string, number>>((counts, row) => {
    const name = normalizeName(row.name);
    if (name) counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});
  const isDuplicate = (row: BulkRow) => {
    const name = normalizeName(row.name);
    return (
      name !== '' && (libraryNames.has(name) || (nameCounts[name] ?? 0) > 1)
    );
  };

  const targets = rows.filter(
    (row) =>
      row.checked && (row.status === 'ready' || row.status === 'saveFailed'),
  );

  const saveRow = async (row: BulkRow) => {
    const name = row.name.trim();
    if (!name) {
      updateRow(row.key, {
        status: 'saveFailed',
        error: '회사명을 입력해 주세요.',
      });
      return false;
    }
    try {
      // 등록만 실패했던 행은 같은 후보면 다시 올리지 않는다
      const imageUrl =
        row.uploaded?.candidateUrl === row.candidateUrl
          ? row.uploaded.imageUrl
          : await uploadCompanyLogoFavicon({
              siteUrl: row.siteUrl,
              candidateUrl: row.candidateUrl,
            });
      updateRow(row.key, {
        uploaded: { candidateUrl: row.candidateUrl, imageUrl },
      });
      await createCompanyLogo({ name, imageUrl });
      updateRow(row.key, { status: 'saved', error: null, checked: false });
      return true;
    } catch (error) {
      updateRow(row.key, {
        status: 'saveFailed',
        error: saveErrorMessage(error),
      });
      return false;
    }
  };

  const handleSave = async () => {
    const saving = targets;
    setIsSaving(true);
    setSummary(null);
    saving.forEach((row) =>
      updateRow(row.key, { status: 'saving', error: null }),
    );
    let savedCount = 0;
    await runWithLimit(saving, CONCURRENCY, async (row) => {
      if (await saveRow(row)) savedCount += 1;
    });
    setIsSaving(false);
    setSummary(`${savedCount}개 저장, ${saving.length - savedCount}개 실패`);
    await queryClient.invalidateQueries({
      queryKey: [AdminCompanyLogoQueryKey],
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <TextField
          multiline
          minRows={4}
          placeholder={`회사 사이트 주소를 한 줄에 하나씩 넣어 주세요 (최대 ${MAX_BULK_SITES}개)\nhttps://toss.im\nhttps://www.kakaocorp.com`}
          inputProps={{ 'aria-label': '사이트 주소 목록' }}
          value={input}
          disabled={isSaving}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            disabled={!input.trim() || isSaving}
            onClick={handleImport}
          >
            가져오기
          </Button>
          {notice ? (
            <p role="status" className="text-xsmall14 text-neutral-30">
              {notice}
            </p>
          ) : null}
        </div>
      </div>

      {rows.length > 0 ? (
        <div className="border-neutral-80 overflow-x-auto rounded-lg border">
          <table className="w-full min-w-[960px] border-collapse">
            <thead className="border-neutral-80 bg-neutral-95 border-b">
              <tr className="text-neutral-40 text-left text-xs">
                <th className="px-3 py-2 font-medium">저장</th>
                <th className="px-3 py-2 font-medium">사이트 주소</th>
                <th className="px-3 py-2 font-medium">상태</th>
                <th className="px-3 py-2 font-medium">로고</th>
                <th className="px-3 py-2 font-medium">회사명</th>
                <th className="px-3 py-2 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <BulkLogoRow
                  key={row.key}
                  row={row}
                  isDuplicate={isDuplicate(row)}
                  isLocked={isSaving}
                  onChange={(patch) => updateRow(row.key, patch)}
                  onRetry={() => handleRetry(row)}
                  onRemove={() =>
                    setRows((prev) =>
                      prev.filter((item) => item.key !== row.key),
                    )
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="flex items-center justify-end gap-3">
          {summary ? (
            <>
              <p role="status" className="text-xsmall14 text-neutral-10">
                {summary}
              </p>
              <Button variant="text" onClick={onGoToList}>
                로고 목록으로
              </Button>
            </>
          ) : null}
          <Button
            variant="contained"
            disabled={targets.length === 0 || isSaving}
            onClick={handleSave}
          >
            {isSaving ? '저장 중...' : `저장 (${targets.length}개)`}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
