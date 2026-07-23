'use client';

import ProgramCard from '@/domain/program/programs/card/ProgramCard';
import { ProgramInfo } from '@/schema';
import { captureSeminarCardClick } from '../analytics';

/**
 * 모집 중 세미나 카드 — 범용 ProgramCard에 클릭 트래킹만 얹는 얇은 래퍼.
 * ProgramCard는 grid-rows-subgrid 정렬을 위해 그리드 직계 자식이어야 하므로,
 * 래퍼를 display:contents(`contents`)로 두어 레이아웃에서 사라지게 하고
 * 클릭만 버블링으로 캡처한다(status: RECRUITING).
 */
const SeminarRecruitingCard = ({
  program,
  userId,
}: {
  program: ProgramInfo;
  userId?: number;
}) => (
  <div
    className="contents"
    onClick={() =>
      captureSeminarCardClick({
        seminarId: program.programInfo.id,
        seminarTitle: program.programInfo.title ?? null,
        status: 'RECRUITING',
        userId,
      })
    }
  >
    <ProgramCard program={program} />
  </div>
);

export default SeminarRecruitingCard;
