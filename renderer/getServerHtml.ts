import { escapeInject } from 'vike/server';

export default function getServerHtml({
  pageHtml,
  title = '렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요',
  description = '커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어',
  keywords = '렛츠커리어, 렛츠인턴, 챌린지, 인턴, 신입, 취업, 취업준비, 취뽀, 인턴합격, 신입합격, 서류합격, 면접합격',
  image = 'https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png',
  url = 'https://www.letscareer.co.kr',
}: {
  pageHtml: string | { _escaped: string };
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}) {
  return escapeInject`
  <!doctype html>
 <html lang="ko">
   <head>
     <!-- Google Tag Manager -->
     <script>
       (function (w, d, s, l, i) {
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
       })(window, document, 'script', 'dataLayer', 'GTM-NX4BG8CV');
     </script>
     <!-- End Google Tag Manager -->
    <!-- Kakao Javascript -->
    <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4" crossorigin="anonymous"></script>
    <!-- Kakao Javascript End -->
     <!-- SEO Start -->
     <meta name="robots" content="index,follow" data-react-helmet="true" />
     <meta
       property="og:site_name"
       content="렛츠커리어"
       data-react-helmet="true"
     />
     <title>${title}</title>
     <link rel="canonical" href="${url}" data-react-helmet="true" />
     <meta
       data-react-helmet="true"
       name="description"
       content="${description}"
     />
     <meta
       data-react-helmet="true"
       name="keywords"
       content="${keywords}"
     />
     <meta
       data-react-helmet="true"
       property="og:title"
       content="${title}"
     />
     <meta
       data-react-helmet="true"
       property="og:description"
       content="${description}"
     />
     <meta
       data-react-helmet="true"
       property="twitter:title"
       content="${title}"
     />
     <meta
       data-react-helmet="true"
       property="twitter:description"
       content="${description}"
     />
     <meta
       data-react-helmet="true"
       property="og:image"
       content="${image}"
     />
     <meta
       data-react-helmet="true"
       property="og:url"
       content="${url}"
     />
     <meta property="og:locale" content="ko-KR" />
     <!-- TODO: og:type, product, twitter:site, twitter:creator, keywords, price 관련된 것, product 관련된 것 등 채워넣기 -->
     <!-- SEO End -->
 
     <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
     <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
     <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
     <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
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
     <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
     <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
     <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
     <!--
       manifest.json provides metadata used when your web app is installed on a
       user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
     -->
     <link rel="manifest" href="/manifest.json" />
     <meta name="msapplication-TileColor" content="#ffffff" />
     <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
     <meta
       name="viewport"
       content="width=device-width, user-scalable=no, maximum-scale=1, initial-scale=1"
     />
     <meta name="theme-color" content="#ffffff" />
 
     <meta charset="utf-8" />
     <link
       rel="sitemap"
       type="application/xml"
       title="Sitemap"
       href="/sitemap.xml"
     />
     <meta
       name="naver-site-verification"
       content="15caf82243b739e694f52cc6a5527956db0cd4a0"
     />
 
     <link
       rel="stylesheet"
       href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
     />
   </head>
 
   <body>
     <!-- Google Tag Manager (noscript) -->
     <noscript
       ><iframe
         src="https://www.googletagmanager.com/ns.html?id=GTM-NX4BG8CV"
         height="0"
         width="0"
         style="display: none; visibility: hidden"
       ></iframe
     ></noscript>
     <!-- End Google Tag Manager (noscript) -->
     <noscript>You need to enable JavaScript to run this app.</noscript>
     <div id="root">${pageHtml}</div>
     <div id="modal"></div>
     <!--
       This HTML file is a template.
       If you open it directly in the browser, you will see an empty page.
 
       You can add webfonts, meta tags, or analytics to this file.
       The build step will place the bundled scripts into the <body> tag.
 
       To begin the development, run \`npm start\` or \`yarn start\`.
       To create a production bundle, use \`npm run build\` or \`yarn build\`.
     -->
   </body>
 </html>
 `;
}
