import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useLiveMentoringTemplateQuery,
  useStartEditLiveMentoringMutation,
  useUpdateLiveMentoringTemplateMutation,
} from '@/api/live-mentoring/liveMentoring';
import {
  type LiveMentoringTemplate,
  toTemplateUpdatePayload,
} from '@/api/live-mentoring/liveMentoringSchema';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { useUserQuery } from '@/api/user/user';
import {
  START_EDIT_SUCCESS_DETAIL,
  publicDetailUrl,
  toYoutubeEmbedUrl,
} from '../constants';
// ⚠️ 임시 — 백엔드 연동 후 이 import 와 아래 isError 분기를 함께 제거할 것.
//    상세 조건은 UnderDevelopmentNotice.tsx 상단 주석 참고.
import UnderDevelopmentNotice from '../ui/UnderDevelopmentNotice';
import { DETAIL_TABS, type DetailTabId, isDetailTabComplete } from './tabs';
import DetailTabs from './ui/DetailTabs';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

const DetailSettingsPage = () => {
  const navigate = useNavigate();
  const { data, isError } = useLiveMentoringTemplateQuery();
  // 헤드라인·미리보기에 쓸 닉네임은 오픈 설정(프로필 참조 값)에서 가져온다.
  const { data: settings } = useLiveMentoringSettingsQuery();
  // "지금 열려 있는지"는 상품 상태가 아니라 활성 개설의 존재로 판단한다.
  const { data: openings } = useLiveMentoringOpenStatusQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`).
  const { data: user } = useUserQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringTemplateMutation();
  const { mutate: startEdit, isPending: isStartingEdit } =
    useStartEditLiveMentoringMutation();
  const { alertProps, showAlert } = useMentorAlert();

  const [template, setTemplate] = useState<LiveMentoringTemplate | null>(null);
  // 변경사항(dirty) 판정을 위한 로드 원본 — 저장 버튼 활성화·이탈 경고에 쓴다.
  const [originalTemplate, setOriginalTemplate] =
    useState<LiveMentoringTemplate | null>(null);
  /**
   * "수정" 성공 직후, 설정 쿼리가 아직 리페치 전이라 `status` 가 잠깐
   * 낡은 `APPROVED` 로 남는다. 그 사이에도 곧바로 편집으로 들어가야 하므로
   * `isLocked` 를 잠시 무시하는 용도로만 쓴다 — 그 밖의 경우 편집 가능 여부는
   * 오직 `!isLocked` 로만 정해진다(별도의 읽기/쓰기 모드 토글은 없다).
   */
  const [isEditing, setIsEditing] = useState(false);

  /**
   * 열려 있는 탭. URL 이 아니라 로컬 상태로 둔다 — 상세 페이지 설정은 한 화면에서
   * 끝나는 편집이고, 탭마다 주소를 만들면 저장하지 않은 변경을 들고 뒤로가기를
   * 하는 경로가 새로 생긴다(이탈 경고와 충돌).
   */
  const [activeTab, setActiveTab] = useState<DetailTabId>('hero');

  // 이탈 경고(navigation guard) 상태 — 프로필 화면(ProfilePage.tsx)과 동일 패턴.
  const [navGuard, setNavGuard] = useState<{
    isOpen: boolean;
    pendingHref: string | null;
    pendingAction: 'push' | 'back' | null;
  }>({ isOpen: false, pendingHref: null, pendingAction: null });
  const isNavigatingRef = useRef(false);

  /**
   * 승인 상태에서는 상세 페이지를 바로 수정할 수 없다.
   * 이미 노출 중인 판매 페이지가 멘티가 보는 도중에 바뀌면 안 되기 때문이고,
   * 서버도 상품 상태가 `DRAFT` 일 때만 편집을 허용한다. (자가승인 전환으로
   * `submit()` 이 검토 단계 없이 곧바로 `APPROVED` 로 전이하므로 그 사이 상태는 없다.)
   *
   * 다만 "수정할 수 없다"로 끝내면 멘토가 막힌다. 오픈이 닫혀 있으면 이 화면에서
   * 바로 검토를 다시 걸어(`start-edit`) 편집으로 넘어갈 수 있게 한다.
   */
  const status = settings?.status ?? null;
  const isLocked = status === 'APPROVED';
  const canEdit = !isLocked || isEditing;
  const currentOpening = openings?.find((opening) => opening.status === 'OPEN');
  /** 승인 상태에서 오픈이 닫혀 있으면 여기서 바로 상세 수정을 시작할 수 있다. */
  const canStartEdit = status === 'APPROVED' && !currentOpening;

  /**
   * 완료 표시가 붙는 탭. 탭을 옮길 때마다가 아니라 **템플릿이 바뀔 때만** 다시 센다 —
   * 판정이 여섯 섹션을 모두 훑기 때문에 매 렌더 돌릴 이유가 없다.
   */
  const completedTabs = useMemo(
    () =>
      new Set(
        template
          ? DETAIL_TABS.filter((tab) =>
              isDetailTabComplete(tab.id, template),
            ).map((tab) => tab.id)
          : [],
      ),
    [template],
  );

  // 오픈 설정 타입에 따라 서버가 내려준 기본 템플릿을 로드한다.
  useEffect(() => {
    if (data) {
      setTemplate(data);
      setOriginalTemplate(data);
    }
  }, [data]);

  // 저장 버튼 활성화·이탈 경고 판정 기준. 구조가 깊어 얕은 비교로는 못 잡아 직렬화로 비교한다.
  const isDirty =
    canEdit &&
    template !== null &&
    originalTemplate !== null &&
    JSON.stringify(template) !== JSON.stringify(originalTemplate);

  // 이탈 경고 — 저장하지 않은 변경이 있을 때만 걸어둔다. 프로필 화면과 동일 패턴
  // (beforeunload + 뒤로가기(popstate) + 앱 내부 링크 클릭 가로채기).
  useEffect(() => {
    if (!isDirty) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = () => {
      if (!isNavigatingRef.current) {
        window.history.pushState(null, '', window.location.href);
        setNavGuard({ isOpen: true, pendingHref: null, pendingAction: 'back' });
      }
    };

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (
        anchor?.href &&
        anchor.href !== window.location.href &&
        anchor.href.startsWith(window.location.origin)
      ) {
        e.preventDefault();
        e.stopPropagation();
        setNavGuard({
          isOpen: true,
          pendingHref: anchor.href,
          pendingAction: 'push',
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleClick, true);
    window.history.pushState(null, '', window.location.href);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isDirty]);

  const handleNavConfirm = () => {
    isNavigatingRef.current = true;
    const { pendingHref, pendingAction } = navGuard;
    setNavGuard({ isOpen: false, pendingHref: null, pendingAction: null });
    if (pendingAction === 'back') {
      navigate(-1);
    } else if (pendingHref) {
      navigate(pendingHref);
    }
  };

  const handleNavCancel = () => {
    setNavGuard({ isOpen: false, pendingHref: null, pendingAction: null });
  };

  /** 편집 폼에서 포커스가 옮겨간 섹션으로 미리보기를 따라 스크롤한다. */
  const handleSectionFocus = (section: string) => {
    document
      .getElementById(`preview-section-${section}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  const header = (
    <header className="flex flex-col gap-2">
      <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
        상세 페이지 설정
      </h1>
      <p className="text-xsmall14 text-neutral-40">
        {canEdit
          ? '좌측에서 고친 내용이 우측 미리보기에 즉시 반영됩니다.'
          : '공개 상세 페이지에 실리는 내용입니다.'}
      </p>
      {/* 미리보기는 축소판이라 실제 화면과 다를 수 있다 — 진짜 페이지로 갈 길을 준다. */}
      {user?.userId != null && (
        <a
          href={publicDetailUrl(user.userId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xsmall14 w-fit font-medium underline"
        >
          실제 공개 페이지로 확인하기
        </a>
      )}
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

  /**
   * 저장.
   *
   * 영상 URL 은 서버가 `https://www.youtube.com/embed/{id}` 형태만 받는다. 공유 링크를
   * 그대로 두면 저장 **전체**가 400 으로 실패하는데, 화면에는 어느 필드 때문인지
   * 드러나지 않아 원인을 찾을 수 없다. 보내기 전에 정규화하고, 못 고치면 여기서 막는다.
   */
  const handleSave = () => {
    let payload = template;

    if (template.video.videoUrl) {
      const embedUrl = toYoutubeEmbedUrl(template.video.videoUrl);
      if (!embedUrl) {
        showAlert({
          title: '영상 URL 을 확인해주세요.',
          description:
            'YouTube 주소만 넣을 수 있어요. 영상 페이지의 공유 링크를 붙여넣으면 자동으로 변환됩니다.',
          variant: 'error',
        });
        return;
      }
      payload = {
        ...template,
        video: { ...template.video, videoUrl: embedUrl },
      };
    }

    /*
     * 히어로 소개 불릿 — "+추가"로 빈 칸을 만들어 놓고 안 채운 채 저장하면 서버가
     * `hero.bullets[i]` 공백을 막아(`@NotBlank`) 저장 전체가 400으로 실패한다.
     * 빈 배열 자체는 서버가 허용하므로, 안 채운 칸은 실릴 내용이 없는 것과 같게
     * 보고 조용히 걸러내고 보낸다(같은 폼의 태그 필드와 동일한 처리).
     */
    const cleanedBullets = payload.hero.bullets
      .map((bullet) => bullet.trim())
      .filter(Boolean);
    payload = { ...payload, hero: { bullets: cleanedBullets } };
    setTemplate(payload);

    // 서버 요청 DTO에 없는 값(intro·categories)은 여기서 떨어진다.
    save(toTemplateUpdatePayload(payload), {
      onSuccess: () => {
        // 이후 refetch 로도 갱신되지만, 그 전까지 dirty 판정이 틀리지 않도록
        // 방금 저장한 값을 곧바로 새 기준선으로 삼는다.
        setOriginalTemplate(payload);
        showAlert({ title: '저장되었습니다.', variant: 'success' });
      },
      // 서버가 왜 거부했는지 감추면 멘토도 개발자도 원인을 알 수 없다.
      onError: (error) => {
        const apiError = error as { code?: string; message?: string } | null;
        showAlert({
          title: '저장에 실패했습니다.',
          description: apiError?.message
            ? apiError.code
              ? `${apiError.message} (${apiError.code})`
              : apiError.message
            : undefined,
          variant: 'error',
        });
      },
    });
  };

  /**
   * 상세 수정 시작 — 서버가 상품을 편집 가능 상태로 되돌린다.
   * 성공하면 곧바로 편집 모드로 넣는다. 이 버튼을 누른 의도가 "고치겠다"이므로
   * 한 번 더 "수정하기"를 누르게 하지 않는다.
   *
   * 확인 모달 없이 바로 실행한다 — 저장 버튼이 실제로 뭔가 바꾸기 전엔 비활성이고,
   * 나가려 하면 이탈 경고가 뜨므로(아래) "누르면 무슨 일이 벌어지는지" 미리 설명하는
   * 별도 단계 없이도 실수로 뭔가 잃을 위험이 없다.
   */
  const handleStartEdit = () => {
    if (isStartingEdit) return;
    startEdit(undefined, {
      onSuccess: () => {
        setIsEditing(true);
        showAlert({ ...START_EDIT_SUCCESS_DETAIL, variant: 'success' });
      },
      onError: () =>
        showAlert({
          title: '상세 수정 준비에 실패했습니다.',
          variant: 'error',
        }),
    });
  };

  /** 편집 취소 — 저장된 기준선으로 되돌린다(로컬 수정분 폐기). */
  const handleCancel = () => {
    if (originalTemplate) setTemplate(originalTemplate);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {header}

      {/*
        상태 배너 — 오픈 종료됨(승인 + 활성 개설 없음)일 때만 상단에 둔다.
        오픈 중일 때는 하단 플로팅 영역으로 옮긴다(아래) — "오픈 설정으로 이동"이
        이 화면에서 할 수 있는 주요 행동이라, 다른 화면 액션과 같은 자리에 둔다.
      */}
      {status === 'APPROVED' && !currentOpening && (
        <div
          role="status"
          className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-gray-700">
              오픈 종료됨
            </span>
            <p className="text-xs text-gray-600">
              수정을 시작하면 오픈이 잠시 멈춰요. 아래 "수정"을 누르면 바로
              시작할 수 있습니다.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* 읽기 모드에서는 입력만 잠근다 — 내용은 그대로 읽을 수 있어야 한다. */}
        {/*
          탭 네비게이션은 잠금(fieldset) **바깥**이다. 오픈 중이라 편집이 막혀도
          탭 이동은 계속 동작해야 한다.
        */}
        <div className="flex min-w-0 flex-col gap-4">
          <DetailTabs
            activeTab={activeTab}
            completedTabs={completedTabs}
            onChange={setActiveTab}
          />
          <fieldset
            disabled={!canEdit}
            className="m-0 min-w-0 border-0 p-0 disabled:opacity-100"
          >
            <TemplateEditForm
              template={template}
              activeTab={activeTab}
              onChange={patch}
              onSectionFocus={handleSectionFocus}
            />
          </fieldset>
        </div>
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

      {/*
        하단 고정 액션.
        잠긴 상태라도 할 수 있는 일이 있으면 버튼을 준다 — 오픈이 닫혀 있으면
        여기서 바로 상세 수정을 시작할 수 있다. 버튼 없이 글로만 "오픈 설정으로 가라"고
        하면 멘토가 화면을 옮겨 다니며 길을 찾아야 한다.

        오픈 중(잠김 + canStartEdit 불가)일 때는 상태 설명 + "오픈 설정으로 이동"을
        여기(하단 플로팅)에 둔다 — 다른 화면 액션들과 같은 자리라 더 직관적이다.
      */}
      {isLocked && !canStartEdit && (
        // 사이드바(296px)와 우측 미리보기 컬럼(380px + gap-6)을 뺀 콘텐츠 영역
        // 기준으로 폭을 맞춘다 — 그냥 right-0 이면 미리보기 위로 넘어가 버린다.
        <div className="fixed bottom-6 left-0 right-0 z-50 px-4 md:px-8 lg:left-[296px] lg:pr-[436px]">
          <div
            role="status"
            className="shadow-05 flex items-center justify-between gap-3 rounded-xl bg-gray-900/80 px-4 py-3"
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-white"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">오픈 중</p>
                <p className="truncate text-xs text-gray-300">
                  멘티에게 노출 중이라 수정할 수 없어요.
                </p>
              </div>
            </div>
            <Link
              to="/live-mentoring/open-settings"
              className="bg-primary hover:bg-primary-hover shrink-0 whitespace-nowrap rounded-full px-5 py-2.5 text-center text-sm font-semibold text-white transition-colors"
            >
              오픈 설정으로
            </Link>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {isLocked ? (
          canStartEdit ? (
            <button
              type="button"
              onClick={handleStartEdit}
              disabled={isStartingEdit}
              className="bg-primary hover:bg-primary-hover rounded-lg px-8 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isStartingEdit ? '처리 중...' : '수정'}
            </button>
          ) : null
        ) : (
          <>
            {isDirty && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-lg transition-colors disabled:opacity-50"
              >
                수정 취소
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || !isDirty}
              className="bg-primary hover:bg-primary-hover rounded-lg px-10 py-2.5 text-sm font-medium text-white shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? '저장 중...' : '저장하기'}
            </button>
            <Link
              to="/live-mentoring/open-settings"
              className="border-primary text-primary hover:bg-primary rounded-lg border bg-white px-6 py-2.5 text-sm font-medium shadow-lg transition-colors hover:text-white"
            >
              오픈하러 가기
            </Link>
          </>
        )}
      </div>

      <MentorAlertModal {...alertProps} />

      {/* 이탈 경고 — 위 alertProps(저장 성공·실패 등)와 별개 모달이다. */}
      <MentorAlertModal
        isOpen={navGuard.isOpen}
        onClose={handleNavCancel}
        onConfirm={handleNavConfirm}
        title="변경사항이 저장되지 않았습니다"
        description="저장하지 않고 페이지를 나가시겠습니까?"
        confirmText="나가기"
        cancelText="취소"
        variant="confirm"
      />
    </div>
  );
};

export default DetailSettingsPage;
