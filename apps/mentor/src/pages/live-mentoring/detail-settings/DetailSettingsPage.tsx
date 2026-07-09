import { useEffect, useState } from 'react';

import {
  useLiveMentoringTemplateQuery,
  useUpdateLiveMentoringTemplateMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

const DetailSettingsPage = () => {
  const { data } = useLiveMentoringTemplateQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringTemplateMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [template, setTemplate] = useState<LiveMentoringTemplate | null>(null);

  // 오픈 설정 타입에 따라 서버가 내려준 기본 템플릿을 로드한다.
  useEffect(() => {
    if (data) setTemplate(data);
  }, [data]);

  if (!template) {
    return (
      <div className="text-xsmall14 text-neutral-40 px-1 py-10">
        템플릿을 불러오는 중...
      </div>
    );
  }

  const patch = (partial: Partial<LiveMentoringTemplate>) =>
    setTemplate((prev) => (prev ? { ...prev, ...partial } : prev));

  const handleSave = () =>
    save(template, {
      onSuccess: () =>
        showAlert({ title: '저장되었습니다.', variant: 'success' }),
      onError: () =>
        showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
    });

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          상세 페이지 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          공개 상세 페이지에 노출될 콘텐츠를 편집하세요. 좌측 편집 내용이 우측
          미리보기에 즉시 반영됩니다.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <TemplateEditForm template={template} onChange={patch} />
        <div className="lg:sticky lg:top-6 lg:self-start">
          <TemplatePreview template={template} />
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default DetailSettingsPage;
