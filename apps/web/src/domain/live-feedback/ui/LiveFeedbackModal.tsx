'use client';

import { useEffect, useRef, useState } from 'react';

import {
  JitsiEmbed,
  LiveFeedbackMaterials,
  LiveSessionTimer,
} from '@letscareer/ui/JitsiEmbed';

import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';

import type { LiveRole } from '../hooks/liveRole';

/** 멘티 라이브 출석 상태 */
type AttendanceStatus = 'PENDING' | 'PRESENT' | 'ABSENT';

interface LiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingUrl: string | null;
  spaceName?: string;
  /** 이 세션에서의 역할 — 멘토일 때만 출석 체크 노출. */
  role: LiveRole;
  menteeName: string;
  preQuestion?: string;
  submissionUrl?: string;
  startDate?: string;
  endDate?: string;
  menteeStatus?: AttendanceStatus;
  /** 출석 저장(모달 닫힘/종료 시 일괄). */
  onSaveAttendance?: (status: AttendanceStatus) => void;
  /** 우선순위 순 jitsi base 후보 — 현재 서버 실패 시 다음 후보로 failover. */
  baseCandidates?: ReadonlyArray<string | undefined>;
  /** 다음 base 를 BE 에 재등록하는 콜백 (`PATCH /feedback/{id}/meeting-url`). */
  registerBaseUrl?: (base: string) => Promise<void>;
  /** 모든 후보 소진(입장 가능한 서버 없음) 시 호출. */
  onExhausted?: () => void;
}

/** 출석 체크 바 — 참석/불참 토글. 한번 더 누르면 해제(저장은 지연). */
const MenteeAttendanceBar = ({
  menteeName,
  selected,
  onSelect,
}: {
  menteeName: string;
  selected: AttendanceStatus | null;
  onSelect: (status: AttendanceStatus | null) => void;
}) => {
  // 이름 라벨과 출석/결석 칩의 글자 크기를 통일(text-xs). 데스크탑은 닫기 버튼과 높이(py-1.5)
  // 맞춰 디자인 통일, 모바일은 콤팩트(py-1).
  const baseChip =
    'shrink-0 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition disabled:opacity-50 md:py-1.5';
  const toggle = (status: AttendanceStatus) =>
    onSelect(selected === status ? null : status);
  return (
    <div
      className={twMerge(
        // 체크 전: 흰 아크릴(반투명·잘 보임). 체크 후: 배경 거의 투명(화면 덜 가림).
        'flex max-w-[calc(100vw-1rem)] items-center gap-1.5 rounded-full py-1 pl-3 pr-1 shadow-lg backdrop-blur-md transition-colors',
        selected
          ? 'border border-transparent bg-white/10 text-white'
          : 'border border-white/40 bg-white/70 text-neutral-800',
      )}
    >
      <span
        className={twMerge(
          'shrink-0 whitespace-nowrap text-xs font-semibold',
          selected ? 'text-white/80' : 'text-neutral-900',
        )}
      >
        {menteeName}님의 출석여부를 체크해 주세요
      </span>
      <span
        className={twMerge(
          'h-4 w-px shrink-0',
          selected ? 'bg-white/25' : 'bg-neutral-400',
        )}
      />
      <button
        type="button"
        onClick={() => toggle('PRESENT')}
        className={twMerge(
          baseChip,
          // 체크 후엔 선택 칩도 반투명(bg .../70)으로 빠져 전체가 균일하게 은은해진다.
          selected === 'PRESENT'
            ? 'bg-[#4d55f5]/70 text-white'
            : selected // 다른 항목 선택됨 → 투명 배경 위라 밝은 글자
              ? 'text-white/70 hover:bg-white/10'
              : 'bg-black/5 text-neutral-800 hover:bg-black/10', // 클릭 전 — 또렷하게
        )}
      >
        출석
      </button>
      <button
        type="button"
        onClick={() => toggle('ABSENT')}
        className={twMerge(
          baseChip,
          // 체크 후엔 선택 칩도 반투명(bg .../70)으로 빠져 전체가 균일하게 은은해진다.
          selected === 'ABSENT'
            ? 'bg-[#fc5555]/70 text-white'
            : selected // 다른 항목 선택됨 → 투명 배경 위라 밝은 글자
              ? 'text-white/70 hover:bg-white/10'
              : 'bg-black/5 text-neutral-800 hover:bg-black/10', // 클릭 전 — 또렷하게
        )}
      >
        결석
      </button>
    </div>
  );
};

