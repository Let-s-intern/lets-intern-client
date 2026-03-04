# 공통 서비스 (Common Services)

렛츠커리어 프로젝트에서 사용되는 API 호출 함수와 유틸리티 서비스들의 사용 가이드입니다.

## 디렉토리 구조

```
src/
├── api/           # API 호출 함수 (React Query 훅)
└── utils/         # 유틸리티 함수
```

---

# API 서비스

## 위치

```
src/api/
├── user/              # 유저 관련 API
│   ├── user.ts
│   └── userSchema.ts
├── challenge/         # 챌린지 관련 API
│   ├── challenge.ts
│   └── challengeSchema.ts
├── program.ts         # 프로그램 API
├── payment/           # 결제 관련 API
├── review/            # 리뷰 관련 API
└── ...
```

## API 패턴

모든 API는 **React Query**를 사용합니다.

### 쿼리 (Query)

데이터 조회 시 사용:

```tsx
import { useUserQuery } from '@/api/user/user';

const MyComponent = () => {
  const { data: user, isLoading, error } = useUserQuery();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생</div>;

  return <div>{user.name}</div>;
};
```

### 뮤테이션 (Mutation)

데이터 변경 시 사용:

```tsx
import { usePatchUser } from '@/api/user/user';

const MyComponent = () => {
  const { mutate, isPending } = usePatchUser(
    () => console.log('성공'),
    (error) => console.error('실패', error)
  );

  const handleUpdate = () => {
    mutate({
      name: '홍길동',
      email: 'hong@example.com',
    });
  };

  return <button onClick={handleUpdate}>업데이트</button>;
};
```

---

## User API

**위치**: `src/api/user/user.ts`

### useUserQuery

현재 로그인한 사용자 정보 조회

#### 파라미터

```typescript
{
  enabled?: boolean;        // 자동 실행 여부
  retry?: boolean | number; // 재시도 설정
}
```

#### 반환값

```typescript
{
  userId: number;
  id: string | null;
  name: string | null;
  email: string | null;
  phoneNum: string | null;
  university: string | null;
  // ... 기타 필드
}
```

#### 사용 예시

```tsx
const { data: user, isLoading } = useUserQuery();
```

---

### usePatchUser

사용자 정보 수정

#### 파라미터

```typescript
(
  successCallback?: () => void,
  errorCallback?: (error: Error) => void
)
```

#### Body

```typescript
{
  name?: string;
  email?: string;
  phoneNum?: string;
  university?: string;
  // ... 기타 필드
}
```

#### 사용 예시

```tsx
const { mutate } = usePatchUser(
  () => alert('수정 완료'),
  (error) => alert('수정 실패')
);

mutate({
  name: '새 이름',
  phoneNum: '010-1234-5678',
});
```

---

### useIsAdminQuery

관리자 여부 확인

```tsx
const { data: isAdmin } = useIsAdminQuery();

if (isAdmin) {
  // 관리자 UI
}
```

---

### useIsMentorQuery

멘토 여부 확인

```tsx
const { data: isMentor } = useIsMentorQuery();
```

---

### useUserAdminQuery

관리자용 사용자 목록 조회

#### 파라미터

```typescript
{
  email?: string;
  name?: string;
  phoneNum?: string;
  university?: string;
  pageable?: {
    page: number;
    size: number;
  };
  // ... 기타 필터
}
```

#### 사용 예시

```tsx
const { data: users } = useUserAdminQuery({
  name: '홍길동',
  pageable: { page: 0, size: 10 },
});
```

---

## Challenge API

**위치**: `src/api/challenge/challenge.ts`

챌린지 관련 API 호출 함수들

---

## Program API

**위치**: `src/api/program.ts`

프로그램 관련 API 호출 함수들

---

## Payment API

**위치**: `src/api/payment/payment.ts`

결제 관련 API 호출 함수들

---

## Review API

**위치**: `src/api/review/review.ts`

리뷰 관련 API 호출 함수들

