'use client';

import LiveEdit from './LiveEdit';

/**
 * 서면 수정 페이지.
 *
 * PRD-서면라이브 분리 §5.1 — 라이브와 동일 BE 엔드포인트(`PATCH /api/v1/live/:liveId`)를
 * 사용하지만 메뉴/타이틀은 분리한다. 본 Push 2 시점에는 페이지 타이틀만 분기되며,
 * 폼 필드 차등화는 Push 3 에서 처리한다.
 */
const SeomyeonEdit: React.FC = () => {
  return <LiveEdit type="SEOMYEON" titleOverride="서면 수정" />;
};

export default SeomyeonEdit;
