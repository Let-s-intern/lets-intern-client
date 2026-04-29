# 공통 컴포넌트 (Common Components)

렛츠커리어 프로젝트에서 재사용 가능한 공통 UI 컴포넌트들의 사용 가이드입니다.

## 위치

web 앱 전용 공통 컴포넌트 위치입니다. 앱 간 공유가 필요한 컴포넌트는 `packages/ui/` (`@letscareer/ui`)에 위치합니다.

```
apps/web/src/common/
├── button/        # 버튼 컴포넌트들
├── input/         # 인풋 컴포넌트들
├── modal/         # 모달 컴포넌트들
├── layout/        # 레이아웃 컴포넌트들
├── header/        # 헤더 컴포넌트들
├── alert/         # 알림 컴포넌트들
├── badge/         # 배지 컴포넌트들
├── box/           # 박스 컴포넌트들
├── dropdown/      # 드롭다운 컴포넌트들
├── container/     # 컨테이너 컴포넌트들
├── loading/       # 로딩 컴포넌트들
├── table/         # 테이블 컴포넌트들
└── ...
```

## 스타일 컨벤션

모든 공통 컴포넌트는:
- **Tailwind CSS** 사용
- **twMerge**로 className 병합
- `className` props를 받아 커스터마이징 가능

---

## Button 컴포넌트

### 기본 버튼 (Button)

**위치**: `apps/web/src/common/button/Button.tsx`

기본적인 버튼 컴포넌트입니다.

#### Props

```typescript
interface ButtonProps {
  to?: string;                    // 클릭 시 이동할 URL (옵션)
  type?: 'button' | 'submit' | 'reset';  // 버튼 타입 (기본: 'button')
  color?: string;                 // 색상 변형 ('white' 등)
  disabled?: boolean;             // 비활성화 여부
  id?: string;                    // HTML id
  className?: string;             // 추가 CSS 클래스
  onClick?: () => void;           // 클릭 핸들러
  children: React.ReactNode;      // 버튼 내용
}
```

#### 사용 예시

```tsx
import Button from '@/common/button/Button';

// 기본 사용
<Button onClick={handleClick}>
  확인
</Button>

// 흰색 버튼
<Button color="white" onClick={handleCancel}>
  취소
</Button>

// 비활성화
<Button disabled>
  제출 불가
</Button>

// Submit 버튼
<Button type="submit">
  폼 제출
</Button>

// URL 이동
<Button to="/programs">
  프로그램 보기
</Button>
```

#### 주의사항

- `to` props 사용 시 `window.location.href`로 이동 (Next.js + React 혼용 환경)
- `disabled`일 때는 `onClick` 무시됨

---

### 기타 버튼들

#### SolidButton
- **위치**: `apps/web/src/common/button/SolidButton.tsx`
- Solid 스타일 버튼

#### OutlinedButton
- **위치**: `apps/web/src/common/button/OutlinedButton.tsx`
- 테두리 스타일 버튼

#### SelectButton
- **위치**: `apps/web/src/common/button/SelectButton.tsx`
- 선택형 버튼

#### ModalButton
- **위치**: `apps/web/src/common/button/ModalButton.tsx`
- 모달용 버튼

#### BaseButton
- **위치**: `apps/web/src/common/button/BaseButton.tsx`
- 기본 버튼 (다른 버튼들의 베이스)

#### ApplyCTA
- **위치**: `apps/web/src/common/button/ApplyCTA.tsx`
- 지원하기 CTA 버튼

---

## Input 컴포넌트

### Input (v2)

**위치**: `apps/web/src/common/input/v2/Input.tsx`

기본 인풋 컴포넌트 (최신 버전)

#### Props

```typescript
// 모든 표준 HTML input 속성 지원
React.InputHTMLAttributes<HTMLInputElement>
```

#### 사용 예시

```tsx
import Input from '@/common/input/v2/Input';

// 기본 사용
<Input
  placeholder="이름을 입력하세요"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>

// 읽기 전용
<Input
  value="홍길동"
  readOnly
/>

// 비활성화
<Input
  placeholder="입력 불가"
  disabled
/>

// 커스텀 스타일
<Input
  className="w-full"
  placeholder="전체 너비"
/>
```

#### 특징

- 기본 스타일: `rounded-md bg-neutral-95 p-3 text-xsmall14`
- `readOnly`일 때 `text-neutral-50` 색상 적용
- `autoComplete="off"` 기본 설정

---

### 기타 Input

#### TextArea
- **위치**: `apps/web/src/common/input/TextArea.tsx`
- 여러 줄 텍스트 입력

#### LineInput
- **위치**: `apps/web/src/common/input/LineInput.tsx`
- 라인 스타일 인풋

