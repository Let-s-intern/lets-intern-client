import {
  RefundMode,
  RefundTarget,
} from '@/domain/admin/program/program-user/ui/RefundModal';
import Table from '@/domain/admin/ui/table/regacy/Table';
import TD from '@/domain/admin/ui/table/regacy/TD';
import TH, { THProps } from '@/domain/admin/ui/table/regacy/TH';
import { PassParticipant } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import { useMemo, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import ParticipantDetailRows, { appAmount } from './ParticipantDetailRows';

interface Props {
  participants: PassParticipant[];
  programTitle: string;
  onRefundClick: (target: RefundTarget, mode: RefundMode) => void;
  onUsedProgramsClick: (participant: PassParticipant) => void;
}

export default function ParticipantTable({
  participants,
  programTitle,
  onRefundClick,
  onUsedProgramsClick,
}: Props) {
  const [nameOrder, setNameOrder] = useState<THProps['inOrder']>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const handleNameHeadClick = () =>
    setNameOrder((prev) =>
      prev === 'ASCENDING'
        ? 'DESCENDING'
        : prev === 'DESCENDING'
          ? null
          : 'ASCENDING',
    );

  const toggle = (email: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email);
      else next.add(email);
      return next;
    });

  // email 기준 그룹 → 그룹 내 건은 결제일(createDate) 오름차순(최초 먼저)
  const groups = useMemo(() => {
    const map = new Map<string, PassParticipant[]>();
    for (const p of participants) {
      const arr = map.get(p.email);
      if (arr) arr.push(p);
      else map.set(p.email, [p]);
    }
    let result = Array.from(map.values()).map((apps) =>
      [...apps].sort((a, b) => a.createDate.localeCompare(b.createDate)),
    );
    if (nameOrder) {
      result = [...result].sort((a, b) => a[0].name.localeCompare(b[0].name));
      if (nameOrder === 'DESCENDING') result.reverse();
    }
    return result;
  }, [participants, nameOrder]);

  const refundTargetOf = (p: PassParticipant): RefundTarget => ({
    applicationId: p.id,
    name: p.name,
    email: p.email,
    phoneNum: p.phoneNum,
    programTitle,
    orderId: p.orderId,
    pricePlanType: null,
    couponName: p.couponName,
    couponDiscount: p.couponDiscount,
    finalPrice: p.finalPrice,
  });

  return (
    <Table minWidth={1180}>
      <colgroup>
        <col style={{ width: 1 }} />
        <col style={{ width: 120 }} />
        <col style={{ width: 190 }} />
        <col style={{ width: 120 }} />
        <col style={{ width: 170 }} />
        <col style={{ width: 150 }} />
        <col style={{ width: 230 }} />
        <col style={{ width: 160 }} />
      </colgroup>
      <thead>
        <tr>
          <TH> </TH>
          <TH inOrder={nameOrder} onClick={handleNameHeadClick}>
            이름
          </TH>
          <TH>소통용 이메일</TH>
          <TH>휴대폰 번호</TH>
          <TH>결제 상품</TH>
          <TH>총 결제금액</TH>
          <TH>참여 기간</TH>
          <TH>이용 프로그램</TH>
        </tr>
      </thead>
      <tbody>
        {groups.map((apps) => {
          const email = apps[0].email;
          return (
            <ParticipantGroupRows
              key={email}
              apps={apps}
              isOpen={expanded.has(email)}
              onToggle={() => toggle(email)}
              onUsedProgramsClick={onUsedProgramsClick}
              onRefundClick={onRefundClick}
              refundTargetOf={refundTargetOf}
            />
          );
        })}
      </tbody>
    </Table>
  );
}

interface GroupRowsProps {
  apps: PassParticipant[];
  isOpen: boolean;
  onToggle: () => void;
  onUsedProgramsClick: (participant: PassParticipant) => void;
  onRefundClick: (target: RefundTarget, mode: RefundMode) => void;
  refundTargetOf: (p: PassParticipant) => RefundTarget;
}

function ParticipantGroupRows({
  apps,
  isOpen,
  onToggle,
  onUsedProgramsClick,
  onRefundClick,
  refundTargetOf,
}: GroupRowsProps) {
  const head = apps[0];
  const total = apps.reduce((sum, p) => sum + appAmount(p), 0);
  // startDate 는 최초로 고정, createDate 오름차순이라 마지막이 최신 종료
  const firstStart = head.startDate;
  const lastEnd = apps[apps.length - 1].endDate;
  const totalDays = dayjs(lastEnd).diff(dayjs(firstStart), 'day');

  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer ${
          isOpen ? 'bg-neutral-90' : 'hover:bg-neutral-90'
        }`}
        aria-expanded={isOpen}
      >
        <TD>
          <span className="flex items-center justify-center text-neutral-500">
            {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </TD>
        <TD>{head.name}</TD>
        <TD>{head.email}</TD>
        <TD>{head.phoneNum}</TD>
        <TD>{head.productName}</TD>
        <TD>
          {total.toLocaleString()}원 ({apps.length}건)
        </TD>
        <TD>
          {totalDays}일 ({dayjs(firstStart).format('YYYY.MM.DD')} ~{' '}
          {dayjs(lastEnd).format('YYYY.MM.DD')})
        </TD>
        <TD>
          <button
            type="button"
            className="border-primary text-primary hover:bg-primary-5 w-24 whitespace-nowrap rounded border py-1 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onUsedProgramsClick({
                ...head,
                usedPrograms: apps.flatMap((p) => p.usedPrograms),
              });
            }}
          >
            조회
          </button>
        </TD>
      </tr>

      {isOpen && (
        <ParticipantDetailRows
          apps={apps}
          onRefundClick={onRefundClick}
          refundTargetOf={refundTargetOf}
        />
      )}
    </>
  );
}
