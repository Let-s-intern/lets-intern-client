import { useEffect, useRef, useState } from 'react';

import type { LiveMentoringTemplate } from '@/api/live-mentoring/liveMentoringSchema';
import type { DetailTabId } from '../tabs';

/** 웹 미리보기 라우트가 기다리는 메시지 이름. 양쪽이 같아야 한다. */
const PREVIEW_MESSAGE = 'letscareer:live-mentoring-preview';
const PREVIEW_READY_MESSAGE = `${PREVIEW_MESSAGE}:ready`;
/** 미리보기가 "이 탭의 섹션이 지금 상세에 없다"고 알릴 때 쓰는 이름. */
const PREVIEW_SECTION_MESSAGE = `${PREVIEW_MESSAGE}:section`;

const WEB_ORIGIN = import.meta.env.VITE_WEB_URL ?? '';

interface TemplatePreviewProps {
  template: LiveMentoringTemplate;
  /** 지금 편집 중인 탭. 미리보기가 그 섹션으로 스크롤한다. */
  activeTab: DetailTabId;
  /** 공개 상세를 여는 키. 웹 라우트가 `/live-mentoring/[mentorId]` 다. */
  mentorId: number | null;
}

/**
 * 상세 페이지 실시간 미리보기 — **공개 페이지를 그대로 띄운다**(LC-3268).
 *
 * 예전에는 공개 상세의 마크업을 이 파일에 복제해 그렸다. 웹이 바뀔 때마다 따라 고쳐야
 * 했고 실제로 어긋난 채 방치됐다 — 제목이 하드코딩돼 있었고, 진행 기간과 플랜 카드는
 * 아예 없었다. 미리보기가 실제와 다르면 없느니만 못하다.
 *
 * 지금은 웹의 미리보기 라우트를 iframe 으로 띄우고, 편집 중인 템플릿을 `postMessage`
 * 로 보낸다. 평점·가격·진행 기간은 그쪽이 서버에서 직접 받으므로 진짜 값이 나오고,
 * 멘토가 고치는 템플릿만 저장 전에도 즉시 반영된다.
 *
 * 저장은 하지 않는다 — 주기 저장을 걸면 쓰다 만 문장이 공개 페이지로 나가고, 반쯤
 * 채운 카드는 서버 `@NotBlank` 에 걸려 저장이 실패한다.
 */
