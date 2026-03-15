# 응집도 (Cohesion)

수정되어야 할 코드가 **항상 같이 수정되는지**를 말한다.
응집도가 높은 코드는 한 부분을 수정해도 의도치 않게 다른 부분에서 오류가 발생하지 않는다.
함께 수정되어야 할 부분이 반드시 함께 수정되도록 구조적으로 뒷받침한다.

---

## 전략 1: 함께 수정되는 파일을 같은 디렉토리에 두기

관련 파일이 흩어져 있으면, 하나를 수정할 때 다른 파일의 수정을 잊기 쉽다.

```
// ❌ 나쁨: 관련 파일이 멀리 흩어져 있음
src/
  components/
    ChallengeApplyForm.tsx      ← 컴포넌트
  hooks/
    useChallengeApply.ts        ← 이 훅은 ChallengeApplyForm에서만 사용
  types/
    challengeApply.ts           ← 이 타입은 위 두 파일에서만 사용
  constants/
    challengeApplyOptions.ts    ← 이 상수는 위 파일들에서만 사용

// ✅ 좋음: 함께 수정되는 파일이 같은 곳에
src/domain/challenge/
  ChallengeApplyForm.tsx
  useChallengeApply.ts
  challengeApply.types.ts
  challengeApplyOptions.ts
```

**판단 기준**: 이 파일을 수정하면 항상 같이 수정해야 하는 파일이 있는가? 있다면 같은 디렉토리에 둔다.

## 전략 2: 매직 넘버 없애기

같은 값이 여러 곳에 리터럴로 흩어져 있으면, 값을 변경할 때 모든 곳을 찾아서 수정해야 한다. 하나라도 놓치면 버그가 된다.

```tsx
// ❌ 나쁨: 3000이 여러 곳에 흩어져 있음
// file1.ts
if (points >= 3000) {
  applyDiscount();
}

// file2.ts
const canUsePoints = user.points >= 3000;

// file3.ts
<p>3,000 포인트 이상이면 사용 가능합니다</p>;

// ✅ 좋음: 하나의 상수로 관리
const MIN_USABLE_POINTS = 3000;

// file1.ts
if (points >= MIN_USABLE_POINTS) {
  applyDiscount();
}

// file2.ts
const canUsePoints = user.points >= MIN_USABLE_POINTS;

// file3.ts
<p>{MIN_USABLE_POINTS.toLocaleString()} 포인트 이상이면 사용 가능합니다</p>;
```

## 전략 3: 폼의 응집도 생각하기

폼은 유효성 검사, 에러 메시지, 필드 정의, 제출 로직이 모두 긴밀하게 연결되어 있다. 이들을 흩어놓으면 필드 하나를 추가/수정할 때 여러 파일을 돌아다녀야 한다.

```tsx
// ❌ 나쁨: 폼 관련 로직이 흩어져 있음
// schema.ts — 유효성 규칙
// constants.ts — 필드 옵션
// ApplyForm.tsx — JSX
// useApplyForm.ts — 제출 로직
// types.ts — 타입 정의
// → "전화번호 필드 추가" 하나에 5개 파일 수정

// ✅ 좋음: 폼 관련 코드가 하나의 디렉토리에 응집
src/domain/challenge/apply-form/
  ApplyForm.tsx           ← 폼 UI
  applyForm.schema.ts     ← 유효성 규칙 + 타입
  applyForm.options.ts    ← 셀렉트 옵션 등 상수
  useApplyForm.ts         ← 폼 상태 + 제출 로직
```

## 전략 4: 상태와 그 상태를 사용하는 로직을 함께 두기

Zustand 스토어의 상태를 여기저기서 직접 접근하면, 상태 구조가 바뀔 때 영향 범위를 파악하기 어렵다.

```tsx
// ❌ 나쁨: 스토어 내부 구조에 직접 의존
// ComponentA.tsx
const count = useStore((s) => s.cart.items.length);

// ComponentB.tsx
const total = useStore((s) => s.cart.items.reduce((sum, i) => sum + i.price, 0));
// → cart 구조가 바뀌면 모든 컴포넌트를 수정해야 함

// ✅ 좋음: 파생 값을 스토어 쪽에서 제공
// store/cartStore.ts
export const useCartCount = () => useStore((s) => s.cart.items.length);
export const useCartTotal = () => useStore((s) => s.cart.items.reduce(...));
// → cart 구조가 바뀌어도 스토어 파일만 수정하면 됨
```

## 전략 5: API 응답 타입과 변환 로직을 함께 두기

API 응답 형태가 바뀌면, 타입 정의와 데이터 변환 로직이 동시에 수정되어야 한다.

```tsx
// ✅ 좋음: API 관련 코드를 함께 관리
// api/challenge.ts
export type ChallengeResponse = { ... };  // API 응답 타입
export type Challenge = { ... };           // 프론트에서 사용하는 타입

export function toChallengeModel(res: ChallengeResponse): Challenge {
  return { ... };  // 변환 로직
}

export async function fetchChallenge(id: number): Promise<Challenge> {
  const res = await api.get<ChallengeResponse>(`/challenge/${id}`);
  return toChallengeModel(res.data);
}
```
