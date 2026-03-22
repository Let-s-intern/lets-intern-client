# 공통 훅 (Common Hooks)

렛츠커리어 프로젝트에서 전역적으로 사용되는 커스텀 훅들의 사용 가이드입니다.

## 위치

```
src/hooks/
```

---

## 라이프사이클 & 마운트 관련

### useMounted

**위치**: `src/hooks/useMounted.ts`

컴포넌트가 마운트되었는지 확인하는 훅

#### 반환값

```typescript
boolean  // 마운트 여부
```

#### 사용 예시

```tsx
import useMounted from '@/hooks/useMounted';

const MyComponent = () => {
  const mounted = useMounted();

  if (!mounted) {
    return <div>로딩 중...</div>;
  }

  return <div>마운트 완료!</div>;
};
```

#### 사용처

- SSR/CSR 환경에서 클라이언트 전용 로직 실행 시
- 하이드레이션 불일치 방지
- 브라우저 API 사용 전 체크

---

### useRunOnce

**위치**: `src/hooks/useRunOnce.ts`

특정 함수를 컴포넌트 생명주기 동안 한 번만 실행

#### 사용 예시

```tsx
import useRunOnce from '@/hooks/useRunOnce';

const MyComponent = () => {
  useRunOnce(() => {
    console.log('이 로그는 한 번만 출력됩니다');
    // 초기화 로직
  });

  return <div>...</div>;
};
```

---

## 스크롤 관련

### useScrollDirection

**위치**: `src/hooks/useScrollDirection.ts`

스크롤 방향을 감지하는 훅

#### 파라미터

```typescript
pathname?: string  // 현재 경로 (옵션)
```

#### 반환값

```typescript
'UP' | 'DOWN'  // 스크롤 방향
```

#### 사용 예시

```tsx
import useScrollDirection from '@/hooks/useScrollDirection';
import { usePathname } from 'next/navigation';

const Header = () => {
  const pathname = usePathname();
  const scrollDirection = useScrollDirection(pathname);

  return (
    <header
      className={`transition-transform ${
        scrollDirection === 'DOWN' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      네비게이션 바
    </header>
  );
};
```

#### 주의사항

- 특정 페이지에서만 동작 (`/report/landing`, `/program/challenge` 등)
- pathname 없이도 사용 가능 (모든 페이지에서 동작)

---

### useScrollFade

**위치**: `src/hooks/useScrollFade.ts`

스크롤 시 페이드 효과

#### 사용 예시

```tsx
import useScrollFade from '@/hooks/useScrollFade';

const Hero = () => {
  const fadeRef = useScrollFade();

  return (
    <div ref={fadeRef} className="transition-opacity">
      스크롤하면 페이드됩니다
    </div>
  );
};
```

---

### useScrollShadow

**위치**: `src/hooks/useScrollShadow.ts`

스크롤 시 그림자 효과

---

### useProgramScrollDirectionStyle

**위치**: `src/hooks/useProgramScrollDirectionStyle.ts`

프로그램 페이지용 스크롤 방향 스타일

---

## URL & Navigation 관련

### useValidateUrl

**위치**: `src/hooks/useValidateUrl.ts`

URL 유효성 검사

---

### useActiveLink

**위치**: `src/hooks/useActiveLink.ts`

현재 활성화된 링크 확인

#### 사용 예시

```tsx
import useActiveLink from '@/hooks/useActiveLink';

const NavItem = ({ href, children }) => {
  const isActive = useActiveLink(href);

  return (
    <a
      href={href}
      className={isActive ? 'text-primary' : 'text-gray-500'}
    >
      {children}
    </a>
  );
};
```

---

### useActiveReportNav

**위치**: `src/hooks/useActiveReportNav.ts`

리포트 네비게이션에서 활성 항목 확인

---

### useProgramCategoryNav

**위치**: `src/hooks/useProgramCategoryNav.ts`

프로그램 카테고리 네비게이션

---

### useLatestChallengeRedirect

**위치**: `src/hooks/useLatestChallengeRedirect.ts`

최신 챌린지로 리다이렉트

---

## Form & Validation 관련

### useBeforeUnloadWarning

**위치**: `src/hooks/useBeforeUnloadWarning.ts`

페이지 나가기 전 경고

#### 사용 예시

```tsx
import useBeforeUnloadWarning from '@/hooks/useBeforeUnloadWarning';