#### Input (v1)
- **위치**: `apps/web/src/common/input/v1/Input.tsx`
- 이전 버전 (v2 사용 권장)

---

## Modal 컴포넌트

### BaseModal

**위치**: `apps/web/src/common/modal/BaseModal.tsx`

기본 모달 컴포넌트입니다.

#### Props

```typescript
interface BaseModalProps {
  isOpen: boolean;               // 모달 열림 상태
  onClose: () => void;          // 닫기 핸들러
  children?: React.ReactNode;   // 모달 내용
  className?: string;           // 추가 CSS 클래스
  isLoading?: boolean;          // 로딩 상태
}
```

#### 사용 예시

```tsx
import BaseModal from '@/common/modal/BaseModal';

const [isOpen, setIsOpen] = useState(false);

<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  <div className="p-6">
    <h2>모달 제목</h2>
    <p>모달 내용</p>
  </div>
</BaseModal>
```

#### 특징

- Portal 사용하여 body에 렌더링
- Overlay 클릭 시 닫힘
- 스크롤 자동 제어 (`useControlScroll`)
- `isLoading` props로 로딩 오버레이 표시

---

### 기타 Modal

#### ReportSubmitModal
- **위치**: `apps/web/src/common/modal/ReportSubmitModal.tsx`
- 리포트 제출 모달

#### AlertModal
- **위치**: `apps/web/src/common/alert/AlertModal.tsx`
- 알림 모달

#### WarningModal
- **위치**: `apps/web/src/common/alert/WarningModal.tsx`
- 경고 모달

---

## Layout 컴포넌트

### Layout

**위치**: `apps/web/src/common/layout/Layout.tsx`

페이지 레이아웃 컴포넌트

### ConditionalLayout

**위치**: `apps/web/src/common/layout/ConditionalLayout.tsx`

조건부 레이아웃 컴포넌트

### BottomNavBar

**위치**: `apps/web/src/common/layout/BottomNavBar.tsx`

하단 네비게이션 바

---

## Header 컴포넌트

### BackHeader

**위치**: `apps/web/src/common/header/BackHeader.tsx`

뒤로가기 버튼이 있는 헤더

### SectionHeader

**위치**: `apps/web/src/common/header/SectionHeader.tsx`

섹션 헤더

### SectionMainHeader

**위치**: `apps/web/src/common/header/SectionMainHeader.tsx`

메인 섹션 헤더

### SectionSubHeader

**위치**: `apps/web/src/common/header/SectionSubHeader.tsx`

서브 섹션 헤더

### Heading2

**위치**: `apps/web/src/common/header/Heading2.tsx`

H2 헤딩 컴포넌트

### MoreHeader

**위치**: `apps/web/src/common/header/MoreHeader.tsx`

더보기 헤더

---

## Dropdown 컴포넌트

### FaqDropdown

**위치**: `apps/web/src/common/dropdown/FaqDropdown.tsx`

FAQ 드롭다운

### FilterDropdown

**위치**: `apps/web/src/common/dropdown/FilterDropdown.tsx`

필터 드롭다운

### OptionDropdown

**위치**: `apps/web/src/common/dropdown/OptionDropdown.tsx`

옵션 드롭다운

---

## Container 컴포넌트

### ErrorContainer

**위치**: `apps/web/src/common/container/ErrorContainer.tsx`

에러 상태 컨테이너

### EmptyContainer

**위치**: `apps/web/src/common/container/EmptyContainer.tsx`

빈 상태 컨테이너

### LoadingContainer

**위치**: `apps/web/src/common/loading/LoadingContainer.tsx`

로딩 상태 컨테이너

---

## Badge & Box 컴포넌트

### Badge

**위치**: `apps/web/src/common/badge/Badge.tsx`

뱃지 컴포넌트

### CheckBox

**위치**: `apps/web/src/common/box/CheckBox.tsx`

체크박스

### CircularBox

**위치**: `apps/web/src/common/box/CircularBox.tsx`

원형 박스

---

## Table 컴포넌트

### DataTable

**위치**: `apps/web/src/common/table/DataTable.tsx`

데이터 테이블

### ExpandableCell

**위치**: `apps/web/src/common/table/ExpandableCell.tsx`

확장 가능한 셀

---

## 기타 유틸리티 컴포넌트

### If

**위치**: `apps/web/src/common/If.tsx`

조건부 렌더링 컴포넌트

```tsx
<If condition={isLoggedIn}>
  <UserProfile />
</If>
```

### HybridLink

**위치**: `apps/web/src/common/HybridLink.tsx`

Next.js + React 혼용 링크

### Break

**위치**: `apps/web/src/common/Break.tsx`

줄바꿈 컴포넌트

### HorizontalRule

**위치**: `apps/web/src/common/HorizontalRule.tsx`