---

## 기타 API

- **Application**: `src/api/application.ts` - 지원 관련
- **Banner**: `src/api/banner.ts` - 배너 관련
- **Blog**: `src/api/blog/blog.ts` - 블로그 관련
- **Career**: `src/api/career/career.ts` - 커리어 관련
- **Coupon**: `src/api/coupon.ts` - 쿠폰 관련
- **Curation**: `src/api/curation.ts` - 큐레이션 관련
- **Experience**: `src/api/experience/experience.ts` - 경험 관련
- **FAQ**: `src/api/faq.ts` - FAQ 관련
- **File**: `src/api/file.ts` - 파일 업로드 관련
- **Lead**: `src/api/lead.ts` - 리드 관련
- **Mentor**: `src/api/mentor/mentor.ts` - 멘토 관련
- **Mission**: `src/api/mission/mission.ts` - 미션 관련
- **Report**: `src/api/report.ts` - 리포트 관련
- **PresignedUrl**: `src/api/presignedUrl.ts` - S3 업로드 URL

---

# 유틸리티 서비스

## 위치

```
src/utils/
```

---

## Axios 인스턴스

### axios

**위치**: `src/utils/axios.ts`

기본 axios 인스턴스 (v1 API용)

```tsx
import axios from '@/utils/axios';

const response = await axios.get('/user');
```

#### 특징

- 자동 인증 토큰 포함
- baseURL: `process.env.NEXT_PUBLIC_SERVER_API`

---

### axiosV2

**위치**: `src/utils/axiosV2.ts`

v2 API용 axios 인스턴스

```tsx
import axiosV2 from '@/utils/axiosV2';

const response = await axiosV2.get('/admin/user');
```

---

### createAuthorizedAxios

**위치**: `src/utils/createAuthorizedAxios.ts`

인증이 필요한 axios 인스턴스 생성 팩토리

```tsx
import { createAuthorizedAxios } from '@/utils/createAuthorizedAxios';

const customAxios = createAuthorizedAxios({
  baseURL: 'https://api.example.com',
});
```

---

## 스타일 유틸리티

### cn

**위치**: `src/utils/cn.ts`

Tailwind CSS 클래스 병합 유틸리티

```tsx
import { cn } from '@/utils/cn';

const className = cn(
  'base-class',
  isActive && 'active-class',
  'override-class'
);
// "base-class active-class override-class"
```

#### 내부 구현

```tsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- `clsx`: 조건부 클래스 처리
- `twMerge`: Tailwind 충돌 해결

---

## 타이밍 유틸리티

### debounce

**위치**: `src/utils/debounce.ts`

디바운스 함수

```tsx
import debounce from '@/utils/debounce';

const handleSearch = debounce((value: string) => {
  console.log('검색:', value);
}, 300);

// 300ms 후 한 번만 실행
handleSearch('react');
handleSearch('react query'); // 이전 호출 취소
```

---

### throttle

**위치**: `src/utils/throttle.ts`

쓰로틀 함수

```tsx
import throttle from '@/utils/throttle';

const handleScroll = throttle(() => {
  console.log('스크롤 중');
}, 100);

window.addEventListener('scroll', handleScroll);
```

---

## 인증 관련

### token

**위치**: `src/utils/token.ts`

토큰 저장/조회/삭제

```tsx
import { getToken, setToken, removeToken } from '@/utils/token';

// 토큰 저장
setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');

// 토큰 조회
const token = getToken();

// 토큰 삭제
removeToken();
```

---

### auth

**위치**: `src/utils/auth.ts`

인증 관련 유틸리티

---

## 데이터 변환

### convert

**위치**: `src/utils/convert.ts`

데이터 타입 변환 유틸리티

---

### converTypeToText

**위치**: `src/utils/converTypeToText.ts`

타입을 텍스트로 변환

```tsx
import { convertTypeToText } from '@/utils/converTypeToText';

