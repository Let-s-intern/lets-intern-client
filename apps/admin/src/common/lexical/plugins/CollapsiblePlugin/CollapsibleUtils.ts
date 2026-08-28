/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function setDomHiddenUntilFound(dom: HTMLElement): void {
  // tsc(lib.dom 구버전)는 'hidden' boolean 전용 타입이라 에러, tsgo(신버전 lib)는
  // 'until-found' 리터럴을 인식해 에러 없음 — 두 체커 모두에서 조용히 넘어가도록 ts-ignore 사용
  // @ts-ignore Property 'hidden' does not exist on type 'HTMLElement'
  dom.hidden = 'until-found';
}

export function domOnBeforeMatch(dom: HTMLElement, callback: () => void): void {
  dom.onbeforematch = callback;
}
