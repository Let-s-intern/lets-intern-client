import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useLiveMentoringSettingsQuery,
  useLiveMentoringTemplateQuery,
  useUpdateLiveMentoringTemplateMutation,
} from '@/api/live-mentoring/liveMentoring';
import {
  type LiveMentoringDetailPage,
  type LiveMentoringTemplate,
  toTemplateUpdatePayload,
} from '@/api/live-mentoring/liveMentoringSchema';
import { useUserQuery } from '@/api/user/user';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { toYoutubeEmbedUrl } from '../constants';
import OpenSettingsSection from '../open-settings/OpenSettingsSection';
import { useLiveMentoringOpenAction } from '../open-settings/useLiveMentoringOpenAction';
import SettingsActionBar from '../ui/SettingsActionBar';
import {
  DETAIL_TABS,
  OPEN_TAB_ID,
  type DetailTabId,
  type SettingsTabId,
  isDetailTabComplete,
} from './tabs';
import DetailLoadFailedNotice from './ui/DetailLoadFailedNotice';
import SettingsTabs from './ui/SettingsTabs';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

/**
 * 1대1 라이브 멘토링 설정 — 오픈 설정과 상세 페이지 설정을 한 화면에 합쳤다(LC-3264).
 *
 * 첫 스텝이 오픈 설정이고 나머지가 상세 페이지 섹션이다. 두 화면은 저장 대상도
 * 저장 버튼도 다르므로 본문과 하단 바를 통째로 갈아끼운다 — 스텝마다 자기 하단
 * 바를 그리고, 동시에 두 개가 뜨지 않는다.
 */
