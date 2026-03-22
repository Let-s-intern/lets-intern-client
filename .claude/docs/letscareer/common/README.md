# 공통 모듈 문서 (Common Modules)

렛츠커리어 프로젝트의 공통 컴포넌트, 훅, 서비스에 대한 통합 가이드입니다.

## 문서 구조

이 디렉토리는 프로젝트 전반에서 재사용되는 공통 모듈들을 문서화합니다:

```
.claude/docs/letscareer/common/
├── README.md          # 이 파일 (개요)
├── components.md      # 공통 컴포넌트 가이드
├── hooks.md           # 공통 훅 가이드
└── services.md        # API & 유틸리티 서비스 가이드
```

---

## 📦 공통 컴포넌트 (Components)

**문서**: [components.md](./components.md)

**위치**: `src/common/`

재사용 가능한 UI 컴포넌트 모음입니다.

### 주요 카테고리

- **Button**: Button, SolidButton, OutlinedButton, ApplyCTA 등
- **Input**: Input (v1/v2), TextArea, LineInput
- **Modal**: BaseModal, AlertModal, WarningModal
- **Layout**: Layout, Header, Footer, NavBar
- **Container**: EmptyContainer, ErrorContainer, LoadingContainer
- **Dropdown**: FilterDropdown, FaqDropdown, OptionDropdown
- **기타**: Badge, CheckBox, DataTable, MobileCarousel 등

### 사용 예시

```tsx
import Button from '@/common/button/Button';
import BaseModal from '@/common/modal/BaseModal';
import Input from '@/common/input/v2/Input';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Input placeholder="이름 입력" />
      <Button onClick={() => setIsOpen(true)}>
        모달 열기
      </Button>
      <BaseModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div>모달 내용</div>
      </BaseModal>
    </>
  );
};
```

### 스타일 컨벤션

- **Tailwind CSS** + **twMerge** 사용
- `className` props로 커스터마이징 가능
- 모든 컴포넌트에 타입 정의

**자세한 내용**: [components.md](./components.md)

---

## 🪝 공통 훅 (Hooks)

**문서**: [hooks.md](./hooks.md)

**위치**: `src/hooks/`

프로젝트 전역에서 사용되는 커스텀 훅 모음입니다.

### 주요 카테고리

- **라이프사이클**: useMounted, useRunOnce
- **스크롤**: useScrollDirection, useScrollFade, useScrollShadow
- **Navigation**: useActiveLink, useValidateUrl, useProgramCategoryNav
- **Form**: useBeforeUnloadWarning, useUnsavedChangesWarning
- **페이지네이션**: usePageableWithSearchParams
- **React Query**: useInvalidateQueries
- **카운터**: useCounter, useDecimalCounter
- **도메인 로직**: useReadItems, useChallengeProgram, useMissionSelection
- **Admin**: useMentorAccessControl, useDeleteProgram
- **Analytics**: useGoogleAnalytics

### 사용 예시

```tsx
import useMounted from '@/hooks/useMounted';
import useScrollDirection from '@/hooks/useScrollDirection';
import { useUserQuery } from '@/api/user/user';

const Header = () => {
  const mounted = useMounted();
  const scrollDirection = useScrollDirection();
  const { data: user } = useUserQuery();

  if (!mounted) return null;

  return (
    <header className={scrollDirection === 'DOWN' ? 'hidden' : 'block'}>
      환영합니다, {user?.name}님
    </header>
  );
};
```

**자세한 내용**: [hooks.md](./hooks.md)

---

## 🔧 공통 서비스 (Services)

**문서**: [services.md](./services.md)

**위치**: `src/api/`, `src/utils/`

API 호출 함수와 유틸리티 서비스 모음입니다.

### API 서비스 (src/api/)

React Query 기반 API 호출:

- **User**: useUserQuery, usePatchUser, useIsAdminQuery
- **Challenge**: 챌린지 관련 API
- **Program**: 프로그램 관련 API
- **Payment**: 결제 관련 API
- **Review**: 리뷰 관련 API
- 기타: Application, Banner, Blog, Career, Coupon 등

### 유틸리티 서비스 (src/utils/)

순수 함수형 유틸리티:

- **Axios**: axios, axiosV2, createAuthorizedAxios
- **스타일**: cn (Tailwind 클래스 병합)
- **타이밍**: debounce, throttle
- **인증**: token, auth
- **변환**: convert, converTypeToText, convertTypeToBank
- **날짜**: formatDateString, getChallengeSchedule
- **가격**: programPrice, getChallengeOptionPriceInfo
- **검증**: valid, invariant
- **파일**: getFileNameFromUrl
- **기타**: random, url, constants, sentry 등

### 사용 예시

