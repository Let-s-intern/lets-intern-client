import { describe, expect, it } from 'vitest';

import { buildApplyUrl, buildMyUrl, mergeUtmParams } from './formLinks';

const WEB = 'https://www.letscareer.co.kr';
const APPLY = `${WEB}/form/portfolio-1115`;

describe('buildApplyUrl, buildMyUrl', () => {
  it('신청 URL 과 신청 확인·취소 URL 을 만든다', () => {
    expect(buildApplyUrl(WEB, 'portfolio-1115')).toBe(APPLY);
    expect(buildMyUrl(WEB, 'portfolio-1115')).toBe(`${APPLY}/my`);
  });

  it('웹 주소 끝의 / 는 떼어 낸다', () => {
    expect(buildApplyUrl(`${WEB}/`, 'a')).toBe(`${WEB}/form/a`);
    expect(buildMyUrl(`${WEB}//`, 'a')).toBe(`${WEB}/form/a/my`);
  });

  it('slug 는 인코딩한다', () => {
    expect(buildApplyUrl(WEB, '포트 폴리오/1?x')).toBe(
      `${WEB}/form/%ED%8F%AC%ED%8A%B8%20%ED%8F%B4%EB%A6%AC%EC%98%A4%2F1%3Fx`,
    );
    expect(buildMyUrl(WEB, 'a b')).toBe(`${WEB}/form/a%20b/my`);
  });
});

describe('mergeUtmParams', () => {
  it('상세페이지에 UTM 이 없으면 신청 URL 을 그대로 쓴다', () => {
    expect(mergeUtmParams(APPLY, '')).toBe(APPLY);
    expect(mergeUtmParams(APPLY, '?ref=abc&page=2')).toBe(APPLY);
    expect(mergeUtmParams(`${APPLY}?utm_source=a`, '?')).toBe(
      `${APPLY}?utm_source=a`,
    );
  });

  it('상세페이지의 utm_* 를 옮겨 붙인다', () => {
    expect(
      mergeUtmParams(APPLY, '?utm_source=insta&utm_campaign=fall%20sale'),
    ).toBe(`${APPLY}?utm_source=insta&utm_campaign=fall%20sale`);
  });

  it('utm_* 가 아닌 값은 넘기지 않는다', () => {
    expect(
      mergeUtmParams(APPLY, '?fbclid=x&utm_medium=cpc&ref=y&utmsource=z'),
    ).toBe(`${APPLY}?utm_medium=cpc`);
  });

  it('신청 URL 의 기존 쿼리와 합치고, 같은 키는 상세페이지 값을 쓴다', () => {
    expect(
      mergeUtmParams(
        `${APPLY}?utm_source=direct&option=early&utm_term=k`,
        '?utm_source=insta&utm_content=banner',
      ),
    ).toBe(
      `${APPLY}?option=early&utm_term=k&utm_source=insta&utm_content=banner`,
    );
  });

  it('상세페이지에 같은 키가 여러 번 있으면 마지막 값을 쓴다', () => {
    expect(mergeUtmParams(APPLY, '?utm_source=a&utm_source=b')).toBe(
      `${APPLY}?utm_source=b`,
    );
  });

  it('신청 URL 의 constructor 같은 키도 지우지 않는다', () => {
    expect(mergeUtmParams(`${APPLY}?constructor=1`, '?utm_source=a')).toBe(
      `${APPLY}?constructor=1&utm_source=a`,
    );
  });
});