const LiveMentoringSettingsPage = () => {
  const navigate = useNavigate();
  const { data, isError, error } = useLiveMentoringTemplateQuery();
  // 헤드라인·미리보기에 쓸 닉네임은 오픈 설정(프로필 참조 값)에서 가져온다.
  const { data: settings } = useLiveMentoringSettingsQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`). 미리보기가 그 주소를 띄운다.
  const { data: user } = useUserQuery();
  const { mutate: save, isPending } = useUpdateLiveMentoringTemplateMutation();
  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  const [template, setTemplate] = useState<LiveMentoringDetailPage | null>(
    null,
  );
  // 변경사항(dirty) 판정을 위한 로드 원본 — 저장 버튼 활성화·이탈 경고에 쓴다.
  const [originalTemplate, setOriginalTemplate] =
    useState<LiveMentoringDetailPage | null>(null);
  /**
   * 열려 있는 탭. URL 이 아니라 로컬 상태로 둔다 — 상세 페이지 설정은 한 화면에서
   * 끝나는 편집이고, 탭마다 주소를 만들면 저장하지 않은 변경을 들고 뒤로가기를
   * 하는 경로가 새로 생긴다(이탈 경고와 충돌).
   */
  const [activeTab, setActiveTab] = useState<SettingsTabId>(OPEN_TAB_ID);

  /*
   * 상세 스텝의 하단 바에 들어갈 오픈 버튼(LC-3273).
   *
   * 오픈 요청에 담을 값은 **서버가 내려준 설정**이다 — 오픈 설정 본문은 이 스텝에서
   * 마운트돼 있지 않아 편집 중인 값이라는 게 없다. 오픈 설정 스텝에서는 같은 훅을
   * 그쪽 폼으로 부른다. 두 스텝이 동시에 마운트되지 않으므로 훅도 화면에 하나만 산다.
   */
  const openAction = useLiveMentoringOpenAction({
    input: settings
      ? {
          title: settings.title ?? '',
          categories: settings.categories,
          durations: settings.durations,
          hasProduct: settings.liveMentoringId !== null,
        }
      : null,
    alert: { showAlert, showConfirm },
  });

  // 이탈 경고(navigation guard) 상태 — 프로필 화면(ProfilePage.tsx)과 동일 패턴.
  const [navGuard, setNavGuard] = useState<{
    isOpen: boolean;
    pendingHref: string | null;
    pendingAction: 'push' | 'back' | null;
  }>({ isOpen: false, pendingHref: null, pendingAction: null });
  const isNavigatingRef = useRef(false);

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

  const header = (
    <header className="flex flex-col gap-2">
      <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
        1:1 LIVE 멘토링 설정
      </h1>
      <p className="text-xsmall14 text-neutral-40">
        오픈 설정에서 타이틀·타입·진행시간과 일정을 정하고, 이어지는 스텝에서
        멘티에게 보여줄 상세 페이지를 작성하세요.
      </p>
    </header>
  );

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
    if (!template) return;
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

    /*
     * 유형 소개 카드도 같다. `typeName`·`title`·`description` 이 모두 `@NotBlank` 라
     * "소개 카드 추가 +"로 만들어 놓고 안 채운 카드가 하나라도 있으면 400 이다.
     *
     * 기본 문구로 채우지 않는다 — 멘토가 쓰지 않은 유형이 상세 페이지에 실리면
     * 멘티가 없는 도움을 기대하게 된다. 빈 카드는 지울 의사로 보고 걸러낸다.
     */
    const cleanedTypeItems = payload.mentoringTypes.items
      .map((item) => ({
        ...item,
        typeName: item.typeName.trim(),
        title: item.title.trim(),
        description: item.description.trim(),
      }))
      .filter((item) => item.typeName && item.title && item.description);

    /*
     * 결과 사례도 같다. `beforeCaption`·`afterCaption` 이 `@NotBlank` 라
     * "변화 사례 추가 +"로 만들어 놓고 안 채운 카드가 있으면 400 이다.
     * 설명이 둘 다 빈 카드는 지울 의사로 본다 — 이미지만 올리고 설명을 비우는 경우는
     * 서버가 받지 않으므로 여기서 남겨 봐야 저장이 실패한다.
     */
    const cleanedResultCases = payload.results.cases
      .map((item) => ({
        ...item,
        beforeCaption: item.beforeCaption.trim(),
        afterCaption: item.afterCaption.trim(),
      }))
      .filter((item) => item.beforeCaption && item.afterCaption);

    payload = {
      ...payload,
      hero: { bullets: cleanedBullets },
      mentoringTypes: { ...payload.mentoringTypes, items: cleanedTypeItems },
      results: { ...payload.results, cases: cleanedResultCases },
    };
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

  return (
    <div className="flex flex-col gap-6 pb-24">
      {header}

      {/*
        스텝 줄은 grid **바깥**이다. 시안에서 탭은 편집 카드와 미리보기를 가로지르는
        전체 폭을 쓴다 — 편집 카드 폭에 가두면 좁은 칸에서 밀린다.
      */}
      <SettingsTabs
        activeTab={activeTab}
        completedTabs={completedTabs}
        onChange={setActiveTab}
      />

      {activeTab === OPEN_TAB_ID ? (
        <OpenSettingsSection />
      ) : isError ? (
        // 상세 스텝 본문만 대체한다. 오픈 설정 스텝은 이 실패와 무관하게 열려야
        // 하므로 페이지 전체를 조기 반환하지 않는다.
        <DetailLoadFailedNotice
          error={error}
          onGoToOpenStep={() => setActiveTab(OPEN_TAB_ID)}
        />
      ) : !template ? (
        <div className="text-xsmall14 text-neutral-40 px-1 py-10">
          템플릿을 불러오는 중...
        </div>
      ) : (
        <>
          {/*
        시안 비율은 편집 카드 : 미리보기 ≈ 1.93 : 1 이다. 고정 폭을 주면 넓은 화면에서
        미리보기만 상대적으로 좁아져 모바일 뷰가 제 크기로 안 보인다.
      */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_412px]">
            <div className="flex min-w-0 flex-col gap-4">
              <fieldset className="m-0 min-w-0 border-0 p-0 disabled:opacity-100">
                <TemplateEditForm
                  template={template}
                  activeTab={activeTab}
                  onChange={patch}
                />
              </fieldset>
            </div>
            {/*
          미리보기는 편집 폼 바로 옆에 붙어 스크롤을 따라온다.

          높이를 화면에 **꼭 맞춘다**. 넘치면 미리보기를 보려고 페이지를 스크롤해야 하고,
          그러면 옆에 두고 보라고 만든 것이 제 역할을 못 한다. 빼는 값은 위 여백(1.5rem)과
          하단 저장 바가 차지하는 높이(약 5.5rem)다 — 그 바는 fixed 라 여기 높이를
          비워 두지 않으면 프레임 아래쪽을 덮는다.
        */}
            <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-7rem)] lg:self-start lg:overflow-hidden">
              <TemplatePreview
                template={template}
                activeTab={activeTab}
                mentorId={user?.userId ?? null}
              />
            </div>
          </div>

          {/*
        하단 고정 바 — 오픈 설정 스텝과 같은 것을 쓴다(LC-3273).

        모달이 떠 있는 동안에는 감춘다. 같은 자리에 겹쳐 보인다.
      */}
          {openAction.isModalOpen ? null : (
            <SettingsActionBar
              status={
                isDirty
                  ? '저장하지 않은 변경사항이 있어요.'
                  : '저장된 상태예요.'
              }
              isDirty={isDirty}
              canSave={isDirty}
              isSaving={isPending}
              onSave={handleSave}
              openAction={openAction}
            />
          )}
          {openAction.modals}
        </>
      )}

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

export default LiveMentoringSettingsPage;
