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

describe('toMypageApplicationCardConfig - 멤버십 기수 (LC-3219)', () => {
  const actionButtonOf = (application: MypageApplication) =>
    toMypageApplicationCardConfig(application).actionButton;

  it('결제 대상이 아닌 기수(309)도 노션 가이드로 보낸다', () => {
    // 운영 env 를 384 로 올리자 309 가 멤버십으로 인정되지 않아, 이 버튼이 '가이드 확인'
    // 대신 '대시보드 입장' 으로 바뀌었다. 멤버십은 챌린지 대시보드를 쓰지 않으므로
    // 8월 기수 참여자가 가이드에 닿을 길이 사라졌다. 그 회귀를 여기서 막는다.
    expect(actionButtonOf({ ...baseChallenge, programId: 309 })).toEqual({
      label: '가이드 확인',
      href: expect.stringContaining('notion.site'),
      external: true,
    });
  });

  it('현행 기수(384)도 노션 가이드로 보낸다', () => {
    expect(actionButtonOf({ ...baseChallenge, programId: 384 })).toEqual({
      label: '가이드 확인',
      href: expect.stringContaining('notion.site'),
      external: true,
    });
  });

  it('멤버십이 아닌 챌린지는 대시보드 입장을 유지한다', () => {
    expect(actionButtonOf(baseChallenge)).toEqual({
      label: '대시보드 입장',
      href: `/challenge/${baseChallenge.id}/${baseChallenge.programId}`,
    });
  });

  it('LIVE 프로그램은 programId 가 기수 번호와 같아도 가이드로 보내지 않는다', () => {
    // programId 는 프로그램 타입마다 별도 채번이라 LIVE 309 가 존재할 수 있다.
    expect(
      actionButtonOf({
        ...baseChallenge,
        programType: 'LIVE',
        programId: 309,
      }),
    ).toEqual({ label: '클래스 입장', href: '/program/live/309' });
  });
});
