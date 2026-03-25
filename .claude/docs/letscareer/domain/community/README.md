# 커뮤니티 도메인

## 개요

렛츠커리어의 카카오 오픈톡방과 인스타그램 채널을 소개하고 참여를 유도하는 랜딩 페이지.

- **라우트**: `/community`
- **GNB 위치**: 상단 1단 메뉴 (`GlobalNavTopBar.tsx`, `NavBar.tsx`)

## 폴더 구조

```
src/app/(user)/community/
  └── page.tsx                         # 라우팅 + SEO 메타데이터만

src/domain/community/
  ├── CommunityScreen.tsx              # 메인 스크린 (섹션 조합)
  ├── sections/
  │   ├── HeroSection.tsx              # 히어로 (kicker + 제목 + 칩)
  │   ├── KakaoSection.tsx             # 카카오 오픈톡방 섹션
  │   └── InstagramSection.tsx         # 인스타그램 섹션
  ├── components/
  │   ├── QnaChatCard.tsx              # QNA 톡방 카드 (쥬디/레오)
  │   ├── OgongoBlock.tsx              # 오공고 톡방 블록
  │   ├── JobCategoryCard.tsx          # 직무별 카드 (기획/HR/세일즈/마케팅)
  │   ├── InstagramCard.tsx            # 인스타그램 채널 카드
  │   └── ChatPreview.tsx              # 오공고 채팅 캡쳐 미리보기 (클릭 모달)
  ├── data/
  │   ├── hero.ts                      # heroChips
  │   ├── kakao.ts                     # KakaoRoom 타입 + kakaoRooms
  │   ├── ogonggo.ts                   # OgonggoJob 타입 + ogonggoJobs
  │   └── instagram.ts                 # InstagramChannel 타입 + instagramChannels
  └── images/
      ├── community-stats.png          # 히어로 커뮤니티 현황 이미지
      ├── chat-*.jpg                   # 오공고 톡방 채팅 캡쳐 (4장)
      ├── instagram-official/          # 공식 인스타 썸네일 6장 + profile.jpg
      ├── instagram-job/               # 오공고 인스타 썸네일 6장 + profile.jpg
      └── instagram-qna/              # QNA 인스타 썸네일 6장 + profile.jpg
```

## 페이지 구성

### 히어로 섹션 (`HeroSection`)
- kicker: "렛츠커리어 커뮤니티" (primary-90)
- 제목: "막막하고 외로운 취준, 함께라면 달라집니다" (shine-text 강조)
- 칩 3개 (rounded-full, 데스크탑 수평 / 모바일 수직)
- 커뮤니티 현황 이미지 (4.6만명+ 팔로워, 월 2만명+ 방문자, 7,000명+ 톡방 참여)
- 배경: `#F7F9FF`

### 카카오 섹션 (`KakaoSection`)
- 섹션 kicker에 카카오톡 로고 (`kakao-circle.svg`) 표시
- **QNA 톡방 카드** 2개 (데스크탑 2열, 모바일 1열)
  - 쥬디의 취업 QNA방
  - 레오 멘토의 하드스킬 QNA방
- **오공고 블록** (`OgongoBlock`)
  - 무료 자료 배너
  - 직무별 카드 4개 (데스크탑 4열, 모바일 2x2)
  - 채팅 캡쳐 미리보기 (`ChatPreview`) — 클릭 시 모달로 전체 이미지 표시

### 인스타그램 섹션 (`InstagramSection`)
- 섹션 kicker에 인스타그램 로고 (`instagram.svg`) 표시
- 배경: `#F7F9FF` (히어로와 교차)
- 인스타그램 카드 3개 (데스크탑 3열, 모바일 1열)
  - 렛츠커리어 공식, 오공고, QNA
  - 각 채널별 프로필 이미지 + 썸네일 6개 (데스크탑 3x2 그리드, 모바일 가로 스크롤)

## 디자인 컨벤션

B2B 랜딩 페이지와 동일한 디자인 시스템 적용:

| 항목 | 값 |
|---|---|
| 섹션 패딩 | `py-16 md:py-32` |
| 섹션 배경 교차 | white ↔ `#F7F9FF` |
| kicker | `text-xsmall16 font-medium text-primary-90` |
| 제목 (h2) | `text-[26px] md:text-[40px] font-bold` |
| 설명 | `text-xsmall14 md:text-small20 text-neutral-40` |
| 강조 텍스트 | shine-text 그라디언트 애니메이션 |
| 액센트 컬러 | `primary-90` (배지, 태그, 아바타 배경, 버튼) |
| CTA 버튼 | `bg-neutral-900` (메인), `bg-primary-90` (보조) |
| 애니메이션 | `motion/react` whileInView fade-in-up |
| 최대 너비 | `mw-1180` |

## 데이터 관리

데이터는 `data/` 폴더에 섹션별로 분리:

- **hero.ts** — 히어로 칩 텍스트
- **kakao.ts** — QNA 톡방 데이터 (이름, 호스트, 태그, 설명, 링크, 안내문구)
- **ogonggo.ts** — 오공고 직무별 카드 데이터 + 사이트 링크
- **instagram.ts** — 인스타그램 채널 데이터 + 썸네일 이미지 배열

외부 링크(카카오톡, 오공고, 인스타그램)는 각 데이터 파일 내에서 상수로 관리.

## 수정된 공통 파일

| 파일 | 변경 내용 |
|---|---|
| `src/common/layout/header/GlobalNavTopBar.tsx` | 커뮤니티 외부 링크(oopy.io) → `/community` |
| `src/common/layout/header/NavBar.tsx` | 사이드 메뉴 커뮤니티 링크 → `/community` |

## TODO

- [x] ~~인스타그램 썸네일 실제 이미지로 교체~~
- [x] ~~카카오톡 오픈채팅 링크 실제 URL로 교체~~
- [x] ~~인스타그램 프로필 이미지 추가~~
- [x] ~~섹션 헤더에 플랫폼 로고 추가~~
- [x] ~~커뮤니티 현황 이미지 추가~~
- [ ] SEO title/description 마케터 확인 후 확정
- [ ] OG 이미지 (`opengraph-image.png`) 디자인 후 추가
