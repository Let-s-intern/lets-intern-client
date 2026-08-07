import { MypageApplication } from '@/api/application';
import dayjs from '@/lib/dayjs';
import { toMypageApplicationCardConfig } from './applicationCardConfig';

const baseChallenge: MypageApplication = {
  id: 1,
  programId: 100,
  programType: 'CHALLENGE',
  programStatusType: 'PROCEEDING',
  programTitle: '자소서 완성 챌린지',
  programShortDesc: '설명',
  programThumbnail: '',
  // 시작일이 지나야 대시보드 입장 버튼이 생긴다.
  programStartDate: dayjs().subtract(3, 'day'),
  programEndDate: dayjs().add(10, 'day'),
  createDate: dayjs().subtract(10, 'day'),
  status: 'IN_PROGRESS',
  pricePlanType: 'BASIC',
  challengeOptionList: [],
  chatLink: 'https://open.kakao.com/o/abc123',
  chatPassword: '1234',
};

const openChatOf = (application: MypageApplication) =>
  toMypageApplicationCardConfig(application).openChat;

describe('toMypageApplicationCardConfig - 오픈채팅방', () => {
  it('챌린지에 chatLink 가 있으면 링크와 참여코드를 함께 넘긴다', () => {
    expect(openChatOf(baseChallenge)).toEqual({
      link: 'https://open.kakao.com/o/abc123',
      password: '1234',
    });
  });

  it('참여코드가 없으면 password 를 비운다 - 모달 없이 바로 입장하는 분기', () => {
    expect(openChatOf({ ...baseChallenge, chatPassword: null })).toEqual({
      link: 'https://open.kakao.com/o/abc123',
      password: undefined,
    });
  });

  it('참여코드가 "없음" 류 값이어도 코드 없음으로 취급한다 - 운영 오입력 방어', () => {
    expect(openChatOf({ ...baseChallenge, chatPassword: '없음' })).toEqual({
      link: 'https://open.kakao.com/o/abc123',
      password: undefined,
    });
  });

  it('chatLink 가 없으면 노출하지 않는다', () => {
    expect(openChatOf({ ...baseChallenge, chatLink: null })).toBeUndefined();
  });

  it('chatLink 가 빈 문자열이면 노출하지 않는다', () => {
    expect(openChatOf({ ...baseChallenge, chatLink: '' })).toBeUndefined();
  });

  it('참여종료된 챌린지에는 노출하지 않는다', () => {
    expect(
      openChatOf({ ...baseChallenge, programStatusType: 'POST' }),
    ).toBeUndefined();
  });

  it('시작 전(참여예정)에도 노출한다 - OT 전 입장이 가장 필요한 시점이다', () => {
    const config = toMypageApplicationCardConfig({
      ...baseChallenge,
      programStatusType: 'PREV',
      programStartDate: dayjs().add(3, 'day'),
    });
    expect(config.openChat).toBeDefined();
    // 시작 전이라 대시보드 입장 버튼은 아직 없다.
    expect(config.actionButton).toBeUndefined();
  });

  it('라이트 플랜은 대시보드에 못 들어가지만 오픈채팅방은 노출한다', () => {
    const config = toMypageApplicationCardConfig({
      ...baseChallenge,
      pricePlanType: 'LIGHT',
    });
    expect(config.openChat).toBeDefined();
    expect(config.actionButton).toBeUndefined();
  });

  it('라이브 프로그램에는 노출하지 않는다', () => {
    expect(
      openChatOf({ ...baseChallenge, programType: 'LIVE' }),
    ).toBeUndefined();
  });

  it('BE 응답에 필드가 없어도(undefined) 깨지지 않는다', () => {
    const {
      chatLink: _chatLink,
      chatPassword: _chatPassword,
      ...withoutChat
    } = baseChallenge;
    const config = toMypageApplicationCardConfig(
      withoutChat as MypageApplication,
    );
    expect(config.openChat).toBeUndefined();
    // 기존 대시보드 입장 버튼은 그대로 살아 있어야 한다.
    expect(config.actionButton?.label).toBe('대시보드 입장');
  });
});
