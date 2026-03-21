# 공통 컴포넌트 (src/common)

## 개요

`src/common/` 디렉토리에는 프로젝트 전반에서 재사용되는 공통 UI 컴포넌트가 위치한다.
스타일링은 Tailwind CSS + `twMerge`가 주력이며, 일부 MUI 컴포넌트도 사용한다.

---

## 폴더 구조

```
src/common/
├── alert/           # 알림/경고 모달
├── badge/           # 배지
├── box/             # 체크박스, 원형 박스
├── button/          # 버튼 컴포넌트들
├── carousel/        # 모바일 캐러셀
├── container/       # 빈 상태, 에러 상태 컨테이너
├── dropdown/        # 드롭다운 (필터, FAQ, 옵션)
├── drawer/          # 드로어 관련
├── header/          # 섹션 헤더, 뒤로가기 헤더
├── input/           # 입력 필드 (v1, v2)
├── layout/          # 전체 레이아웃, 네비게이션, 푸터
├── loading/         # 로딩 컨테이너
├── modal/           # 모달
├── placeholder/     # 플레이스홀더
├── price/           # 가격 표시
├── scroll-to-top/   # 상단 스크롤 버튼
├── sheet/           # 바텀 시트
├── table/           # 데이터 테이블
└── (루트 파일들)    # 유틸리티 컴포넌트
```

---

## 컴포넌트 분류

### UI 기본 컴포넌트

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **If** | `If.tsx` | 조건부 렌더링 유틸리티. `condition` prop으로 children 표시 여부 결정 |
| **Break** | `Break.tsx` | 반응형 줄바꿈. breakpoint 이하에서 `<br/>`, 이상에서 공백 |
| **RequiredStar** | `RequiredStar.tsx` | 필수 항목 표시 빨간 별표 (*) |
| **HorizontalRule** | `HorizontalRule.tsx` | 수평 구분선 |
| **HybridLink** | `HybridLink.tsx` | 내부/외부 링크 통합 처리. 외부 URL은 `<a>`, 내부는 Next.js `<Link>` |

### Badge

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **Badge** | `badge/Badge.tsx` | 상태 표시 배지 (`success` / `warning` / `error` / `info`) |

### Button

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **Button** | `button/Button.tsx` | 기본 버튼 (레거시) |
| **BaseButton** | `button/BaseButton.tsx` | 기본 스타일 버튼. `variant`: filled / outlined / point |
| **SolidButton** | `button/SolidButton.tsx` | 채운 버튼. `variant`: primary / secondary, `size`: xs~xl, `icon` 지원 |
| **OutlinedButton** | `button/OutlinedButton.tsx` | 테두리 버튼 |
| **SelectButton** | `button/SelectButton.tsx` | 선택 버튼 |
| **ModalButton** | `button/ModalButton.tsx` | 모달용 버튼 |
| **ApplyCTA** | `button/ApplyCTA.tsx` | 프로그램 신청 CTA. 마감일/시작일 기반 상태 표시, 카운트다운 포함 |

### Input / Form

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **LineInput** | `input/LineInput.tsx` | 라인 스타일 입력 필드. HTML input 속성 그대로 전달 |
| **TextArea** | `input/TextArea.tsx` | 텍스트 영역 입력 |
| **Input v1** | `input/v1/Input.tsx` | 입력 필드 (v1 버전) |
| **Input v2** | `input/v2/Input.tsx` | 입력 필드 (v2 버전) |
| **ControlLabel** | `ControlLabel.tsx` | MUI FormControlLabel 확장. 라디오/체크박스 라벨 (서브텍스트, 오른쪽 슬롯 지원) |

### Box

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **CheckBox** | `box/CheckBox.tsx` | 커스텀 체크박스. `checked`, `disabled`, `showCheckIcon` 지원 |
| **CircularBox** | `box/CircularBox.tsx` | 원형 박스 컴포넌트 |

### Dropdown

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **FilterDropdown** | `dropdown/FilterDropdown.tsx` | 필터 드롭다운. URL 쿼리 파라미터와 연동, `multiSelect` 지원 |
| **FaqDropdown** | `dropdown/FaqDropdown.tsx` | FAQ 아코디언 드롭다운 |
| **OptionDropdown** | `dropdown/OptionDropdown.tsx` | 일반 옵션 드롭다운 |

### Header / Section

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **SectionHeader** | `header/SectionHeader.tsx` | 섹션 제목 헤더 |
| **SectionMainHeader** | `header/SectionMainHeader.tsx` | 섹션 메인 헤더 (큰 제목) |
| **SectionSubHeader** | `header/SectionSubHeader.tsx` | 섹션 서브 헤더 (부제목) |
| **BackHeader** | `header/BackHeader.tsx` | 뒤로가기 버튼 포함 헤더 |
| **MoreHeader** | `header/MoreHeader.tsx` | 더보기 링크 포함 헤더 |
| **Heading2** | `header/Heading2.tsx` | h2 레벨 제목 |

### Modal & Sheet

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **BaseModal** | `modal/BaseModal.tsx` | 기본 모달. `isOpen`, `onClose`, `isLoading` 지원 |
| **AlertModal** | `alert/AlertModal.tsx` | 알림 모달. 제목, 확인/취소 버튼, `disabled` 지원 |
| **WarningModal** | `alert/WarningModal.tsx` | 경고 모달 |
| **ReportSubmitModal** | `modal/ReportSubmitModal.tsx` | 리포트 제출 모달 |
| **BaseBottomSheet** | `sheet/BaseBottomSheet.tsx` | 기본 바텀 시트 |
| **BottomSheet** | `sheet/BottomSheeet.tsx` | 바텀 시트 |
| **ModalOverlay** | `ModalOverlay.tsx` | 모달 배경 오버레이. 클릭 시 onClose |
| **ModalPortal** | `ModalPortal.tsx` | createPortal을 사용한 모달 포탈 |