const text = convertTypeToText('CHALLENGE');
// "챌린지"
```

---

### convertTypeToBank

**위치**: `src/utils/convertTypeToBank.ts`

은행 코드를 은행명으로 변환

```tsx
import { convertTypeToBank } from '@/utils/convertTypeToBank';

const bankName = convertTypeToBank('088');
// "신한은행"
```

---

## 날짜 & 시간

### formatDateString

**위치**: `src/utils/formatDateString.ts`

날짜 문자열 포맷팅

```tsx
import { formatDateString } from '@/utils/formatDateString';

const formatted = formatDateString('2024-03-03', 'YYYY.MM.DD');
// "2024.03.03"
```

---

### getChallengeSchedule

**위치**: `src/utils/getChallengeSchedule.ts`

챌린지 스케줄 계산

---

## 가격 계산

### programPrice

**위치**: `src/utils/programPrice.ts`

프로그램 가격 계산

```tsx
import { calculatePrice } from '@/utils/programPrice';

const price = calculatePrice({
  basePrice: 50000,
  discount: 10000,
});
// 40000
```

---

### getChallengeOptionPriceInfo

**위치**: `src/utils/getChallengeOptionPriceInfo.ts`

챌린지 옵션 가격 정보

---

### getRewardAmount

**위치**: `src/utils/getRewardAmount.ts`

리워드 금액 계산

---

## 검증 유틸리티

### valid

**위치**: `src/utils/valid.ts`

유효성 검사 함수들

```tsx
import { isValidEmail, isValidPhoneNumber } from '@/utils/valid';

if (isValidEmail('test@example.com')) {
  // 유효한 이메일
}

if (isValidPhoneNumber('010-1234-5678')) {
  // 유효한 전화번호
}
```

---

### invariant

**위치**: `src/utils/invariant.ts`

불변 조건 검사

```tsx
import invariant from '@/utils/invariant';

invariant(user !== null, 'User must be logged in');
// user가 null이면 에러 발생
```

---

## 파일 관련

### getFileNameFromUrl

**위치**: `src/utils/getFileNameFromUrl.ts`

URL에서 파일명 추출

```tsx
import { getFileNameFromUrl } from '@/utils/getFileNameFromUrl';

const fileName = getFileNameFromUrl(
  'https://example.com/files/document.pdf'
);
// "document.pdf"
```

---

## 네트워크

### network

**위치**: `src/utils/network.ts`

네트워크 상태 확인

---

### client

**위치**: `src/utils/client.ts`

클라이언트 환경 확인

```tsx
import { isClient } from '@/utils/client';

if (isClient()) {
  // 브라우저 환경에서만 실행
  window.localStorage.setItem('key', 'value');
}
```

---

## 기타 유틸리티

### random

**위치**: `src/utils/random.ts`

랜덤 값 생성

```tsx
import { generateRandomId } from '@/utils/random';

const id = generateRandomId();
// "a1b2c3d4"
```

---

### url

**위치**: `src/utils/url.ts`

URL 조작 유틸리티

```tsx
import { buildUrl, parseQueryString } from '@/utils/url';

const url = buildUrl('/programs', { category: 'challenge', page: 1 });
// "/programs?category=challenge&page=1"

const params = parseQueryString('?category=challenge&page=1');
// { category: 'challenge', page: '1' }
```

---

### constants

**위치**: `src/utils/constants.ts`

전역 상수 정의

```tsx
import { API_BASE_URL, MAX_FILE_SIZE } from '@/utils/constants';
```

---

### programConst

**위치**: `src/utils/programConst.ts`

프로그램 관련 상수

---

### tableCellWidthList

**위치**: `src/utils/tableCellWidthList.ts`

테이블 셀 너비 정의

---

## 에러 처리

### sentry

**위치**: `src/utils/sentry.ts`

Sentry 에러 리포팅

```tsx
import { captureException } from '@/utils/sentry';

