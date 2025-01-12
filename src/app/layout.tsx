/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/next-script-for-ga */

import type { Metadata } from 'next';
import '../index.css';
import '../styles/apply.scss';
import '../styles/card.scss';
import '../styles/github-markdown-light.css';
import '../styles/modal.scss';
import '../styles/mypage.scss';

export const metadata: Metadata = {
  title: '렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요',
  description:
    '커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어',
  keywords:
    '렛츠커리어, letscareer, 렛츠인턴, 챌린지, 인턴, 신입, 취업, 취업준비, 취뽀, 인턴합격, 신입합격, 서류합격, 면접합격',
  // TODO: 채워넣기
  icons: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: ` (function (w, d, s, l, i) {
         w[l] = w[l] || [];
         w[l].push({
           'gtm.start': new Date().getTime(),
           event: 'gtm.js',
         });
         var f = d.getElementsByTagName(s)[0],
           j = d.createElement(s),
           dl = l != 'dataLayer' ? '&l=' + l : '';
         j.async = true;
         j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
         f.parentNode.insertBefore(j, f);
       })(window, document, 'script', 'dataLayer', 'GTM-NX4BG8CV');`,
          }}
        ></script>
        {/* <!-- End Google Tag Manager -->
    <!-- Kakao Javascript --> */}
        <script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
          crossOrigin="anonymous"
        ></script>
        {/* <!-- Kakao Javascript End --> */}
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
