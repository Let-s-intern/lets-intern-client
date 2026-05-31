/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { buildJitsiRoomUrl } from '@letscareer/ui/JitsiEmbed/buildRoomUrl';

import type { FeedbackInfo, Mentor } from '../types';
import ReservationInfoSection from './ReservationInfoSection';

// @jitsi/react-sdk(ESM)는 jest가 그대로 파싱하지 못하므로 임베드 본문을 경량 스텁으로
// 대체한다. roomUrl 합성(buildJitsiRoomUrl) 검증은 스텁이 받은 data-room-url로 수행.
jest.mock('@letscareer/ui/JitsiEmbed', () => ({
  __esModule: true,
  JitsiEmbed: ({ roomUrl }: { roomUrl: string }) => (
    <div data-testid="jitsi-embed" data-room-url={roomUrl} />
  ),
}));

const FEEDBACK_ID = 4242;
const BASE_URL = 'https://jitsi-letscareer.supabin.com/';
const SALT = 'test-salt';

const mentor: Mentor = {
  nickname: '김멘토',
  introduction: '멘토 소개입니다.',
  profileImgUrl: '',
};

const feedbackInfo: FeedbackInfo = {
  feedbackId: FEEDBACK_ID,
  startDate: '2026-05-04T10:00:00+09:00',
  endDate: '2026-05-04T10:30:00+09:00',
  meetingUrl: 'https://zoom.example.com/j/abc',
  status: 'RESERVED',
  mentorStatus: null,
  menteeStatus: null,
  score: null,
  review: null,
};

const ORIGINAL_BASE = process.env.NEXT_PUBLIC_JITSI_BASE_URL;
const ORIGINAL_SALT = process.env.NEXT_PUBLIC_JITSI_ROOM_SALT;

describe('ReservationInfoSection — LIVE 피드백 입장 (Jitsi 임시 입장)', () => {
  beforeAll(() => {
    if (!document.getElementById('modal')) {
      const root = document.createElement('div');
      root.id = 'modal';
      document.body.appendChild(root);
    }
  });

  beforeEach(() => {
    process.env.NEXT_PUBLIC_JITSI_BASE_URL = BASE_URL;
    process.env.NEXT_PUBLIC_JITSI_ROOM_SALT = SALT;
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_JITSI_BASE_URL = ORIGINAL_BASE;
    process.env.NEXT_PUBLIC_JITSI_ROOM_SALT = ORIGINAL_SALT;
  });

  it('회의 링크(meetingUrl 외부 링크)는 그대로 보존된다', () => {
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={FEEDBACK_ID}
      />,
    );

    const link = screen.getByRole('link', {
      name: feedbackInfo.meetingUrl as string,
    });
    expect(link).toHaveAttribute('href', feedbackInfo.meetingUrl);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('클릭 전에는 Jitsi 임베드가 마운트되지 않는다', () => {
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={FEEDBACK_ID}
      />,
    );

    expect(screen.queryByTestId('jitsi-embed')).not.toBeInTheDocument();
  });

  it('"LIVE 피드백 입장하기" 클릭 시 모달이 열리고 feedbackId 기반 동일 방으로 임베드된다', async () => {
    const user = userEvent.setup();
    render(
      <ReservationInfoSection
        mentor={mentor}
        feedbackInfo={feedbackInfo}
        status="reserved"
        feedbackId={FEEDBACK_ID}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'LIVE 피드백 입장하기' }),
    );

    const embed = screen.getByTestId('jitsi-embed');
    // feedbackId + salt 로 합성한 방 URL 이 그대로 임베드에 전달되어야
    // 멘토/멘티가 동일 방으로 수렴한다.
    expect(embed).toHaveAttribute(
      'data-room-url',
      buildJitsiRoomUrl({
        baseUrl: BASE_URL,
        feedbackId: FEEDBACK_ID,
        salt: SALT,
      }),
    );
  });
});
