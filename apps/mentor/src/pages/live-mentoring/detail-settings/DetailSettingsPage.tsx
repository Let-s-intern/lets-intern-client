import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useLiveMentoringSettingsQuery,
  useLiveMentoringTemplateQuery,
  useUpdateLiveMentoringTemplateMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
// ⚠️ 임시 — 백엔드 연동 후 이 import 와 아래 isError 분기를 함께 제거할 것.
//    상세 조건은 UnderDevelopmentNotice.tsx 상단 주석 참고.
import UnderDevelopmentNotice from '../ui/UnderDevelopmentNotice';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

const DetailSettingsPage = () => {
  const { data, isError } = useLiveMentoringTemplateQuery();
  // 헤드라인·미리보기에 쓸 닉네임은 오픈 설정(프로필 참조 값)에서 가져온다.
  const { data: settings } = useLiveMentoringSettingsQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringTemplateMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [template, setTemplate] = useState<LiveMentoringTemplate | null>(null);
  /**
   * 기본은 읽기 모드다.
   * 멘토가 이 화면에 오는 이유는 대부분 "지금 뭐라고 나가고 있나" 확인이라,
   * 곧바로 편집 상태로 두면 실수로 값을 바꾸기 쉽다.
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * 검토 대기·승인 상태에서는 상세 페이지도 수정할 수 없다.
   * 이미 노출 중인 판매 페이지가 멘티가 보는 도중에 바뀌면 안 되기 때문이고,
   * 서버도 상품 상태가 `DRAFT`/`REJECTED` 일 때만 편집을 허용한다 —
   * 오픈 설정 화면과 같은 규칙이라 안내도 같은 모양으로 맞춘다.
   */
  const status = settings?.status ?? null;
  const isLocked = status === 'PENDING_REVIEW' || status === 'APPROVED';
  const canEdit = isEditing && !isLocked;

  // 오픈 설정 타입에 따라 서버가 내려준 기본 템플릿을 로드한다.
  useEffect(() => {
    if (data) setTemplate(data);
  }, [data]);

  const header = (
    <header className="flex flex-col gap-2">
      <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
        상세 페이지 설정
      </h1>
      <p className="text-xsmall14 text-neutral-40">
        {canEdit
          ? '좌측에서 고친 내용이 우측 미리보기에 즉시 반영됩니다.'
          : '공개 상세 페이지에 지금 나가고 있는 내용입니다. 고치려면 수정하기를 눌러주세요.'}
      </p>
    </header>
  );

  // ⚠️ 임시 — GET /mentor/live-mentoring/template 이 미완성이라 목 없이는 조회가 실패한다.
  //    백엔드 연동 후 이 분기를 통째로 제거할 것(제거하면 아래 로딩 분기만 남는다).
  if (isError) {
    return (
      <div className="flex flex-col gap-6 pb-24">
        {header}
        <UnderDevelopmentNotice feature="상세 페이지 설정" />
      </div>
    );
  }

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
      onSuccess: () => {
        setIsEditing(false);
        showAlert({ title: '저장되었습니다.', variant: 'success' });
      },
      onError: () =>
        showAlert({ title: '저장에 실패했습니다.', variant: 'error' }),
    });

  /** 편집 취소 — 서버가 준 값으로 되돌린다(로컬 수정분 폐기). */
  const handleCancel = () => {
    if (data) setTemplate(data);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {header}

      {isLocked && (
        <div
          role="status"
          className="border-primary/20 bg-primary-10 flex flex-col gap-3 rounded-xl border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="text-primary flex items-center gap-1.5 text-sm font-semibold">
              <span
                className="bg-primary h-1.5 w-1.5 rounded-full"
                aria-hidden="true"
              />
              {status === 'PENDING_REVIEW' ? '검토 대기' : '승인됨'}
            </span>
            <p className="text-xs text-gray-600">
              {status === 'PENDING_REVIEW'
                ? '관리자 검토 중에는 상세 페이지를 수정할 수 없습니다.'
                : '승인된 뒤에는 상세 페이지를 수정할 수 없습니다.'}
            </p>
          </div>
          <Link
            to="/live-mentoring/open-settings"
            className="border-primary text-primary hover:bg-primary shrink-0 rounded-lg border bg-white px-6 py-2.5 text-center text-sm font-medium transition-colors hover:text-white"
          >
            오픈 설정으로 이동
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* 읽기 모드에서는 입력만 잠근다 — 내용은 그대로 읽을 수 있어야 한다. */}
        <fieldset
          disabled={!canEdit}
          className="m-0 min-w-0 border-0 p-0 disabled:opacity-100"
        >
          <TemplateEditForm template={template} onChange={patch} />
        </fieldset>
        {/*
          미리보기는 편집 폼 바로 옆에 붙어 스크롤을 따라온다.
          상세 페이지 전체를 축소해 담으므로 화면보다 길어질 수 있어,
          자체 스크롤을 줘야 sticky 가 실제로 "따라오는" 것처럼 동작한다.
        */}
        <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start lg:overflow-y-auto">
          <TemplatePreview
            template={template}
            nickname={settings?.nickname ?? '멘토'}
          />
        </div>
      </div>

      {/* 하단 고정 액션 — 읽기 모드: 수정하기 / 오픈하러 가기, 편집 모드: 취소 / 저장하기 */}
      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {isLocked ? null : canEdit ? (
          <>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isPending}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-lg transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending}
              className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? '저장 중...' : '저장하기'}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="border-primary text-primary hover:bg-primary rounded-lg border bg-white px-6 py-2.5 text-sm font-medium shadow-lg transition-colors hover:text-white"
            >
              수정하기
            </button>
            <Link
              to="/live-mentoring/open-settings"
              className="bg-primary hover:bg-primary-hover rounded-lg px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-colors"
            >
              오픈하러 가기
            </Link>
          </>
        )}
      </div>

      <MentorAlertModal {...alertProps} />
    </div>
  );
};

export default DetailSettingsPage;