const MyForm = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useBeforeUnloadWarning(hasUnsavedChanges);

  return <form>...</form>;
};
```

---

### useUnsavedChangesWarning

**위치**: `src/hooks/useUnsavedChangesWarning.ts`

저장되지 않은 변경사항 경고

---

### useChangeDetectionHook

**위치**: `src/hooks/useChangeDetectionHook.ts`

변경사항 감지

---

## 페이지네이션 관련

### usePageableWithSearchParams

**위치**: `src/hooks/usePageableWithSearchParams.ts`

URL 쿼리 파라미터와 동기화된 페이지네이션

#### 사용 예시

```tsx
import usePageableWithSearchParams from '@/hooks/usePageableWithSearchParams';

const ProgramList = () => {
  const { page, size, setPage, setSize } = usePageableWithSearchParams({
    defaultPage: 0,
    defaultSize: 10,
  });

  return (
    <div>
      <ProgramItems page={page} size={size} />
      <Pagination currentPage={page} onPageChange={setPage} />
    </div>
  );
};
```

---

### usePaginationModelWithSearchParams

**위치**: `src/hooks/usePaginationModelWithSearchParams.ts`

MUI DataGrid 등의 페이지네이션 모델과 URL 동기화

---

## React Query 관련

### useInvalidateQueries

**위치**: `src/hooks/useInvalidateQueries.ts`

여러 쿼리 한 번에 무효화

#### 사용 예시

```tsx
import useInvalidateQueries from '@/hooks/useInvalidateQueries';

const MyComponent = () => {
  const invalidate = useInvalidateQueries();

  const handleUpdate = async () => {
    await updateData();
    invalidate(['users', 'programs', 'reviews']);
  };

  return <button onClick={handleUpdate}>업데이트</button>;
};
```

---

## 카운터 & 애니메이션

### useCounter

**위치**: `src/hooks/useCounter.ts`

숫자 카운터 애니메이션

#### 사용 예시

```tsx
import useCounter from '@/hooks/useCounter';

const Stats = () => {
  const count = useCounter({
    end: 1000,
    duration: 2000,
  });

  return <div>현재 사용자: {count}명</div>;
};
```

---

### useDecimalCounter

**위치**: `src/hooks/useDecimalCounter.ts`

소수점 카운터 애니메이션

---

## 모달 & UI 상태

### useCareerModals

**위치**: `src/hooks/useCareerModals.ts`

커리어 관련 모달 상태 관리

---

### useExperienceSelectModal

**위치**: `src/hooks/useExperienceSelectModal.ts`

경험 선택 모달 상태 관리

---

## 도메인 로직

### useReadItems

**위치**: `src/hooks/useReadItems.ts`

읽은 항목 관리 (로컬스토리지 활용)

#### 사용 예시

```tsx
import useReadItems from '@/hooks/useReadItems';

const ArticleList = () => {
  const { readItems, markAsRead, isRead } = useReadItems('articles');

  return (
    <div>
      {articles.map((article) => (
        <Article
          key={article.id}
          article={article}
          isRead={isRead(article.id)}
          onClick={() => markAsRead(article.id)}
        />
      ))}
    </div>
  );
};
```

---

### useExperienceLevel

**위치**: `src/hooks/useExperienceLevel.ts`

경험 레벨 관리

---

### useChallengeProgram

**위치**: `src/hooks/useChallengeProgram.ts`

챌린지 프로그램 관련 로직

---

### useFirstB2CChallenge

**위치**: `src/hooks/useFirstB2CChallenge.ts`

첫 B2C 챌린지 관련 로직

---

### useFilteredSchedules

**위치**: `src/hooks/useFilteredSchedules.ts`

필터링된 스케줄 목록

---

### useMinDate

**위치**: `src/hooks/useMinDate.ts`

최소 날짜 계산

---

## Mission 관련

### useMissionSelection

**위치**: `src/hooks/useMissionSelection.ts`

미션 선택 로직

---

### useMissionOperation

**위치**: `src/hooks/useMissionOperation.ts`

미션 조작 로직

---

### useMissionCalculation

**위치**: `src/hooks/useMissionCalculation.ts`

미션 계산 로직

---

### useUpdateMissionOption

**위치**: `src/hooks/useUpdateMissionOption.ts`

미션 옵션 업데이트

---

## Review 관련

### useGetActiveReviews

**위치**: `src/hooks/useGetActiveReviews.ts`

활성 리뷰 목록 가져오기

---

### useGetActiveMissionReviews

**위치**: `src/hooks/useGetActiveMissionReviews.ts`

활성 미션 리뷰 목록 가져오기

---

## Admin 관련

### useMentorAccessControl

**위치**: `src/hooks/useMentorAccessControl.ts`

멘토 접근 제어

#### 사용 예시

```tsx
import useMentorAccessControl from '@/hooks/useMentorAccessControl';

