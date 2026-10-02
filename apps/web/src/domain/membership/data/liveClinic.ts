// 개편 시안 7-0 — 쥬디 멘토 경험정리 LIVE 클리닉.
//
// 시안의 영상 자리는 "영상 준비 중 · 유튜브 영상 ID를 넣으면 이 자리에 재생됩니다" 상태다.
// 실제 링크를 받았다 (`7-1 쥬디 멘토 경험정리 live 클리닉 보기 링크.md`).
// 자동재생은 하지 않는다 — 랜딩을 훑는 중에 소리가 나면 그대로 닫는다.

export interface LiveClinicStep {
  label: string;
  title: string;
  body: string;
}

export const LIVE_CLINIC = {
  badge: '패스 참여자 전용 특별 혜택 · LIVE CLINIC',
  titleLines: ['내 경험 정리,', '객관적으로 판단해드립니다!'],
  subLines: [
    '패스 참여 초반, 렛츠커리어 CEO 쥬디 멘토의 경험정리 Live 클리닉이 진행될 예정입니다.',
    '내 경험을 더 디테일하게 정리해 제출하면 쥬디 멘토가 직접 확인하고 피드백해드립니다.',
  ],
  statValue: '3,000+',
  statLabel: '매년 쥬디 멘토가 검토하는 서류 수',
  /** 유튜브 영상 ID. 주소가 아니라 ID 로 든다 — 임베드 주소를 만들 때 한 곳만 본다 */
  videoId: 'gTYPWZCMANc',
  videoTitle: '쥬디 멘토 경험정리 Live 클리닉 미리보기',
  anchorId: 'live-clinic',
  steps: [
    {
      label: 'STEP 01',
      title: '경험 정리 후 제출',
      body: '지금까지의 경험을 더 디테일하게 정리해 제출합니다.',
    },
    {
      label: 'STEP 02',
      title: '쥬디 멘토가 직접 확인',
      body: '매년 3,000개 이상의 서류를 검토해온 시선으로 내 경험을 살펴봅니다.',
    },
    {
      label: 'STEP 03',
      title: 'Live 클리닉에서 피드백',
      body: '어떤 것을 더 보완해야 할지, 지금 어디에 지원해볼 수 있을지 알려드립니다.',
    },
  ] satisfies LiveClinicStep[],
} as const;
