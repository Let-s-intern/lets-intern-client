// 커뮤니티 톡방 혜택 섹션.
//
// 실제 톡방 대화 캡처 4장을 그대로 보여준다. 각 이미지는 분홍 카드 배경까지 포함한
// 완성본이라 CSS 로 카드 컨테이너를 만들지 않는다 — 테두리·그림자를 덧대면 이중 카드가 된다.
//
// 캡처 안 이름과 링크는 원본에서 이미 가려져 있다. 이미지를 다시 받을 때도
// 마스킹 여부를 먼저 확인한다.

export interface ChatShot {
  src: string;
  /** 대화 요지를 문장으로 옮긴 것. 이름표 수준으로 줄이지 말 것 */
  alt: string;
  /** 실측 크기. next/image 를 쓰지 않으므로 <img> 에 직접 넣어 CLS 를 막는다 */
  width: number;
  height: number;
}

/**
 * 나열 순서가 곧 배치다.
 *
 * 데스크톱은 `column-count: 3` 메이슨리라 브라우저가 높이를 맞춰 나눠 담는다.
 * 지금 순서(668 / 311 + 372 / 506)면 시안과 같은 3열로 떨어진다 — 순서를 바꾸면
 * 열 배분이 달라진다.
 */
export const CHAT_SHOTS: readonly ChatShot[] = [
  {
    src: '/images/membership/chat-recruit-timing.webp',
    alt: '매니저가 하반기 공채 공고 오픈 시점을 작년 삼성 기준으로 짚어주고, 광복절 이후 8월 18일부터 9월 2~11일에 공고가 몰릴 것으로 전망하는 메시지. 이어서 공채 기간에 인턴을 병행할지 묻는 질문에, 바쁠 때 힘이 나는 사람인지 바쁘면 지치는 사람인지로 나눠 답하는 조언.',
    width: 400,
    height: 668,
  },
  {
    src: '/images/membership/chat-playbook-guide.webp',
    alt: '플레이북 공채자료 탭 화면과 함께, 인적성 수리·추리 뽀개기 가이드북을 새로 추가했으니 챌린지가 아닌 가이드북으로 본인 일정에 맞춰 진행하고 싶은 사람은 바로 확인해보라는 안내 메시지.',
    width: 440,
    height: 311,
  },
  {
    src: '/images/membership/chat-interview-advice.webp',
    alt: '해외 여행 일정과 면접 일정이 겹칠 것 같아 12월로 미뤄도 되는지 묻는 질문과, 10월은 인적성과 겹칠 수 있으니 12월 22~31일로 미뤄두면 겹칠 걱정이 없겠다고 답하는 조언.',
    width: 440,
    height: 372,
  },
  {
    src: '/images/membership/chat-seminar-recommend.webp',
    alt: '한국타이어 HR 현직 멘토의 자기소개서 제출 전 필수 체크리스트 무료 세미나를 추천하는 메시지. 세미나는 멤버십 참여자에게만 VOD 로 제공되며, 이후 3차 게릴라 미션으로 자기소개서를 함께 고쳐보는 시간을 예고한다.',
    width: 400,
    height: 506,
  },
] as const;

/** 헤더 문구 */
export const COMMUNITY_CHAT = {
  titleTop: '혼자 준비하다 막히지 않도록',
  /** 두 번째 줄. 강조 어절은 아래 titleHighlights 가 파랗게 칠한다 */
  titleMain: '렛츠커리어 매니저 쥬디와 취뽀 메이트와 함께해요',
  /** titleMain 안에서 파란색으로 강조할 어절 */
  titleHighlights: ['쥬디', '취뽀 메이트'],
  subtitle:
    '렛츠커리어 매니저 쥬디의 실전 정보부터 참여자들의 생생한 후기까지, 함께 묻고 나누며 끝까지 준비할 수 있어요.',
} as const;