try {
  // 위험한 작업
} catch (error) {
  captureException(error);
}
```

---

### webhook

**위치**: `src/utils/webhook.ts`

웹훅 관련 유틸리티

---

## 도메인 특화 유틸리티

### experience

**위치**: `src/utils/experience.ts`

경험 관련 유틸리티

---

### career

**위치**: `src/utils/career.ts`

커리어 관련 유틸리티

---

### challengeFilter

**위치**: `src/utils/challengeFilter.ts`

챌린지 필터링

---

## 기타

### dominantColor

**위치**: `src/utils/dominantColor.ts`

이미지의 주요 색상 추출

---

### swipe

**위치**: `src/utils/swipe.ts`

스와이프 제스처 감지

---

### useLayoutEffect

**위치**: `src/utils/useLayoutEffect.ts`

SSR 안전한 useLayoutEffect

```tsx
import useIsomorphicLayoutEffect from '@/utils/useLayoutEffect';

useIsomorphicLayoutEffect(() => {
  // SSR에서는 useEffect로, 클라이언트에서는 useLayoutEffect로 동작
}, []);
```

---

### getSelectedNode

**위치**: `src/utils/getSelectedNode.ts`

Lexical Editor 관련 (선택된 노드 가져오기)

---

### setFloatingElemPosition

**위치**: `src/utils/setFloatingElemPosition.ts`

Floating 요소 위치 설정

---

### setFloatingElemPositionForLinkEditor

**위치**: `src/utils/setFloatingElemPositionForLinkEditor.ts`

링크 에디터용 Floating 위치 설정

---

## 서비스 사용 원칙

### 1. API 호출은 React Query 사용

```tsx
// ✅ Good - React Query 훅 사용
const { data } = useUserQuery();

// ❌ Bad - 직접 axios 호출 (컴포넌트 내)
const fetchUser = async () => {
  const res = await axios.get('/user');
  setUser(res.data);
};
```

### 2. 유틸리티는 순수 함수로

```tsx
// ✅ Good - 순수 함수
export const calculatePrice = (base: number, discount: number) => {
  return base - discount;
};

// ❌ Bad - 부수 효과
let totalPrice = 0;
export const calculatePrice = (base: number, discount: number) => {
  totalPrice = base - discount; // 외부 상태 변경
  return totalPrice;
};
```

### 3. 타입 안전성

```tsx
// ✅ Good - Zod 스키마로 타입 검증
const userSchema = z.object({
  userId: z.number(),
  name: z.string(),
});

export type User = z.infer<typeof userSchema>;

// API 응답 파싱
return userSchema.parse(res.data.data);
```

### 4. 에러 처리

```tsx
// ✅ Good - 콜백으로 에러 처리
const { mutate } = usePatchUser(
  () => console.log('성공'),
  (error) => console.error(error)
);

// ✅ Good - try-catch
try {
  await someAsyncOperation();
} catch (error) {
  captureException(error);
}
```

---

## 새 서비스 추가 시

### API 함수

1. **해당 도메인 디렉토리**에 생성
   ```
   src/api/myDomain/myDomain.ts
   ```

2. **Zod 스키마 정의**
   ```tsx
   // myDomainSchema.ts
   export const myDataSchema = z.object({
     id: z.number(),
     name: z.string(),
   });
   ```

3. **React Query 훅 작성**
   ```tsx
   export const useMyDataQuery = () => {
     return useQuery({
       queryKey: ['myData'],
       queryFn: async () => {
         const res = await axios.get('/my-data');
         return myDataSchema.parse(res.data.data);
       },
     });
   };
   ```

### 유틸리티 함수

1. **`src/utils/` 디렉토리**에 생성

2. **순수 함수로 작성**

3. **타입 정의**
   ```tsx
   export const myUtility = (input: string): string => {
     return input.toUpperCase();
   };
   ```

4. **이 문서에 추가**

---

## 참고 자료

- [React Query 문서](https://tanstack.com/query/latest)
- [Axios 문서](https://axios-http.com/)
- [Zod 문서](https://zod.dev/)
