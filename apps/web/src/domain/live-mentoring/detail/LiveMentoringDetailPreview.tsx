'use client';

import { useEffect, useState } from 'react';

import type { LiveMentorDetail } from '@/api/live-mentoring/liveMentoringSchema';
import {
  LM_DIFFERENT_ID,
  LM_HERO_ID,
  LM_MENTOR_INFO_ID,
  LM_RESULTS_ID,
  LM_TYPES_ID,
  LM_VIDEO_ID,
} from './DetailNavigation';
import LiveMentoringDetailPage from './LiveMentoringDetailPage';

/**
 * 멘토가 지금 열어 둔 편집 탭 -> 이 페이지에서 스크롤할 섹션.
 *
 * 탭 id 는 멘토 앱의 `settings/tabs.ts` 와 같은 어휘다. 히어로도 자기 id 를 갖는다 —
 * 없이 두면 항목을 문서 전체에서 찾게 되어, 히어로 첫 줄을 고르는데 다른 섹션의
 * 첫 항목으로 스크롤되는 일이 생긴다.
 */
const TAB_TO_SECTION_ID: Record<string, string> = {
  hero: LM_HERO_ID,
  intro: LM_MENTOR_INFO_ID,
  mentoringTypes: LM_TYPES_ID,
  strategy: LM_DIFFERENT_ID,
  video: LM_VIDEO_ID,
  results: LM_RESULTS_ID,
};

/**
 * 멘토 앱이 편집 중인 값을 보낼 때 쓰는 메시지.
 *
 * `type` 을 확인하는 이유는 이 창에 다른 메시지도 들어오기 때문이다 — 확장 프로그램,
 * 개발 도구, Next.js 의 HMR 이 모두 `postMessage` 를 쓴다.
 */
export const LIVE_MENTORING_PREVIEW_MESSAGE =
  'letscareer:live-mentoring-preview';

interface PreviewMessage {
  type: typeof LIVE_MENTORING_PREVIEW_MESSAGE;
  template: LiveMentorDetail['template'];
  /** 편집 중인 탭. 그 섹션으로 스크롤한다. 없으면 스크롤하지 않는다. */
  activeTab?: string;
  /** 그 섹션 안에서 편집 중인 항목 번호(0부터). 없으면 섹션 전체로 간다. */
  activeItem?: number | null;
}

/** 요소가 지금 화면 가운데 근처에 있는지. 살짝 걸친 정도는 "안 보인다"로 본다. */
const isNearCenter = (el: Element) => {
  const { top, bottom } = el.getBoundingClientRect();
  const height = window.innerHeight;
  return top > height * 0.1 && bottom < height * 0.9;
};

/**
 * 대상을 화면 **가운데**로 옮긴다.
 *
 * `scrollIntoView` 를 쓰지 않는다. 그 API 는 조상 스크롤 컨테이너를 전부 따라 움직여서,
 * iframe 안에서 부르면 멘토 앱의 설정 화면까지 같이 스크롤된다 — 미리보기를 건드렸을
 * 뿐인데 편집 폼이 제멋대로 움직이는 것처럼 보인다. `window.scrollTo` 는 이 창만 움직인다.
 */
const centerInFrame = (el: Element) => {
  const { top, height } = el.getBoundingClientRect();
  const target = top + window.scrollY - (window.innerHeight - height) / 2;
  window.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
};

/**
 * 지금 쓰고 있는 자리를 화면 가운데에 둔다.
 *
 * 섹션까지만 따라가면 유형 카드가 서너 개로 늘었을 때 몇 번째를 쓰는지 알 수 없다.
 * 그래서 편집 중인 항목 번호(`activeItem`)까지 받아 그 카드로 간다.
 *
 * 움직이는 조건은 두 가지다.
 *  - 탭이나 항목이 바뀌면 **무조건** 간다. 편집 대상이 바뀐 것이다.
 *  - 같은 자리에서 글자만 칠 때는 **화면 밖으로 벗어났을 때만** 따라간다.
 *    매 타자마다 스크롤하면 보고 있는 자리가 계속 흔들린다.
 */
let lastPosition: string | undefined;
const scrollToEditing = (
  tab: string | undefined,
  item: number | null,
): { sectionShown: boolean } => {
  if (!tab) return { sectionShown: true };

  const position = `${tab}:${item ?? ''}`;
  const moved = position !== lastPosition;
  lastPosition = position;

  const id = TAB_TO_SECTION_ID[tab];
  if (id === undefined) return { sectionShown: true };

  /*
    섹션이 없을 수 있다. 노출을 껐거나(`visible: false`), 영상 URL 처럼 없으면 섹션째로
    빠지는 값이 비어 있는 경우다. 공개 페이지가 그렇게 그리므로 미리보기도 같다 —
    다만 멘토는 "미리보기가 안 된다"로 읽으므로, 그 사실을 부모에게 알려 문구로 띄운다.
   */
  /*
    본문이 아직 없으면 판정하지 않는다.

    상세 조회가 끝나기 전에는 어떤 섹션도 없다. 그 상태에서 "안 나온다"고 알리면,
    멘토는 화면을 열자마자 노출을 켜라는 문구를 보게 된다 — 실제로는 켜져 있는데도.
    아무 섹션도 없으면 아직 그리는 중이므로 직전 판정을 그대로 둔다.
   */
  const rendered = Object.values(TAB_TO_SECTION_ID).some((sectionId) =>
    document.getElementById(sectionId),
  );
  if (!rendered) return { sectionShown: true };

  const section = document.getElementById(id);
  if (!section) return { sectionShown: false };

  // 항목은 **그 섹션 안에서만** 찾는다. 문서 전체에서 찾으면 다른 섹션의 같은 번호가 걸린다.
  const target =
    (item !== null
      ? section.querySelector(`[data-preview-item="${item}"]`)
      : null) ?? section;

  if (!moved && isNearCenter(target)) return { sectionShown: true };
  centerInFrame(target);
  return { sectionShown: true };
};

