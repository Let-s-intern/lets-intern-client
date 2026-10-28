import { describe, expect, it, vi } from 'vitest';

import { mergeUtmParams } from './formLinks';
import { buildPopupCode } from './popupCode';

const APPLY = 'https://www.letscareer.co.kr/form/portfolio-1115';

/** 상세페이지에 붙여 넣은 코드를 실제로 돌려 보고, 버튼을 눌렀을 때 window.open 인자를 돌려준다 */
const clickPopupButton = (code: string, pageSearch: string) => {
  const script = code.match(/<script>([\s\S]*)<\/script>/)?.[1];
  if (script === undefined) throw new Error('script 태그가 없다');

  const open = vi.fn();
  const fakeWindow: Record<string, unknown> = {
    open,
    location: { search: pageSearch },
  };
  new Function('window', script)(fakeWindow);
  (fakeWindow.openLetscareerForm as () => void)();

  expect(open).toHaveBeenCalledTimes(1);
  return open.mock.calls[0] as [string, string, string];
};

describe('buildPopupCode', () => {
  it('UTM 이 없으면 신청 URL 을 480x760 팝업으로 연다', () => {
    expect(clickPopupButton(buildPopupCode(APPLY), '')).toEqual([
      APPLY,
      'letscareer-form',
      'width=480,height=760',
    ]);
  });

  it('상세페이지의 utm_* 만 옮겨 붙인다', () => {
    const [url] = clickPopupButton(
      buildPopupCode(APPLY),
      '?fbclid=x&utm_source=insta&utm_campaign=fall%20sale',
    );
    expect(url).toBe(`${APPLY}?utm_source=insta&utm_campaign=fall%20sale`);
  });

  it('신청 URL 의 기존 쿼리와 합치고, 같은 키는 상세페이지 값을 쓴다', () => {
    const [url] = clickPopupButton(
      buildPopupCode(`${APPLY}?utm_source=direct&option=early`),
      '?utm_source=insta&utm_term=k',
    );
    expect(url).toBe(`${APPLY}?option=early&utm_source=insta&utm_term=k`);
  });

  it('mergeUtmParams 와 같은 결과를 낸다', () => {
    const cases: Array<[string, string]> = [
      [APPLY, ''],
      [APPLY, '?ref=1'],
      [`${APPLY}?a=1&utm_medium=x`, '?utm_medium=y&utm_source=a&utm_source=b'],
      [`${APPLY}?constructor=1`, '?utm_content=c&&'],
    ];
    cases.forEach(([applyUrl, search]) => {
      const [url] = clickPopupButton(buildPopupCode(applyUrl), search);
      expect(url).toBe(mergeUtmParams(applyUrl, search));
    });
  });

  it('인코딩된 slug 가 담긴 URL 을 그대로 쓴다', () => {
    const encoded = 'https://www.letscareer.co.kr/form/a%20b%27%22';
    const [url] = clickPopupButton(buildPopupCode(encoded), '');
    expect(url).toBe(encoded);
  });

  it('URL 에 따옴표나 </script> 가 있어도 스크립트가 깨지지 않는다', () => {
    const weird = `${APPLY}?q="'</script><b>\u2028`;
    const code = buildPopupCode(weird);
    expect(code.match(/<\/script>/g)).toHaveLength(1);
    expect(clickPopupButton(code, '')[0]).toBe(weird);
  });
});
