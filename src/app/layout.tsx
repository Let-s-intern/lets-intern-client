/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/next-script-for-ga */

import '../fonts/font.css';
import '../index.css';
import '../styles/apply.scss';
import '../styles/card.scss';
import '../styles/github-markdown-light.css';
import '../styles/modal.scss';
import '../styles/mypage.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: '렛츠커리어',
              url: 'https://www.letscareer.co.kr/',
            }),
          }}
        />
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
        {/*  Google Tag Manager (noscript) --> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NX4BG8CV"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
