'use client';

import { twMerge } from '@/lib/twMerge';
import { type MouseEvent, useState } from 'react';
import LetsCareerMark from './LetsCareerMark';
import OgonggoLogo from './OgonggoLogo';
import { OGONGGO_WEB_HOME, ogonggoWebHref } from './ogonggoHref';

const OGONGGO_BLUE = 'text-[#4A76FF]';

interface Props {
  size: 'desktop' | 'mobile';
}

/**
 * 렛츠커리어와 오늘의 공고를 오가는 토글. 오공고 헤더의 `ServiceLogoToggle` 과 같은 모양이고,
 * 지금 보는 서비스가 바뀌어 렛츠커리어가 색을 입고 오공고가 회색 링크다. 순서는 양쪽 모두
 * `[렛츠커리어 | 오늘의 공고]` 로 같다.
 *
 * `desktop` 은 헤더 맨 위의 얇은 띠에 글자가 붙은 `[마크 LETS CAREER | 로고 오늘의 공고]` 로 그린다.
 * 홈으로 가는 링크는 그 아래 줄의 로고(`LogoLink`)가 맡으므로 렛츠커리어 쪽은 링크가 아니다.
 * `mobile` 은 상단바의 `LogoLink` 오른쪽에 `| 오공고 로고` 만 붙는다. 상단바 높이는 그대로다.
 *
 * 누르면 떠나기 전까지 토글이 넘어간 모양을 보인다(오공고가 파랗고 렛츠커리어가 연해진다).
 * 같은 탭에서 누르는 순간 로그인을 이어 주는 주소(`ogonggoWebHref`)로 이동한다. `href` 는 토큰 없는
 * 첫 화면이라, 새 탭으로 열면(Cmd·Ctrl·가운데 버튼) 로그인 없이 열린다.
 */
function ServiceToggle({ size }: Props) {
  const [leaving, setLeaving] = useState(false);

  const goToOgonggo = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setLeaving(true);
    window.location.assign(ogonggoWebHref());
  };

  if (size === 'desktop') {
    return (
      <div className="flex items-center gap-3 text-xs font-medium">
        <span
          className={twMerge(
            'text-primary flex items-center gap-1.5 font-semibold transition-colors',
            leaving && 'text-primary-40',
          )}
        >
          <LetsCareerMark className="h-3.5 w-3.5" />
          LETS CAREER
        </span>
        <span className="bg-neutral-70 h-3 w-px" aria-hidden="true" />
        <a
          href={OGONGGO_WEB_HOME}
          aria-label="오늘의 공고로 이동"
          onClick={goToOgonggo}
          className={twMerge(
            'flex items-center gap-1.5 transition-colors',
            leaving ? OGONGGO_BLUE : 'text-neutral-45 hover:text-neutral-40',
          )}
        >
          <OgonggoLogo className="h-3 w-[25px]" />
          오늘의 공고
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="bg-neutral-70 h-[22px] w-px" aria-hidden="true" />
      <a
        href={OGONGGO_WEB_HOME}
        aria-label="오늘의 공고로 이동"
        onClick={goToOgonggo}
      >
        <OgonggoLogo
          className={twMerge(
            'h-[21px] w-[44px] transition-colors',
            leaving ? OGONGGO_BLUE : 'text-neutral-45',
          )}
        />
      </a>
    </div>
  );
}

export default ServiceToggle;
