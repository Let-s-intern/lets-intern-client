export const POPUP_WINDOW_NAME = 'letscareer-form';
export const POPUP_WINDOW_FEATURES = 'width=480,height=760';
export const POPUP_FUNCTION_NAME = 'openLetscareerForm';

/**
 * 문자열 리터럴로 넣을 값. `</script>` 나 줄 구분 문자가 들어와도 스크립트가 깨지지 않게 막는다.
 */
const toScriptString = (value: string) =>
  JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

/**
 * 상세페이지에 붙여 넣는 팝업용 코드(PRD 5·7절).
 * 버튼을 누르는 순간 상세페이지 주소의 `utm_*` 를 신청 URL 에 옮겨 붙이고 팝업으로 연다.
 * 합치는 규칙은 `mergeUtmParams` 와 같다. 오래된 브라우저에서도 돌도록 ES5 로만 쓴다.
 */
export const buildPopupCode = (applyUrl: string) =>
  `<!-- 신청 버튼: <button type="button" onclick="${POPUP_FUNCTION_NAME}()">신청하기</button> -->
<script>
window.${POPUP_FUNCTION_NAME} = function () {
  var url = ${toScriptString(applyUrl)};
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };
  var pairs = function (q) {
    var out = [], all = q.replace(/^\\?/, '').split('&');
    for (var i = 0; i < all.length; i++) if (all[i] !== '') out.push(all[i]);
    return out;
  };
  var utm = {}, keys = [], page = pairs(window.location.search);
  for (var i = 0; i < page.length; i++) {
    var k = page[i].split('=')[0];
    if (!/^utm_/.test(k)) continue;
    if (!has(utm, k)) keys.push(k);
    utm[k] = page[i];
  }
  if (keys.length) {
    var at = url.indexOf('?');
    var kept = at < 0 ? [] : pairs(url.slice(at));
    var merged = [];
    for (var j = 0; j < kept.length; j++) if (!has(utm, kept[j].split('=')[0])) merged.push(kept[j]);
    for (var n = 0; n < keys.length; n++) merged.push(utm[keys[n]]);
    url = (at < 0 ? url : url.slice(0, at)) + '?' + merged.join('&');
  }
  window.open(url, '${POPUP_WINDOW_NAME}', '${POPUP_WINDOW_FEATURES}');
};
</script>`;
