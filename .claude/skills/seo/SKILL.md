---
name: seo
description: 렛츠커리어 SEO 가이드. 페이지 메타데이터, Open Graph, JSON-LD, Sitemap, robots.txt, 리다이렉트, Canonical URL 관련 작업 시 자동 활성화. SSR과 CSR 판단 기준도 포함.
---

# SEO 가이드

## SSR vs CSR 판단

검색 엔진 크롤러와 소셜 미디어 봇(카카오톡, 슬랙 등)은 JS를 실행하지 않는다. CSR만으로는 SEO와 링크 미리보기가 동작하지 않는다.

### SSR이 필요한 페이지

- 블로그, 프로그램 상세 등 외부 검색 노출이 필요한 페이지
- 랜딩 페이지 등 유입 목적의 페이지

### SSR이 불필요한 페이지

- 챌린지 대시보드, 결제 페이지 등 내부 비즈니스 페이지
- SSR, 메타데이터 등을 고려하지 않아도 됨

> 판단 주체: 마케터/운영팀

## 메타데이터

### 정적 메타데이터

```tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요',
  description: '커리어 탐색, 서류 준비, 면접 준비까지...',
  openGraph: {
    type: 'website',
    title: '...',
    siteName: '렛츠커리어',
    images: 'OG 이미지 URL',
    url: 'https://www.letscareer.co.kr',
    locale: 'ko_KR',
  },
  alternates: { canonical: 'https://www.letscareer.co.kr' },
};
```

### 동적 메타데이터 (generateMetadata)

URL에 따라 내용이 달라지는 페이지에서 사용한다.

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const blog = await fetchBlogData(id);

  return {
    title: getBlogTitle(blog.blogDetailInfo),
    description: blog.blogDetailInfo.description,
    openGraph: { ... },
    alternates: {
      canonical: getBaseUrlFromServer() + getBlogPathname(blog.blogDetailInfo),
    },
  };
}
```

### 메타데이터 상속

Next.js는 루트부터 페이지까지 자동 병합. 하위에서 같은 필드를 정의하면 상위 값을 덮어쓴다.

## Open Graph

### 필수 속성

```tsx
openGraph: {
  type: 'website',
  title: '페이지 제목',
  description: '페이지 설명',
  url: 'https://www.letscareer.co.kr/page',
  images: [{ url: '이미지 URL' }],
}
```

### 이미지 규격: 1200 x 630px, 1.91:1, PNG/JPG, 8MB 이하

### 디버깅 도구

- Facebook: https://developers.facebook.com/tools/debug/
- 카카오: https://developers.kakao.com/tool/debugger/sharing (캐시 오래 유지 → 수정 후 반드시 초기화)
- Twitter: https://cards-dev.twitter.com/validator
- LinkedIn: https://www.linkedin.com/post-inspector/

## JSON-LD 구조화 데이터

현재 WebSite 스키마만 구현 (`src/app/layout.tsx`). Article(블로그), Course(챌린지) 스키마는 미구현.

## Sitemap

현재 미구현. 마케팅팀이 수기로 색인 등록 중.

## robots.txt

파일: `src/app/robots.txt` — 모든 크롤러에게 전체 허용.
테스트 서버: `NO_INDEX=true` 환경변수로 noindex 처리.

## 리다이렉트

- 301 (영구): SEO 점수가 새 URL로 이전
- 302 (임시): SEO 점수가 원래 URL에 유지
- URL 구조 변경 시 301 사용. www 통합은 Vercel 자동 처리.

## Canonical URL

동일 콘텐츠 여러 URL 접근 가능 시 대표 URL 지정.

## 새 페이지 개발 체크리스트

- [ ] generateMetadata 또는 metadata export 구현
- [ ] title: 페이지 고유 제목 + 사이트명 (50-60자)
- [ ] description: 페이지 내용 요약 (150-160자)
- [ ] canonical URL 설정
- [ ] OG 이미지 설정 (1200x630)
- [ ] View Source로 초기 HTML 확인

정적 페이지(랜딩 등)는 마케터/운영팀으로부터 title, description, OG 이미지를 전달받는다.
