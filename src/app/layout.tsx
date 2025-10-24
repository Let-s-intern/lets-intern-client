/* eslint-disable @next/next/no-sync-scripts */
/* eslint-disable @next/next/next-script-for-ga */

import { getBaseUrlFromServer } from '@/utils/url';
import { Metadata, Viewport } from 'next';
import '../fonts/font.css';
import '../index.css';
import '../styles/apply.scss';
import '../styles/card.scss';
import '../styles/github-markdown-light.css';
import '../styles/modal.scss';
import '../styles/mypage.scss';

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrlFromServer()),
  other: {
    'naver-site-verification': '15caf82243b739e694f52cc6a5527956db0cd4a0',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  userScalable: false,
  maximumScale: 1,
  initialScale: 1,
  themeColor: '#ffffff',
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

        <meta
          name="naver-site-verification"
          content="15caf82243b739e694f52cc6a5527956db0cd4a0"
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
