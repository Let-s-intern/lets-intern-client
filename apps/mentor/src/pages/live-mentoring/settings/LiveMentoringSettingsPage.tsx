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
import { publicDetailUrl, toYoutubeEmbedUrl } from '../constants';
import OpenSettingsSection from '../open-settings/OpenSettingsSection';
import { useLiveMentoringOpenAction } from '../open-settings/useLiveMentoringOpenAction';
import DetailPageHeaderActions from '../ui/DetailPageHeaderActions';
import SettingsActionBar from '../ui/SettingsActionBar';
import {
  useAutosave,
  type AutosaveResult,
  type AutosaveStatus,
} from '../useAutosave';
import {
  SETTINGS_TABS,
  DETAIL_TABS,
  OPEN_TAB_ID,
  type SettingsTabId,
  isDetailTabComplete,
} from './tabs';
import { describeAutosaveBlock } from './autosaveGate';
import { describeSaveError } from './saveError';
import DetailLoadFailedNotice from './ui/DetailLoadFailedNotice';
import SettingsTabs from './ui/SettingsTabs';
import TemplateEditForm from './ui/TemplateEditForm';
import TemplatePreview from './ui/TemplatePreview';

/**
 * 1대1 라이브 멘토링 설정 — 오픈 설정과 상세 페이지 설정을 한 화면에 합쳤다(LC-3264).
 *
 * 첫 스텝이 오픈 설정이고 나머지가 상세 페이지 섹션이다. 본문만 스텝마다 갈아끼우고,
 * 머리(공개 토글·바로가기)와 하단 바(스텝 이동)는 이 화면이 하나씩만 그린다.
 * 저장 버튼은 없다 — 입력이 멎으면 알아서 나간다(LC-3282).
 */
