import { Button } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  useAdminLiveMentoringDetailPageQuery,
  useUpdateAdminLiveMentoringDetailPageMutation,
} from '@/api/live-mentoring/liveMentoringDetailPage';
import type { AdminLiveMentoringDetailPageUpdate } from '@/api/live-mentoring/liveMentoringDetailPageSchema';
import { twMerge } from '@/lib/twMerge';

import { publicDetailUrl } from '../constants';
import FreeContentField from './ui/FreeContentField';
import HeroField from './ui/HeroField';
import MentoringTypesField from './ui/MentoringTypesField';
import ResultsField from './ui/ResultsField';
import ReviewsVisibleField from './ui/ReviewsVisibleField';
import StrategyField from './ui/StrategyField';
import VideoField from './ui/VideoField';
import {
  findDetailPageBlock,
  toDetailPageForm,
  toDetailPageUpdatePayload,
} from './utils/toDetailPageUpdatePayload';

type TabId =
  | 'hero'
  | 'mentoringTypes'
  | 'strategy'
  | 'video'
  | 'results'
  | 'reviews'
  | 'freeContent';

const TABS: { id: TabId; label: string }[] = [
  { id: 'hero', label: '핵심 소개' },
  { id: 'mentoringTypes', label: '멘토링 유형' },
  { id: 'strategy', label: '취업 성공 전략' },
  { id: 'video', label: '소개 영상' },
  { id: 'results', label: '결과 사례' },
  { id: 'reviews', label: '후기' },
  { id: 'freeContent', label: '자유 입력란' },
];

const CONFLICT_MESSAGE =
  '다른 곳에서 먼저 수정되었습니다. 새로고침 후 다시 저장하세요';

type Message = { type: 'error' | 'success'; text: string } | null;

interface Props {
  mentorId: number;
}

/**
 * 어드민 1:1 상세페이지 편집. 멘토 앱 「상세 페이지 설정」 과 같은 내용을 어드민이 고친다.
 * 미리보기는 없다. 저장한 뒤 「상세페이지 보기」 로 공개 페이지를 연다.
 */
export default function AdminLiveMentoringDetailPageEditor({
  mentorId,
}: Props) {
  const { data, isLoading, isError } =
    useAdminLiveMentoringDetailPageQuery(mentorId);
  const { mutate: save, isPending: isSaving } =
    useUpdateAdminLiveMentoringDetailPageMutation(mentorId);

  const [form, setForm] = useState<AdminLiveMentoringDetailPageUpdate | null>(
    null,
  );
  const [original, setOriginal] =
    useState<AdminLiveMentoringDetailPageUpdate | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('hero');
  const [message, setMessage] = useState<Message>(null);
  // 자유 입력란 에디터는 비제어라, 폼을 통째로 바꿀 때(불러오기·취소) 이 값을 올려 다시 마운트한다
  const [formVersion, setFormVersion] = useState(0);

  // 응답에서 편집 영역만 떼어 폼과 기준선으로 둔다. 저장 뒤 다시 불러오면 서버 값으로 맞춘다
  useEffect(() => {
    if (!data) return;
    const editable = toDetailPageForm(data);
    setForm(editable);
    setOriginal(editable);
    setFormVersion((prev) => prev + 1);
  }, [data]);

  const isDirty =
    form !== null && JSON.stringify(form) !== JSON.stringify(original);

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  if (isLoading) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-16">불러오는 중...</p>
    );
  }

  if (isError || !form) {
    return (
      <p className="text-xsmall14 text-neutral-40 py-16">
        상세페이지를 불러오지 못했습니다. 멘토가 맞는지 확인해 주세요.
      </p>
    );
  }

  const patch = (partial: Partial<AdminLiveMentoringDetailPageUpdate>) =>
    setForm((prev) => (prev ? { ...prev, ...partial } : prev));

  const handleSave = () => {
    const blocked = findDetailPageBlock(form);
    if (blocked) {
      setMessage({ type: 'error', text: blocked });
      return;
    }
    save(toDetailPageUpdatePayload(form), {
      onSuccess: () => {
        setOriginal(form);
        setMessage({ type: 'success', text: '저장했습니다.' });
      },
      onError: (error) => {
        const { status, message: serverMessage } = error as {
          status?: number;
          message?: string;
        };
        setMessage({
          type: 'error',
          text:
            status === 409
              ? CONFLICT_MESSAGE
              : (serverMessage ?? '저장하지 못했습니다.'),
        });
      },
    });
  };

  const handleCancel = () => {
    setForm(original);
    setMessage(null);
    setFormVersion((prev) => prev + 1);
  };

  const nickname = data?.intro?.nickname || `멘토 #${mentorId}`;

  return (
    <div className="flex flex-col gap-4 pb-24">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-medium22 font-semibold">
          {nickname} 멘토 상세페이지 수정
        </h2>
        <Button
          variant="outlined"
          href={publicDetailUrl(mentorId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          상세페이지 보기
        </Button>
      </div>

      <nav className="border-neutral-80 flex gap-1 border-b">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={twMerge(
              'text-xsmall14 -mb-px border-b-2 px-4 py-2',
              activeTab === tab.id
                ? 'border-neutral-0 text-neutral-0 font-semibold'
                : 'text-neutral-40 border-transparent',
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="border-neutral-80 max-w-3xl rounded-lg border p-6">
        {activeTab === 'hero' ? (
          <HeroField value={form.hero} onChange={(hero) => patch({ hero })} />
        ) : activeTab === 'mentoringTypes' ? (
          <MentoringTypesField
            value={form.mentoringTypes}
            onChange={(mentoringTypes) => patch({ mentoringTypes })}
          />
        ) : activeTab === 'strategy' ? (
          <StrategyField
            value={form.strategy}
            onChange={(strategy) => patch({ strategy })}
          />
        ) : activeTab === 'video' ? (
          <VideoField
            value={form.video}
            onChange={(video) => patch({ video })}
          />
        ) : activeTab === 'results' ? (
          <ResultsField
            value={form.results}
            onChange={(results) => patch({ results })}
          />
        ) : activeTab === 'reviews' ? (
          <ReviewsVisibleField
            value={form.reviews}
            onChange={(reviews) => patch({ reviews })}
          />
        ) : (
          <FreeContentField
            key={formVersion}
            value={form.freeContent}
            onChange={(freeContent) => patch({ freeContent })}
          />
        )}
      </div>

      <div className="border-neutral-80 fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between gap-4 border-t bg-white px-8 py-3">
        <p
          role={message?.type === 'error' ? 'alert' : 'status'}
          className={twMerge(
            'text-xsmall14',
            message?.type === 'error' ? 'text-system-error' : 'text-neutral-40',
          )}
        >
          {message?.text ??
            (isDirty ? '저장하지 않은 변경 사항이 있습니다' : '')}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="inherit"
            disabled={!isDirty || isSaving}
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            variant="contained"
            disabled={!isDirty || isSaving}
            onClick={handleSave}
          >
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </div>
  );
}
