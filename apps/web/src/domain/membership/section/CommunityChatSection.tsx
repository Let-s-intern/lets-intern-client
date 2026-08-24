import { useEffect, useState } from 'react';
import { CHAT_SHOTS, COMMUNITY_CHAT } from '../data/communityChat';
import type { ChatShot } from '../data/communityChat';

/**
 * 헤드라인 한 줄에서 강조 어절만 파란색(.hl)으로 감싼다.
 *
 * 강조어가 둘 이상이라 재귀로 남은 구간을 다시 훑는다 — CoursePlanSection 과 같은 방식이다.
 * 한 번만 치는 단순 버전으로는 '쥬디' 뒤의 '취뽀 메이트' 를 놓친다.
 */
function HeadlineLine({
  line,
  highlights,
}: {
  line: string;
  highlights: readonly string[];
}) {
  const hit = highlights.find((word) => line.includes(word));
  if (!hit) return <>{line}</>;
  const at = line.indexOf(hit);
  return (
    <>
      {line.slice(0, at)}
      <span className="hl">{hit}</span>
      <HeadlineLine
        line={line.slice(at + hit.length)}
        highlights={highlights.filter((word) => word !== hit)}
      />
    </>
  );
}

/**
 * 모바일(≤600px) 여부 — 데스크톱은 메이슨리, 모바일은 마퀴로 렌더한다.
 *
 * ReviewsSection 에 같은 훅이 있지만 공용으로 빼지 않고 복제한다. 멤버십 섹션은
 * 자기 것만 참조해야 시즌이 끝났을 때 섹션 단위로 떼어낼 수 있다(PRD 1-1).
 */
function useIsMobile() {
  const query = '(max-width: 600px)';
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

/** 캡처 한 장. 이미지 자체가 카드(분홍 배경 포함)라 테두리를 덧대지 않는다. */
function ChatImage({ shot, eager }: { shot: ChatShot; eager?: boolean }) {
  return (
    <img
      className="cchat-shot"
      src={shot.src}
      alt={shot.alt}
      width={shot.width}
      height={shot.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

/** 데스크톱 — 3단 메이슨리. 나열 순서가 곧 열 배분이다(data/communityChat.ts 주석). */
function ChatGrid() {
  return (
    <div className="cchat-grid">
      {CHAT_SHOTS.map((shot, i) => (
        <div
          className="cchat-card rv"
          key={shot.src}
          style={{ ['--rvd' as string]: `${i * 0.08}s` }}
        >
          <ChatImage shot={shot} />
        </div>
      ))}
    </div>
  );
}

/** 모바일 — 좌→우로 흐르는 마퀴. 배열을 두 번 이어 붙여 끊김 없이 순환한다. */
function ChatMarquee() {
  return (
    <div className="cchat-marquee">
      <div className="cchat-row">
        <div className="cchat-track">
          {[...CHAT_SHOTS, ...CHAT_SHOTS].map((shot, i) => (
            <div className="cchat-card cchat-mcard" key={i}>
              <ChatImage shot={shot} eager />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 커뮤니티 톡방 혜택 — 쿠폰 섹션 바로 위.
 *
 * 제목이 h2 가 아니라 h3 다. 이 섹션은 CoursePlanSection 이 그리는 h2
 * ('공채 준비 올인원 패스 혜택') 아래에 딸린 혜택 묶음의 형제 블록이라,
 * MentoringCouponSection 과 같은 계층으로 맞춘다.
 */
export default function CommunityChatSection() {
  const isMobile = useIsMobile();

  return (
    <section className="cchat" id="community-chat">
      <div className="wrap">
        <div className="cchat-head rv">
          <h3>
            {COMMUNITY_CHAT.titleTop}
            <br />
            <HeadlineLine
              line={COMMUNITY_CHAT.titleMain}
              highlights={COMMUNITY_CHAT.titleHighlights}
            />
          </h3>
          <p>{COMMUNITY_CHAT.subtitle}</p>
        </div>

        {isMobile ? <ChatMarquee /> : <ChatGrid />}
      </div>
    </section>
  );
}
