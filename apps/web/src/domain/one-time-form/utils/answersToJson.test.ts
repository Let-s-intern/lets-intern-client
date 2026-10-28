import { paidFormFixture } from '../__fixtures__/oneTimeFormFixtures';
import { answersFromJson, answersToJson } from './answersToJson';

const { questions } = paidFormFixture;
const IMAGE_KEY =
  'one-time-form/attachment/7/5d1e7a20-3c4b-4f8e-9b2a-6a1f0c3d8e77.png';
const FILE_KEY =
  'one-time-form/attachment/7/0b5c2f4e-9a61-4d1e-8f0a-3c2b7d9e1a44.pdf';

describe('answersToJson', () => {
  it('계약 6.1 예시(시드 폼 7, 질문 101~110)와 같은 JSON 을 만든다', () => {
    const result = answersToJson(questions, {
      101: '프론트엔드',
      102: '졸업 후 취업 준비',
      103: ['수', '월'],
      104: ['서류 첨삭'],
      105: '2027-02-20',
      106: '18',
      107: ' https://portfolio.example.com/kim ',
      108: '현업 피드백을 받아 포트폴리오를 완성하고 싶어요.\n',
      109: { key: IMAGE_KEY, name: '프로필.png' },
      110: { key: FILE_KEY, name: '김렛커_이력서_최종.pdf' },
    });

    expect(result).toStrictEqual({
      '101': '프론트엔드',
      '102': '졸업 후 취업 준비',
      '103': ['월', '수'],
      '104': ['서류 첨삭'],
      '105': '2027-02-20',
      '106': 18,
      '107': 'https://portfolio.example.com/kim',
      '108': '현업 피드백을 받아 포트폴리오를 완성하고 싶어요.',
      '109': { key: IMAGE_KEY, name: '프로필.png' },
      '110': { key: FILE_KEY, name: '김렛커_이력서_최종.pdf' },
    });
    expect(JSON.stringify(result['106'])).toBe('18');
  });

  it('계약 U3 요청 예시처럼 답하지 않은 질문은 키를 뺀다', () => {
    const result = answersToJson(questions, {
      101: '프론트엔드',
      102: '졸업 후 취업 준비',
      103: ['월', '수'],
      104: ['서류 첨삭'],
      105: '',
      106: '   ',
      107: '',
      108: '현업 피드백을 받아 포트폴리오를 완성하고 싶어요.',
      109: undefined,
      110: { key: FILE_KEY, name: '김렛커_이력서_최종.pdf' },
    });

    expect(Object.keys(result)).toEqual([
      '101',
      '102',
      '103',
      '104',
      '108',
      '110',
    ]);
  });

  it('null·빈 문자열·공백·빈 배열·없는 키는 모두 미응답이다', () => {
    expect(
      answersToJson(questions, {
        101: '',
        102: '  ',
        103: [],
        108: '\n\t',
      }),
    ).toStrictEqual({});
  });

  it('폼에 없는 질문의 답은 버린다', () => {
    expect(answersToJson(questions, { 999: '남은 답' })).toStrictEqual({});
  });
});

describe('answersFromJson', () => {
  it('숫자는 입력 문자열로 되돌리고 나머지는 그대로 둔다', () => {
    const attachment = {
      key: 'one-time-form/attachment/7/a.pdf',
      name: 'a.pdf',
    };
    expect(
      answersFromJson({
        '101': '프론트엔드',
        '103': ['월', '수'],
        '106': 12,
        '110': attachment,
      }),
    ).toEqual({
      101: '프론트엔드',
      103: ['월', '수'],
      106: '12',
      110: attachment,
    });
  });
});
