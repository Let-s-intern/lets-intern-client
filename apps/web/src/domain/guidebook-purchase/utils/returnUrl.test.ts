import { parseReturnUrl } from './returnUrl';

const ALLOWED = ['https://ogonggo.co.kr'];

describe('parseReturnUrl', () => {
  it.each([
    ['https://ogonggo.co.kr/reports/fnb', 'https://ogonggo.co.kr/reports/fnb'],
    ['https://ogonggo.co.kr', 'https://ogonggo.co.kr/'],
    [
      'https://ogonggo.co.kr/reports/fnb?utm_source=x#top',
      'https://ogonggo.co.kr/reports/fnb?utm_source=x#top',
    ],
  ])('허용 도메인 %s 는 통과시킨다', (input, expected) => {
    expect(parseReturnUrl(input, ALLOWED)).toBe(expected);
  });

  it.each([
    ['빈 값', ''],
    ['상대 경로', '/reports/fnb'],
    ['프로토콜 상대 주소', '//evil.com/reports'],
    ['프로토콜 상대 주소(허용 도메인 모양)', '//ogonggo.co.kr/reports'],
    ['http', 'http://ogonggo.co.kr/reports/fnb'],
    ['javascript 스킴', 'javascript:alert(1)'],
    ['다른 도메인', 'https://evil.com/reports/fnb'],
    ['도메인 뒤에 붙인 속임수', 'https://ogonggo.co.kr.evil.com/reports'],
    ['서브도메인 아닌 접두 속임수', 'https://evilogonggo.co.kr/reports'],
    ['사용자 정보로 가장한 주소', 'https://ogonggo.co.kr@evil.com/reports'],
    ['사용자 정보가 붙은 허용 도메인', 'https://user:pw@ogonggo.co.kr/reports'],
    ['백슬래시 우회', 'https:\\\\evil.com'],
    ['다른 포트', 'https://ogonggo.co.kr:8443/reports'],
    ['허용 목록에 없는 서브도메인', 'https://admin.ogonggo.co.kr/reports'],
  ])('%s 는 거른다', (_name, input) => {
    expect(parseReturnUrl(input, ALLOWED)).toBeNull();
  });

  it('값이 없으면 null 이다', () => {
    expect(parseReturnUrl(null, ALLOWED)).toBeNull();
    expect(parseReturnUrl(undefined, ALLOWED)).toBeNull();
  });

  it('허용 목록을 넘기지 않으면 오공고 운영 도메인을 기본으로 쓴다', () => {
    expect(parseReturnUrl('https://ogonggo.co.kr/reports/fnb')).toBe(
      'https://ogonggo.co.kr/reports/fnb',
    );
    expect(parseReturnUrl('https://evil.com')).toBeNull();
  });
});