/**
 * 라이브 피드백 입장 모달 — 멘토 앱 모달과 동일 디자인.
 *
 * - 4:3 모달, 좌상단 로고+타이머 아크릴(JitsiEmbed topLeftSlot).
 * - 좌하단 자료 버튼/패널(사전질문·제출물)은 공용 `LiveFeedbackMaterials` 사용(문구는 role 분기).
 * - 멘토 시점: 중앙 하단 출석 체크(토글). 저장은 닫힘/세션 종료 시 일괄(멘티 잠김 방지).
 * - 멘티 시점: 출석 체크 없이 동일 레이아웃.
 */
const LiveFeedbackModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
  role,
  menteeName,
  preQuestion,
  submissionUrl,
  startDate,
  endDate,
  menteeStatus,
  onSaveAttendance,
  baseCandidates,
  registerBaseUrl,
  onExhausted,
}: LiveFeedbackModalProps) => {
  const [pendingAttendance, setPendingAttendance] =
    useState<AttendanceStatus | null>(
      menteeStatus === 'PRESENT' || menteeStatus === 'ABSENT'
        ? menteeStatus
        : null,
    );
  const pendingRef = useRef(pendingAttendance);
  pendingRef.current = pendingAttendance;
  const savedRef = useRef(menteeStatus);
  savedRef.current = menteeStatus;
  const onSaveRef = useRef(onSaveAttendance);
  onSaveRef.current = onSaveAttendance;

  const flushAttendance = () => {
    const next = pendingRef.current;
    if (next && next !== savedRef.current) onSaveRef.current?.(next);
  };
  const handleClose = () => {
    flushAttendance();
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !endDate) return;
    const ms = new Date(endDate).getTime() - Date.now();
    if (ms <= 0) {
      flushAttendance();
      return;
    }
    const id = setTimeout(flushAttendance, ms);
    return () => clearTimeout(id);
    // flushAttendance 는 ref 기반 — isOpen/endDate 변화에만 재설정.
  }, [isOpen, endDate]);

  const isMentor = role === 'MENTOR';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      // 뒷배경 딤 + 블러(frosted). 이 모달에만 적용(opt-in prop).
      overlayClassName="bg-black/50 backdrop-blur-sm"
      // z-10: 모달 콘텐츠(Jitsi iframe)를 오버레이 위로 명시 합성 — 모바일(iOS)에서
      // fixed 오버레이가 iframe 위를 덮어 터치가 막히던 문제 방지.
      // 모바일: 자료 FAB를 숨기므로 모달이 화면 대부분을 차지(96dvh×98vw, 종횡비 미고정 → 화상은
      // 내부에서 레터박스). 데스크탑(md+)은 4:3·높이주도(96vh)·위쪽 정렬(mt-3).
      className="rounded-xxl relative z-10 h-[96dvh] max-h-[96dvh] w-[98vw] overflow-hidden bg-black md:mt-3 md:aspect-[4/3] md:h-[96vh] md:max-h-[1080px] md:w-auto md:max-w-[96vw] md:self-start"
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0">
          {meetingUrl ? (
            <JitsiEmbed
              roomUrl={meetingUrl}
              spaceName={spaceName}
              onClose={handleClose}
              baseCandidates={baseCandidates}
              registerBaseUrl={registerBaseUrl}
              onExhausted={onExhausted}
              topLeftSlot={
                startDate && endDate ? (
                  <LiveSessionTimer endDate={endDate} />
                ) : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-300">
              회의실이 아직 준비되지 않았습니다.
              <br />
              멘토가 라이브 피드백에 입장하면 회의실이 열립니다.
            </div>
          )}
        </div>

        {/* (멘토) 멘티 출석 체크 */}
        {isMentor && (
          <div
            data-testid="mentor-attendance-anchor"
            className={twMerge(
              // 모바일: 좌상단 타이머 패널 바로 아래. 데스크톱: 모달 하단 중앙.
              // 체크 후 흐림은 래퍼 opacity가 아니라 바 배경 투명화로 처리(MenteeAttendanceBar).
              'absolute left-3 top-[98px] z-10 md:bottom-20 md:left-1/2 md:top-auto md:-translate-x-1/2',
            )}
          >
            <MenteeAttendanceBar
              menteeName={menteeName}
              selected={pendingAttendance}
              onSelect={setPendingAttendance}
            />
          </div>
        )}
      </div>

      {/* 좌하단 자료 패널 — 공용 컴포넌트(문구는 role 분기). */}
      <LiveFeedbackMaterials
        viewer={role === 'MENTEE' ? 'MENTEE' : 'MENTOR'}
        menteeName={menteeName}
        preQuestion={preQuestion}
        submissionUrl={submissionUrl}
      />
    </BaseModal>
  );
};

export default LiveFeedbackModal;