const LiveMentoringSettingsPage = () => {
  const navigate = useNavigate();
  const { data, isError, error } = useLiveMentoringTemplateQuery();
  // 헤드라인·미리보기에 쓸 닉네임은 오픈 설정(프로필 참조 값)에서 가져온다.
  const { data: settings } = useLiveMentoringSettingsQuery();
  // 공개 상세는 mentorId 로 열린다(웹 라우트 `/live-mentoring/[mentorId]`). 미리보기가 그 주소를 띄운다.
  const { data: user } = useUserQuery();
  const { mutateAsync: save } = useUpdateLiveMentoringTemplateMutation();
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
   * 오픈 설정 스텝의 저장 상태. 하단 바는 스텝을 아는 이 화면이 하나만 그리는데,
   * 그 스텝의 저장 대상(제목·타입·진행시간)은 본문이 들고 있어 위로 올려 받는다.
   */
  const [openStepStatus, setOpenStepStatus] = useState<AutosaveStatus>({
    kind: 'saved',
  });

  /*
   * 머리의 공개/비공개 토글이 쓰는 오픈 액션(LC-3283). 화면에 **하나만** 산다 —
   * 예전에는 하단 바가 스텝마다 자기 것을 그려서 오픈 설정 본문에도 같은 훅이 있었다.
   *
   * 오픈 요청에 담을 값은 **서버가 내려준 설정**이다. 제목·타입·진행시간은 오픈 설정
   * 스텝에서 저장되고 나면 이 쿼리로 돌아오므로, 편집 중인 폼을 들여다볼 이유가 없다.
   */
  /*
    오픈 액션 훅은 조기 반환보다 앞에서 불러야 해서, 아래에서 정의되는 값을 그대로 쓸 수
    없다. ref 로 건넨다 — 실제로 읽는 시점은 멘토가 「오픈하기」를 누른 뒤라 항상 최신이다.
   */
  const isDirtyRef = useRef(false);
  const blockedReasonRef = useRef<string | null>(null);
  const saveTemplateRef = useRef<() => Promise<AutosaveResult>>(() =>
    Promise.resolve({ ok: true }),
  );

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
    /*
      공개는 "지금 이 상세를 내보낸다" 는 행동이다. 실시간 저장이 아직 못 보낸 내용이
      남아 있으면 멘티가 옛 페이지를 보게 되므로, 먼저 보내고 연다.

      보낼 수 없는 상태(빈 칸이 남았다)면 열지 않고 무엇을 채워야 하는지 알린다 —
      하단 바에 이미 적혀 있지만, 공개는 멘토가 방금 누른 행동이라 그 자리에서 답한다.
     */
    onBeforeOpen: async () => {
      if (!isDirtyRef.current) return true;
      if (blockedReasonRef.current) {
        showAlert({
          title: '아직 저장되지 않은 내용이 있어요.',
          description: `${blockedReasonRef.current}.`,
          variant: 'error',
        });
        return false;
      }
      const result = await saveTemplateRef.current();
      if (!result.ok) {
        showAlert({
          title: '저장에 실패해 공개하지 않았어요.',
          description: result.reason,
          variant: 'error',
        });
      }
      return result.ok;
    },
  });

  // 이탈 경고(navigation guard) 상태 — 프로필 화면(ProfilePage.tsx)과 동일 패턴.
  const [navGuard, setNavGuard] = useState<{
    isOpen: boolean;
    pendingHref: string | null;
    pendingAction: 'push' | 'back' | null;
  }>({ isOpen: false, pendingHref: null, pendingAction: null });
  const isNavigatingRef = useRef(false);
  const hasPushedGuardEntryRef = useRef(false);

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

  /*
   * 서버 응답을 로컬 상태에 얹는다.
   *
   * 처음에는 통째로 받지만, 그 뒤로는 **편집 대상 6개 키를 로컬 값으로 지킨다.**
   * 저장이 성공하면 템플릿 쿼리가 무효화돼 곧바로 다시 내려오는데, 그때 통째로 덮으면
   * 실시간 저장이 나간 사이에 멘토가 친 글자가 서버 응답으로 지워진다.
   *
   * 지키는 6개는 저장 요청에 실리는 키(`toTemplateUpdatePayload`)와 같은 집합이다.
   * 나머지(`mentoring`·`intro`)는 이 화면이 고치지 않는 읽기 전용이라 서버가 맞다 —
   * 오픈 설정에서 제목을 바꾸면 그 값이 여기로도 따라와야 미리보기가 거짓말을 안 한다.
   */
  useEffect(() => {
    if (!data) return;
    const keepEdits = (
      prev: LiveMentoringDetailPage | null,
    ): LiveMentoringDetailPage =>
      prev
        ? {
            ...data,
            hero: prev.hero,
            mentoringTypes: prev.mentoringTypes,
            strategy: prev.strategy,
            video: prev.video,
            results: prev.results,
            reviews: prev.reviews,
          }
        : data;
    setTemplate(keepEdits);
    setOriginalTemplate(keepEdits);
  }, [data]);

  /*
   * 실시간 저장·이탈 경고 판정 기준. 구조가 깊어 얕은 비교로는 못 잡아 직렬화로 비교한다.
   * 직렬화한 문자열은 디바운스 키로도 쓴다 — `isDirty` 불리언만 보면 첫 글자에서 true 가
   * 된 뒤 계속 true 라 타이머가 다시 시작되지 않고, 타이핑 중간에 저장이 나간다.
   */
  const templateJson = template === null ? '' : JSON.stringify(template);
  const isDirty =
    template !== null &&
    originalTemplate !== null &&
    templateJson !== JSON.stringify(originalTemplate);

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
    /*
      뒤로가기를 잡아채려면 히스토리에 한 칸이 필요하다. 실시간 저장이 붙은 뒤로
      `isDirty` 가 타이핑 내내 켜졌다 꺼졌다 하므로, 매번 쌓으면 뒤로가기가 수십 칸
      아래로 묻힌다. 이 화면에 있는 동안 한 번만 쌓는다.
     */
    if (!hasPushedGuardEntryRef.current) {
      hasPushedGuardEntryRef.current = true;
      window.history.pushState(null, '', window.location.href);
    }

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

  /*
   * 공개로 켤 수 없는 이유. 훅은 켤 수 있는지(`disabled`)만 알려주므로 여기서 짚는다 —
   * 회색 토글만 보여 주면 무엇을 해야 켜지는지 알 수 없다.
   */
  const openBlockedReason =
    openAction.currentOpening || !settings
      ? null
      : !settings.title?.trim()
        ? '오픈 설정에서 타이틀을 정하면 공개할 수 있어요.'
        : settings.categories.length === 0
          ? '오픈 설정에서 타입을 하나 이상 고르면 공개할 수 있어요.'
          : settings.durations.length === 0
            ? '오픈 설정에서 진행시간을 하나 이상 고르면 공개할 수 있어요.'
            : null;

  const header = (
    <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          1:1 LIVE 멘토링 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          오픈 설정에서 타이틀·타입·진행시간과 일정을 정하고, 이어지는 스텝에서
          멘티에게 보여줄 상세 페이지를 작성하세요.
        </p>
      </div>
      <DetailPageHeaderActions
        openAction={openAction}
        publicUrl={user ? publicDetailUrl(user.userId) : null}
        blockedReason={openBlockedReason}
      />
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
  const saveTemplate = async (): Promise<AutosaveResult> => {
    if (!template) return { ok: false };
    let payload = template;

    if (template.video.videoUrl) {
      const embedUrl = toYoutubeEmbedUrl(template.video.videoUrl);
      // 여기까지 오면 게이트(`describeAutosaveBlock`)가 이미 걸렀어야 한다.
      if (!embedUrl)
        return {
          ok: false,
          reason:
            'YouTube 주소만 넣을 수 있어요. 영상 페이지의 공유 링크를 붙여넣으면 자동으로 변환됩니다.',
        };
      payload = {
        ...template,
        video: { ...template.video, videoUrl: embedUrl },
      };
    }

    /*
     * 히어로 소개 불릿만은 빈 줄을 걸러서 보낸다. 서버가 `hero.bullets[i]` 공백을
     * 막지만(`@NotBlank`) 빈 배열 자체는 허용한다.
     *
     * 카드와 달리 막지 않는 이유는, 줄 하나는 지울 의사와 채울 의사를 구분할 방법이
     * 없고 지워져도 다시 만들기 쉽기 때문이다. 카드는 안에 이미지·태그까지 들어 있다.
     */
    const cleanedBullets = payload.hero.bullets
      .map((bullet) => bullet.trim())
      .filter(Boolean);

    /*
     * 유형 카드·결과 사례는 앞뒤 공백만 다듬는다.
     *
     * 예전에는 안 채운 카드를 걸러내서 보냈다(`@NotBlank` 라 그대로 보내면 400 이다).
     * 실시간 저장에서는 그게 곧 "방금 「+ 추가」로 만든 카드를 저장이 지운다"가 되므로,
     * 빈 카드가 있으면 아예 보내지 않는 쪽으로 바꿨다 — `describeAutosaveBlock` 이 막고
     * 하단 바에 무엇을 채우면 되는지 적는다. 여기 오는 값은 이미 다 채워져 있다.
     */
    const cleanedTypeItems = payload.mentoringTypes.items.map((item) => ({
      ...item,
      typeName: item.typeName.trim(),
      title: item.title.trim(),
      description: item.description.trim(),
    }));

    const cleanedResultCases = payload.results.cases.map((item) => ({
      ...item,
      beforeCaption: item.beforeCaption.trim(),
      afterCaption: item.afterCaption.trim(),
    }));

    payload = {
      ...payload,
      hero: { bullets: cleanedBullets },
      mentoringTypes: { ...payload.mentoringTypes, items: cleanedTypeItems },
      results: { ...payload.results, cases: cleanedResultCases },
    };

    /*
      다듬은 값을 로컬 상태에 되쓰지 않는다. 실시간 저장은 타이핑 도중에 나가는데,
      그때 `"안녕 "` 이 `"안녕"` 으로 바뀌면 textarea 의 커서가 끝으로 튄다.
      다듬기는 **보낼 때의 변환**으로만 두고, 기준선은 방금 보낸 로컬 값으로 잡는다.
     */
    // 서버 요청 DTO에 없는 값(intro·categories)은 여기서 떨어진다.
    try {
      await save(toTemplateUpdatePayload(payload));
      // 재조회로도 갱신되지만, 그 전까지 dirty 판정이 틀리지 않도록 곧바로 기준선을 옮긴다.
      setOriginalTemplate(template);
      return { ok: true };
    } catch (error) {
      /*
        어느 칸이 문제인지 화면에 적힌 이름으로 돌려준다. 서버 문구를 그대로 띄우면
        `[mentoringTypes.title] 공백일 수 없습니다 (BAD_REQUEST)` 가 되는데, 멘토는
        어느 칸인지 알 수 없고 뒤의 코드는 고치는 데 아무 도움이 안 된다.
       */
      return { ok: false, reason: describeSaveError(error) };
    }
  };

  /* 지금 보내면 서버가 거절할 이유. 있으면 보내지 않고 하단 바에 그 이유만 남긴다. */
  const blockedReason = template ? describeAutosaveBlock(template) : null;

  const detailStatus = useAutosave({
    fingerprint: templateJson,
    isDirty,
    blockedReason,
    save: saveTemplate,
  });

  // 위 훅에 건넨 ref 를 매 렌더 최신 값으로 맞춘다.
  isDirtyRef.current = isDirty;
  blockedReasonRef.current = blockedReason;
  saveTemplateRef.current = saveTemplate;

  const stepIndex = SETTINGS_TABS.findIndex((tab) => tab.id === activeTab);
  const goStep = (delta: number) => {
    const next = SETTINGS_TABS[stepIndex + delta];
    if (next) setActiveTab(next.id);
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
        <OpenSettingsSection onAutosaveStatusChange={setOpenStepStatus} />
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
          그러면 옆에 두고 보라고 만든 것이 제 역할을 못 한다.

          기준은 sticky 로 붙은 뒤가 아니라 **스크롤하기 전 자리**다. `top-6` 은 붙고 나서야
          적용되고, 처음에는 제목·설명·스텝 줄 아래에서 시작한다. 붙은 뒤 기준으로 잡으면
          첫 화면에서 그 머리 높이만큼 아래로 넘쳐 결국 스크롤해야 한다.

          빼는 값은 머리 영역(약 11rem)과 하단 저장 바가 앉는 높이(약 6rem)다. 그 바는
          fixed 라 자리를 차지하지 않으므로 여기서 비워 두지 않으면 프레임 아래를 덮는다.
        */}
            <div className="lg:sticky lg:top-6 lg:h-[calc(100vh-11.5rem)] lg:max-h-[880px] lg:self-start lg:overflow-hidden">
              <TemplatePreview
                template={template}
                activeTab={activeTab}
                mentorId={user?.userId ?? null}
              />
            </div>
          </div>
        </>
      )}

      {/*
        하단 고정 바 — 스텝을 아는 이 화면이 하나만 그린다(LC-3282).

        저장 상태는 지금 스텝의 것을 보여준다. 오픈 설정 스텝의 상태는 본문이
        위로 올려 주고(`onAutosaveStatusChange`), 상세 스텝은 여기서 직접 만든다.
      */}
      <SettingsActionBar
        status={activeTab === OPEN_TAB_ID ? openStepStatus : detailStatus}
        onPrev={() => goStep(-1)}
        onNext={() => goStep(1)}
        hasPrev={stepIndex > 0}
        hasNext={stepIndex >= 0 && stepIndex < SETTINGS_TABS.length - 1}
      />

      {/* 오픈 전 확인 모달 — 토글이 머리에 있으므로 스텝과 무관하게 페이지가 그린다. */}
      {openAction.modals}

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
