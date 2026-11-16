/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function setDomHiddenUntilFound(dom: HTMLElement): void {
  // lib.dom 버전에 따라 hidden 이 boolean 만 받기도 해서 tsc·tsgo 양쪽에서 통과하도록 넓힌다
  (dom as { hidden: unknown }).hidden = 'until-found';
}

export function domOnBeforeMatch(dom: HTMLElement, callback: () => void): void {
  dom.onbeforematch = callback;
}