const isPreviewMessage = (value: unknown): value is PreviewMessage =>
  typeof value === 'object' &&
  value !== null &&
  (value as { type?: unknown }).type === LIVE_MENTORING_PREVIEW_MESSAGE &&
  typeof (value as { template?: unknown }).template === 'object' &&
  (value as { template?: unknown }).template !== null;

interface LiveMentoringDetailPreviewProps {
  mentorId: string;
}

/**
 * 멘토 설정 화면이 iframe 으로 띄우는 상세 페이지 미리보기(LC-3268).
 *
 * 공개 상세와 **같은 컴포넌트**를 그린다. 멘토 앱이 마크업을 복제해 미리보기를 만들던
 * 방식은 공개 페이지가 바뀔 때마다 따라 고쳐야 했고, 실제로 어긋난 채 방치됐다.
 * 여기서는 편집 중인 템플릿만 갈아끼우므로 그럴 일이 없다.
 *
 * 평점·후기 수·가격·진행 기간은 이 페이지가 서버에서 직접 받는다. 멘토가 고치는 것은
 * 템플릿뿐이라, 나머지를 넘겨받으면 오히려 실제와 달라진다.
 *
 * 메시지가 오기 전에는 서버에 저장된 템플릿을 그린다 — 첫 프레임이 빈 화면이 되지 않는다.
 */
const LiveMentoringDetailPreview = ({
  mentorId,
}: LiveMentoringDetailPreviewProps) => {
  const [template, setTemplate] = useState<
    LiveMentorDetail['template'] | undefined
  >(undefined);
  /*
    지금 편집 중인 자리. 스크롤은 이 값이 바뀐 **뒤** 렌더가 끝나고 한다.

    메시지를 받은 자리에서 바로 스크롤하면 아직 옛 DOM 이다 — 카드를 새로 추가하고
    그 카드로 가려는 순간, 그 카드는 화면에 없어서 섹션 전체가 가운데로 온다.
   */
  const [editing, setEditing] = useState<{
    tab?: string;
    item: number | null;
  }>({ item: null });

  useEffect(() => {
    const { sectionShown } = scrollToEditing(editing.tab, editing.item);
    const allowedOrigin = process.env.NEXT_PUBLIC_MENTOR_URL;
    if (!allowedOrigin) return;
    window.parent.postMessage(
      {
        type: `${LIVE_MENTORING_PREVIEW_MESSAGE}:section`,
        tab: editing.tab,
        shown: sectionShown,
      },
      allowedOrigin,
    );
  }, [editing, template]);

  useEffect(() => {
    /*
      보낸 곳을 반드시 확인한다. 이 검사가 없으면 아무 사이트나 이 주소를 iframe 으로
      띄우고 내용을 제 마음대로 바꿔 보여줄 수 있다 — 멘토 페이지를 사칭하는 화면이 된다.

      값이 비어 있으면(환경변수 미설정) 아무 메시지도 받지 않는다. 열어 두는 것보다
      미리보기가 갱신되지 않는 편이 낫다.
     */
    const allowedOrigin = process.env.NEXT_PUBLIC_MENTOR_URL;
    if (!allowedOrigin) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== allowedOrigin) return;
      if (!isPreviewMessage(event.data)) return;
      setTemplate(event.data.template);
      setEditing({
        tab: event.data.activeTab,
        item: event.data.activeItem ?? null,
      });
    };

    /*
      프레임 안에서는 아무 데도 못 간다.

      상세 본문에도 링크가 있고(후기 더보기, FAQ 등), 한 번 다른 주소로 넘어가면
      미리보기가 통째로 사라진 것처럼 보인다. 돌아올 길도 프레임 안에는 없다.
      캡처 단계에서 막아 React 핸들러보다 먼저 끊는다.
     */
    const blockNavigation = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      if (!anchor) return;
      event.preventDefault();
      event.stopPropagation();
    };
    document.addEventListener('click', blockNavigation, true);

    window.addEventListener('message', handleMessage);
    /*
      부모에게 준비됐다고 알린다. iframe 로드가 끝나는 시점을 부모가 정확히 알 수 없어
      먼저 보낸 메시지는 흘려 버려진다 — 받을 준비가 된 쪽이 손을 드는 편이 확실하다.
     */
    window.parent.postMessage(
      { type: `${LIVE_MENTORING_PREVIEW_MESSAGE}:ready` },
      allowedOrigin,
    );

    return () => {
      window.removeEventListener('message', handleMessage);
      document.removeEventListener('click', blockNavigation, true);
    };
  }, []);

  return (
    <LiveMentoringDetailPage
      mentorId={mentorId}
      previewTemplate={template}
      isPreview
    />
  );
};

export default LiveMentoringDetailPreview;