const MentorDashboard = () => {
  const { isMentor, loading } = useMentorAccessControl();

  if (loading) return <div>로딩 중...</div>;
  if (!isMentor) return <div>멘토 권한이 필요합니다</div>;

  return <div>멘토 대시보드</div>;
};
```

---

### usePatchVisibleProgram

**위치**: `src/hooks/usePatchVisibleProgram.ts`

프로그램 공개 여부 업데이트

---

### useDeleteProgram

**위치**: `src/hooks/useDeleteProgram.ts`

프로그램 삭제

---

### useDuplicateProgram

**위치**: `src/hooks/useDuplicateProgram.ts`

프로그램 복제

---

## Report & Payment 관련

### useReportProgramInfo

**위치**: `src/hooks/useReportProgramInfo.ts`

리포트 프로그램 정보

---

### useReportPayment

**위치**: `src/hooks/useReportPayment.ts`

리포트 결제 정보

---

## Analytics

### useGoogleAnalytics

**위치**: `src/hooks/useGoogleAnalytics.ts`

Google Analytics 이벤트 추적

#### 사용 예시

```tsx
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';

const ProgramCard = ({ program }) => {
  const { trackEvent } = useGoogleAnalytics();

  const handleClick = () => {
    trackEvent({
      action: 'click',
      category: 'program',
      label: program.title,
    });
  };

  return <div onClick={handleClick}>...</div>;
};
```

---

## 훅 사용 원칙

### 1. 훅 규칙 준수

```tsx
// ✅ Good - 컴포넌트 최상위에서 호출
const MyComponent = () => {
  const mounted = useMounted();
  const scrollDirection = useScrollDirection();

  return <div>...</div>;
};

// ❌ Bad - 조건문 안에서 호출
const MyComponent = () => {
  if (someCondition) {
    const mounted = useMounted(); // Error!
  }
  return <div>...</div>;
};
```

### 2. 의존성 배열 관리

```tsx
// ✅ Good - 모든 의존성 명시
useEffect(() => {
  fetchData(userId);
}, [userId]);

// ❌ Bad - 의존성 누락
useEffect(() => {
  fetchData(userId);
}, []); // Warning!
```

### 3. 커스텀 훅 네이밍

```tsx
// ✅ Good - use로 시작
const useMyCustomHook = () => {
  // ...
};

// ❌ Bad - use 없음
const myCustomHook = () => {
  // ...
};
```

### 4. 반환값 명확히

```tsx
// ✅ Good - 명확한 반환값
const useAuth = () => {
  return {
    user,
    login,
    logout,
    isLoading,
  };
};

// ✅ Good - 배열 반환 (useState 패턴)
const useToggle = (initialValue: boolean) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  return [value, toggle] as const;
};
```

---

## 새 훅 추가 시

1. **`src/hooks/` 디렉토리**에 생성
   ```
   src/hooks/useMyCustomHook.ts
   ```

2. **명확한 네이밍**
   - `use`로 시작
   - 역할이 명확한 이름

3. **타입 정의**
   ```tsx
   interface UseMyHookOptions {
     enabled?: boolean;
   }

   interface UseMyHookReturn {
     data: string;
     isLoading: boolean;
   }

   const useMyHook = (options: UseMyHookOptions): UseMyHookReturn => {
     // ...
   };
   ```

4. **JSDoc 주석**
   ```tsx
   /**
    * 사용자 정보를 가져오는 훅
    * @param userId - 사용자 ID
    * @returns 사용자 데이터와 로딩 상태
    */
   const useUser = (userId: number) => {
     // ...
   };
   ```

5. **이 문서에 추가**

---

## 참고 자료

- [React Hooks 문서](https://react.dev/reference/react)
- [React Query 문서](https://tanstack.com/query/latest)
- [커스텀 훅 패턴](https://react.dev/learn/reusing-logic-with-custom-hooks)
