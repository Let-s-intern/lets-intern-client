'use client';

import { isSlackChatLink } from '@/domain/challenge/utils/chatLink';

interface MissionShareModalProps {
  link: string;
  /** 참여코드. 있으면 입장 전에 함께 보여준다. */
  password?: string;
  onClose: () => void;
}

/**
 * 제출 직후 공유를 안내하는 모달.
 *
 * 공유해야 제출이 인정되는데, 안내는 제출 폼 위쪽에만 있어 제출 버튼을 누른 사람의
 * 시선에서는 이미 지나간 자리다. 제출 순간에 한 번 더 세운다.
 *
 * 닫아도 제출 버튼 아래 공유 버튼이 남으므로, "나중에" 를 눌러도 경로가 끊기지 않는다.
 *
 * 공용 `AlertModal` 을 쓰지 않는다. 그쪽 푸터는 `justify-content: flex-end` 에 테두리도
 * 배경도 없는 텍스트 버튼이라, 글자 수가 다른 두 버튼("나중에" / "슬랙 채널 입장")이
 * 오른쪽에 몰려 균형이 깨진다. 그 스타일은 CSS Module 해시 클래스라 바깥에서 덮어쓸 수
 * 없고, 공용 파일을 고치면 다른 다섯 도메인의 모달이 함께 바뀐다.
 */
const MissionShareModal = ({
  link,
  password,
  onClose,
}: MissionShareModalProps) => {
  const isSlack = isSlackChatLink(link);
  const placeName = isSlack ? '슬랙 채널' : '카카오톡 오픈채팅방';

  const handleEnter = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-5">
      <div className="w-full max-w-[400px] rounded-md bg-white p-6">
        {/* 완료·축하는 이 앱에서 🎉 로 표시한다(MissionEndSection, 결제 완료 화면). */}
        <h3 className="text-small18 text-neutral-0 text-center font-bold">
          🎉 미션 제출에 성공했습니다
        </h3>

        {/*
          공유 요청이 이 모달의 목적이다. 설명문과 같은 크기면 세 줄이 뭉쳐 보여
          한 단계 키우고 색으로 띄운다.
        */}
        <p className="text-xsmall16 text-primary mt-4 text-center font-bold">
          미션을 공유해 주세요!
        </p>
        <p className="text-xsmall14 text-neutral-40 mt-1.5 text-center">
          제출 후, 미션과 소감을 {placeName}에 공유해야 제출이 인정됩니다.
        </p>

        {password && (
          <div className="rounded-xs bg-neutral-95 mt-4 flex items-center justify-between gap-2 px-3 py-2.5">
            <span className="text-xxsmall12 text-neutral-40">참여코드</span>
            <span className="text-xsmall16 text-neutral-0 break-all font-semibold">
              {password}
            </span>
          </div>
        )}

        {/* 두 버튼을 같은 폭으로 둔다. 글자 수가 달라도 균형이 무너지지 않는다. */}
        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xs border-neutral-70 text-xsmall16 text-neutral-40 hover:bg-neutral-95 flex-1 border bg-white py-3 font-medium transition-colors"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={handleEnter}
            className="rounded-xs bg-primary text-xsmall16 flex-1 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            {isSlack ? '슬랙 채널 입장' : '오픈채팅방 입장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionShareModal;