### Layout

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **Layout** | `layout/Layout.tsx` | 전체 페이지 레이아웃 (NavBar + children + Footer) |
| **ConditionalLayout** | `layout/ConditionalLayout.tsx` | 조건부 레이아웃 |

### Navigation (layout/header/)

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **NavBar** | `layout/header/NavBar.tsx` | 글로벌 네비게이션 바 |
| **GlobalNavItem** | `layout/header/GlobalNavItem.tsx` | 네비 아이템. `active`, `subNavList`, `showDropdownIcon` 지원 |
| **GlobalNavTopBar** | `layout/header/GlobalNavTopBar.tsx` | 네비 상단바 (로고, 로그인, 메뉴 토글) |
| **SideNavContainer** | `layout/header/SideNavContainer.tsx` | 사이드 네비 (모바일 햄버거 메뉴) |
| **SideNavItem** | `layout/header/SideNavItem.tsx` | 사이드 네비 아이템 |
| **SubNavItem** | `layout/header/SubNavItem.tsx` | 서브 네비 아이템 |
| **NavOverlay** | `layout/header/NavOverlay.tsx` | 네비 오버레이 배경 |
| **ExternalNavList** | `layout/header/ExternalNavList.tsx` | 외부 링크 네비 |
| **LoginLink** | `layout/header/LoginLink.tsx` | 로그인 링크 |
| **SignUpLink** | `layout/header/SignUpLink.tsx` | 회원가입 링크 |
| **LogoLink** | `layout/header/LogoLink.tsx` | 로고 링크 |
| **KakaoChannel** | `layout/header/KakaoChannel.tsx` | 카카오 채널 링크 |
| **Promotion** | `layout/header/Promotion.tsx` | 프로모션 배너 |
| **Spacer** | `layout/header/Spacer.tsx` | 네비바 높이만큼 스페이서 |

### Bottom Navigation

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **BottomNavBar** | `layout/BottomNavBar.tsx` | 모바일 하단 네비게이션 |
| **BottomNavBarWithPathname** | `layout/BottomNavBarWithPathname.tsx` | 경로 기반 하단 네비게이션 |

### Footer (layout/footer/)

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **Footer** | `layout/footer/Footer.tsx` | 전체 푸터 |
| **BottomLinkSection** | `layout/footer/BottomLinkSection.tsx` | 푸터 하단 링크 섹션 |
| **MainLink** | `layout/footer/MainLink.tsx` | 푸터 메인 링크 |
| **DocumentLink** | `layout/footer/DocumentLink.tsx` | 약관/문서 링크 |
| **BusinessInfo** | `layout/footer/BusinessInfo.tsx` | 사업자 정보 |
| **CustomerSupport** | `layout/footer/CustomerSupport.tsx` | 고객 지원 정보 |
| **IconLink** | `layout/footer/IconLink.tsx` | SNS 아이콘 링크 |

### Container / State

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **EmptyContainer** | `container/EmptyContainer.tsx` | 데이터 없음 표시. `text` 커스텀 가능 |
| **ErrorContainer** | `container/ErrorContainer.tsx` | 에러 상태 표시 |
| **LoadingContainer** | `loading/LoadingContainer.tsx` | 로딩 상태 표시. `text` 커스텀 가능 |

### Price

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **PriceView** | `price/PriceView.tsx` | 가격 표시 (할인율, 원래가/할인가 포함) |
| **PriceSummary** | `price/PriceSummary.tsx` | 가격 요약 |

### Table

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **DataTable** | `table/DataTable.tsx` | 데이터 테이블. 체크박스 선택, 행 클릭, 확장 기능 지원 |
| **ExpandableCell** | `table/ExpandableCell.tsx` | 확장 가능한 테이블 셀 |

### Carousel & Scroll

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **MobileCarousel** | `carousel/MobileCarousel.tsx` | Swiper 기반 모바일 캐러셀. 제네릭 타입 `items` + `renderItem` 패턴 |
| **ScrollToTop** | `scroll-to-top/ScrollToTop.tsx` | 상단으로 스크롤 버튼 |

### 기타 유틸리티

| 컴포넌트 | 파일 | 역할 |
|---------|------|------|
| **Duration** | `Duration.tsx` | 카운트다운 타이머. deadline 기반 D-day 또는 시:분:초 표시 |
| **ChannelTalkBtn** | `layout/channel/ChannelTalkBtn.tsx` | 채널톡 버튼 |
| **DrawerCloseBtn** | `drawer/DrawerCloseBtn.tsx` | 드로어 닫기 버튼 |
| **PaymentErrorNotification** | `PaymentErrorNotification.tsx` | 결제 오류 알림 |

---

## 주요 패턴

- **스타일**: Tailwind CSS + `twMerge()` 클래스 병합
- **메모이제이션**: `memo()` 활용 성능 최적화
- **포탈**: 모달/시트를 DOM 최상위로 렌더링
- **반응형**: 모바일/데스크톱 구분 처리
- **URL 상태**: FilterDropdown 등에서 쿼리 파라미터 연동
- **MUI 혼용**: ControlLabel 등 일부 컴포넌트에서 MUI 활용
- **TypeScript**: 모든 컴포넌트에 Props 타입 정의