const TemplatePreview = ({
  template,
  activeTab,
  mentorId,
}: TemplatePreviewProps) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  /*
    iframe 이 받을 준비가 됐는지. 로드 완료 시점을 부모가 정확히 알 수 없어, 준비된
    쪽이 보내는 ready 를 기다린다. 그 전에 보낸 메시지는 그냥 사라진다.
   */
  const [isFrameReady, setIsFrameReady] = useState(false);
  /*
    지금 편집 중인 항목 번호. 유형 카드나 결과 사례가 서너 개로 늘면 섹션까지만 따라가서는
    몇 번째를 쓰고 있는지 알 수 없다. 포커스가 있는 입력의 조상에서 읽는다 —
    반복 항목마다 `data-preview-index` 가 붙어 있다.
   */
  const [activeItem, setActiveItem] = useState<number | null>(null);
  /*
    지금 탭의 섹션이 상세에 그려지고 있는지. 노출을 껐거나 영상 URL 처럼 없으면 섹션째로
    빠지는 값이 비어 있으면 false 다. 미리보기에 아무 변화가 없는 이유를 알려준다 —
    판정은 공개 페이지가 하고(그쪽이 실제로 그리므로) 여기서는 결과만 받는다.
   */
  const [isSectionShown, setIsSectionShown] = useState(true);

  useEffect(() => {
    setActiveItem(null);
  }, [activeTab]);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const holder = (event.target as HTMLElement | null)?.closest?.(
        '[data-preview-index]',
      );
      const raw = (holder as HTMLElement | null)?.dataset.previewIndex;
      setActiveItem(raw === undefined ? null : Number(raw));
    };
    document.addEventListener('focusin', handleFocus);
    return () => document.removeEventListener('focusin', handleFocus);
  }, []);

  useEffect(() => {
    const handleReady = (event: MessageEvent) => {
      if (WEB_ORIGIN && event.origin !== WEB_ORIGIN) return;
      const type = (event.data as { type?: unknown } | null)?.type;
      if (type === PREVIEW_SECTION_MESSAGE) {
        setIsSectionShown(Boolean((event.data as { shown?: boolean }).shown));
        return;
      }
      if (type !== PREVIEW_READY_MESSAGE) return;
      setIsFrameReady(true);
    };
    window.addEventListener('message', handleReady);
    return () => window.removeEventListener('message', handleReady);
  }, []);

  useEffect(() => {
    if (!isFrameReady || !WEB_ORIGIN) return;
    frameRef.current?.contentWindow?.postMessage(
      { type: PREVIEW_MESSAGE, template, activeTab, activeItem },
      WEB_ORIGIN,
    );
  }, [isFrameReady, template, activeTab, activeItem]);

  return (
    <section className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-2">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 px-1">
        <h2 className="text-base font-semibold text-gray-900">미리 보기</h2>
        {/*
          "저장하지 않아도 바로 반영돼요" 라고 쓰면 저장 없이 멘티에게 공개된다는 뜻으로
          읽힌다. 실제로는 이 화면에만 보이고, 공개는 저장한 뒤부터다.
        */}
        <p className="text-xs text-gray-500">
          지금 쓰는 내용이 여기 바로 보여요. 멘티에게는 저장한 뒤부터
          반영됩니다.
        </p>
      </div>

      {mentorId === null ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-xs text-gray-400">
          멘토 정보를 불러오는 중입니다.
        </div>
      ) : (
        /*
          휴대폰 프레임.

          멘티는 이 페이지를 모바일로 본다 — 데스크톱 폭으로 띄우면 줄바꿈과 잘림이
          실제와 달라진다. 비율은 375:812(iPhone 기준)로 고정한다.

          크기는 **높이**가 정한다. 폭을 375px 로 고정하면 프레임이 화면보다 길어져
          미리보기를 보려고 편집 화면을 스크롤해야 한다 — 옆에 두고 보라고 만든 것이
          제 역할을 못 한다. 화면에 들어오는 높이를 잡고 폭을 비율대로 따라가게 한다.
        */
        /*
          컬럼을 꽉 채우되 얇은 기기 테두리를 씌운다.

          비율은 실제 휴대폰에 맞추지 않는다 — 맞추면 좌우로 남는 흰 여백이 커서 정작
          볼 본문이 좁아진다. 다만 테두리도 없으면 이게 미리보기인지 편집 화면의 일부인지
          구분되지 않으므로, 얇은 베젤과 스피커 자국만 남겨 기기임을 알린다.
        */
        <div className="flex min-h-0 flex-1 flex-col rounded-[1.4rem] border-[6px] border-gray-900 bg-gray-900">
          {/* 스피커 자국. 장식이라 낭독에서 뺀다. */}
          <div
            aria-hidden="true"
            className="mx-auto mb-1 mt-0.5 h-0.5 w-10 shrink-0 rounded-full bg-gray-600"
          />
          <iframe
            ref={frameRef}
            title="상세 페이지 미리 보기"
            src={`${WEB_ORIGIN}/live-mentoring/preview/${mentorId}`}
            className="min-h-0 w-full flex-1 rounded-[1rem] border-0 bg-white"
          />
        </div>
      )}

      {/*
        안내는 프레임 **아래 고정 높이 자리**에 띄운다. 문구가 있고 없고에 따라 자리가
        생겼다 사라지면 그때마다 프레임 크기가 달라져, 같은 화면인데 미리보기가 커졌다
        작아졌다 한다. 자리는 늘 잡아 두고 글자만 나타난다.
      */}
      <p
        role="status"
        className="text-system-error mt-2 h-8 shrink-0 text-center text-xs font-medium leading-4"
      >
        {isSectionShown
          ? ''
          : '이 섹션은 지금 상세 페이지에 나오지 않아요. 노출을 켜고 필요한 값을 채우면 나타납니다.'}
      </p>
    </section>
  );
};

export default TemplatePreview;