```tsx
import { useUserQuery, usePatchUser } from '@/api/user/user';
import { cn } from '@/utils/cn';
import debounce from '@/utils/debounce';
import { formatDateString } from '@/utils/formatDateString';

const UserProfile = () => {
  const { data: user, isLoading } = useUserQuery();
  const { mutate } = usePatchUser(
    () => alert('수정 완료'),
    (error) => alert('수정 실패')
  );

  const handleSearch = debounce((value: string) => {
    console.log('검색:', value);
  }, 300);

  return (
    <div className={cn('p-4', isLoading && 'opacity-50')}>
      <h1>{user?.name}</h1>
      <p>가입일: {formatDateString(user?.createdAt)}</p>
    </div>
  );
};
```

**자세한 내용**: [services.md](./services.md)

---

## 사용 원칙

### 1. Import 경로

Path alias를 사용하여 절대 경로로 import:

```tsx
// ✅ Good
import Button from '@/common/button/Button';
import useMounted from '@/hooks/useMounted';
import { useUserQuery } from '@/api/user/user';

// ❌ Bad
import Button from '../../../common/button/Button';
```

### 2. 타입 안전성

모든 컴포넌트, 훅, 서비스는 TypeScript로 타입 정의:

```tsx
interface MyComponentProps {
  title: string;
  onClick?: () => void;
}

const MyComponent = ({ title, onClick }: MyComponentProps) => {
  return <button onClick={onClick}>{title}</button>;
};
```

### 3. 컴포넌트 커스터마이징

`className` props를 통해 스타일 커스터마이징:

```tsx
<Input className="w-full mb-4" />
<Button className="bg-red-500">위험한 작업</Button>
```

### 4. 훅 규칙

React 훅 규칙 준수:

```tsx
// ✅ Good - 컴포넌트 최상위
const MyComponent = () => {
  const mounted = useMounted();
  return <div>...</div>;
};

// ❌ Bad - 조건문 안
const MyComponent = () => {
  if (condition) {
    const mounted = useMounted(); // Error!
  }
  return <div>...</div>;
};
```

### 5. API 호출

React Query 훅 사용:

```tsx
// ✅ Good
const { data, isLoading } = useUserQuery();

// ❌ Bad - 직접 axios 호출
useEffect(() => {
  axios.get('/user').then(setUser);
}, []);
```

---

## 새 모듈 추가 시

### 컴포넌트

1. `src/common/{카테고리}/` 디렉토리에 생성
2. Props 인터페이스 정의
3. `className` props 지원
4. [components.md](./components.md)에 문서 추가

### 훅

1. `src/hooks/` 디렉토리에 생성
2. `use`로 시작하는 이름
3. 타입 정의 및 JSDoc 주석
4. [hooks.md](./hooks.md)에 문서 추가

### API 서비스

1. `src/api/{도메인}/` 디렉토리에 생성
2. Zod 스키마 정의
3. React Query 훅 작성
4. [services.md](./services.md)에 문서 추가

### 유틸리티

1. `src/utils/` 디렉토리에 생성
2. 순수 함수로 작성
3. 타입 정의
4. [services.md](./services.md)에 문서 추가

---

## 관련 문서

- [큐레이션 도메인](../domain/curation/README.md) - 큐레이션 기능 아키텍처
- [기술 스택](../../tech-stack/README.md) - 프로젝트 기술 스택
- [Vercel 베스트 프랙티스](../../../skills/vercel-react-best-practices/) - React 최적화 가이드
- [코드 품질](../../../skills/code-quality/) - 코드 품질 기준
- [폴더 구조](../../../skills/folder-structure/) - 프로젝트 구조 규칙

---

## 빠른 참조

| 항목 | 위치 | 문서 |
|-----|------|------|
| 버튼 | `src/common/button/` | [components.md](./components.md#button-컴포넌트) |
| 입력 | `src/common/input/` | [components.md](./components.md#input-컴포넌트) |
| 모달 | `src/common/modal/` | [components.md](./components.md#modal-컴포넌트) |
| 스크롤 훅 | `src/hooks/useScrollDirection.ts` | [hooks.md](./hooks.md#usescrolldirection) |
| 마운트 훅 | `src/hooks/useMounted.ts` | [hooks.md](./hooks.md#usemounted) |
| 유저 API | `src/api/user/user.ts` | [services.md](./services.md#user-api) |
| 스타일 유틸 | `src/utils/cn.ts` | [services.md](./services.md#cn) |
| 디바운스 | `src/utils/debounce.ts` | [services.md](./services.md#debounce) |

---

## 기여 가이드

새로운 공통 모듈을 추가하거나 기존 모듈을 수정할 때:

1. **일관성 유지**: 기존 패턴 따르기
2. **타입 안전성**: TypeScript 타입 정의
3. **재사용성**: 특정 도메인에 종속되지 않게
4. **문서화**: 이 디렉토리의 해당 문서에 추가
5. **테스트**: 가능하면 단위 테스트 작성

---

**마지막 업데이트**: 2026-03-03
