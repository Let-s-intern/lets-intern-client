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
    <section className="flex h-full flex-col rounded-xl border border-gray-200 bg-white px-3 py-4">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h2 className="text-base font-semibold text-gray-900">미리 보기</h2>
        <p className="text-xs text-gray-500">
          멘티에게 보이는 실제 화면입니다. 저장하지 않아도 바로 반영돼요.
        </p>
      </div>

      {isSectionShown ? null : (
        <p role="status" className="text-system-error mb-2 text-xs font-medium">
          이 섹션은 지금 상세 페이지에 나오지 않아요. 노출을 켜고 필요한 값을
          채우면 미리보기에 나타납니다.
        </p>
      )}

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
        <div className="flex min-h-0 flex-1 justify-center">
          <div className="flex h-full max-w-full flex-col rounded-[2.2rem] border-[10px] border-gray-900 bg-gray-900 shadow-lg">
            {/* 노치 자리. 장식이라 낭독에서 뺀다. */}
            <div
              aria-hidden="true"
              className="mx-auto mb-1.5 mt-0.5 h-1 w-14 shrink-0 rounded-full bg-gray-600"
            />
            <iframe
              ref={frameRef}
              title="상세 페이지 미리 보기"
              src={`${WEB_ORIGIN}/live-mentoring/preview/${mentorId}`}
              className="aspect-[375/812] h-full min-h-0 w-auto max-w-full rounded-[1.6rem] border-0 bg-white"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default TemplatePreview;