수평선 컴포넌트

### Duration

**위치**: `apps/web/src/common/Duration.tsx`

기간 표시 컴포넌트

### ControlLabel

**위치**: `apps/web/src/common/ControlLabel.tsx`

컨트롤 레이블

### RequiredStar

**위치**: `apps/web/src/common/RequiredStar.tsx`

필수 표시 별표

### ModalPortal

**위치**: `apps/web/src/common/ModalPortal.tsx`

모달 포털 (Portal API)

### ModalOverlay

**위치**: `apps/web/src/common/ModalOverlay.tsx`

모달 오버레이 (배경)

### ScrollToTop

**위치**: `apps/web/src/common/scroll-to-top/ScrollToTop.tsx`

스크롤 최상단 이동 버튼

---

## Bottom Sheet 컴포넌트

### BaseBottomSheet

**위치**: `apps/web/src/common/sheet/BaseBottomSheet.tsx`

기본 바텀 시트

### BottomSheet

**위치**: `apps/web/src/common/sheet/BottomSheeet.tsx`

바텀 시트 (타이포 주의)

---

## Price 컴포넌트

### PriceView

**위치**: `apps/web/src/common/price/PriceView.tsx`

가격 표시

### PriceSummary

**위치**: `apps/web/src/common/price/PriceSummary.tsx`

가격 요약

---

## Carousel 컴포넌트

### MobileCarousel

**위치**: `apps/web/src/common/carousel/MobileCarousel.tsx`

모바일 캐러셀

---

## Layout 세부 컴포넌트

### Header 관련

- `GlobalNavTopBar` - 전역 네비게이션 상단 바
- `GlobalNavItem` - 전역 네비게이션 아이템
- `NavBar` - 네비게이션 바
- `NavOverlay` - 네비게이션 오버레이
- `SideNavContainer` - 사이드 네비게이션 컨테이너
- `SideNavItem` - 사이드 네비게이션 아이템
- `SubNavItem` - 서브 네비게이션 아이템
- `LogoLink` - 로고 링크
- `LoginLink` - 로그인 링크
- `SignUpLink` - 회원가입 링크
- `KakaoChannel` - 카카오 채널 버튼
- `Promotion` - 프로모션 배너
- `Spacer` - 스페이서
- `ExternalNavList` - 외부 네비게이션 목록

### Footer 관련

- `Footer` - 푸터
- `BusinessInfo` - 사업자 정보
- `CustomerSupport` - 고객 지원
- `DocumentLink` - 문서 링크
- `IconLink` - 아이콘 링크
- `MainLink` - 메인 링크
- `BottomLinkSection` - 하단 링크 섹션

### Channel 관련

- `ChannelTalkBtn` - 채널톡 버튼

---

## 컴포넌트 사용 원칙

### 1. Import 경로

```tsx
// ✅ Good - Path alias 사용
import Button from '@/common/button/Button';
import BaseModal from '@/common/modal/BaseModal';

// ❌ Bad - 상대 경로
import Button from '../../../common/button/Button';
```

### 2. className 커스터마이징

```tsx
// ✅ Good - className props 활용
<Input className="w-full mb-4" />

// twMerge가 자동으로 충돌 해결
<Button className="bg-red-500">
  {/* 기본 bg-primary가 bg-red-500로 오버라이드됨 */}
</Button>
```

### 3. 타입 안전성

```tsx
// ✅ Good - Props 타입 명시
interface MyFormProps {
  onSubmit: () => void;
}

const MyForm = ({ onSubmit }: MyFormProps) => {
  return (
    <Button type="submit" onClick={onSubmit}>
      제출
    </Button>
  );
};
```

### 4. 접근성

```tsx
// ✅ Good - 의미있는 버튼 텍스트
<Button>프로그램 신청하기</Button>

// ❌ Bad - 모호한 텍스트
<Button>클릭</Button>
```

---

## 새 공통 컴포넌트 추가 시

1. **적절한 카테고리 디렉토리**에 생성
   - 버튼 → `apps/web/src/common/button/`
   - 인풋 → `apps/web/src/common/input/`
   - 모달 → `apps/web/src/common/modal/`

2. **Props 인터페이스 정의**
   ```tsx
   interface MyComponentProps {
     // Props 정의
   }
   ```

3. **className props 지원**
   ```tsx
   const MyComponent = ({ className, ...props }: MyComponentProps) => {
     return <div className={twMerge('base-styles', className)} {...props} />;
   };
   ```

4. **이 문서에 추가**
   - 위치, Props, 사용 예시 포함

---

## 참고 자료

- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [twMerge 문서](https://github.com/dcastil/tailwind-merge)
- 프로젝트 공통 모듈 문서: `.claude/docs/letscareer/common/README.md`
