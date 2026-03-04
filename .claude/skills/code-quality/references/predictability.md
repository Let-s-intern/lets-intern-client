# 예측 가능성 (Predictability)

함께 협업하는 동료들이 함수나 컴포넌트의 동작을 **이름, 파라미터, 반환 값만 보고** 얼마나 예측할 수 있는지.
예측 가능성이 높은 코드는 일관적인 규칙을 따른다.

---

## 전략 1: 이름 겹치지 않게 관리하기

같은 프로젝트 안에서 비슷한 이름이 다른 의미로 쓰이면 혼란스럽다.

```tsx
// ❌ 나쁨: program이 여러 맥락에서 다른 의미
const program = getChallengeProgram(); // 챌린지
const program = getLiveProgram(); // 라이브
const program = getVodProgram(); // VOD
// program이라는 이름만 보면 어떤 타입인지 알 수 없음

// ✅ 좋음: 구체적인 이름 사용
const challengeProgram = getChallengeProgram();
const liveProgram = getLiveProgram();
const vodProgram = getVodProgram();
```

타입 이름도 마찬가지:

```tsx
// ❌ 나쁨
type Info = { ... }; // 무슨 Info?

// ✅ 좋음
type ChallengeDetailInfo = { ... };
type BlogThumbnailInfo = { ... };
```

## 전략 2: 같은 종류의 함수는 반환 타입 통일하기

비슷한 역할을 하는 함수들의 반환 타입이 다르면, 사용하는 쪽에서 매번 반환 타입을 확인해야 한다.

```tsx
// ❌ 나쁨: 비슷한 역할인데 반환 형태가 다름
function getChallengePrice(id: number): number { ... }
function getLivePrice(id: number): { price: number; discount: number } { ... }
function getVodPrice(id: number): string { ... }

// ✅ 좋음: 같은 종류의 함수는 반환 타입 통일
type PriceInfo = { price: number; discount: number; finalPrice: number };

function getChallengePrice(id: number): PriceInfo { ... }
function getLivePrice(id: number): PriceInfo { ... }
function getVodPrice(id: number): PriceInfo { ... }
```

커스텀 훅도 마찬가지:

```tsx
// ❌ 나쁨: 훅마다 반환 형태가 다름
function useChallengeList() {
  return { data, isLoading };
}
function useBlogList() {
  return [data, isLoading, error];
}
function useVodList() {
  return data;
}

// ✅ 좋음: 반환 형태 통일
function useChallengeList() {
  return { data, isLoading, error };
}
function useBlogList() {
  return { data, isLoading, error };
}
function useVodList() {
  return { data, isLoading, error };
}
```

## 전략 3: 숨은 로직 드러내기

함수/컴포넌트 내부에서 이름이나 시그니처에 드러나지 않는 사이드 이펙트가 있으면, 호출하는 쪽에서 예상하지 못한 동작이 발생한다.

```tsx
// ❌ 나쁨: formatDate라는 이름인데 내부에서 로깅까지 함
function formatDate(date: Date): string {
  analytics.track('date_formatted', { date }); // 숨은 사이드 이펙트
  return dayjs(date).format('YYYY.MM.DD');
}

// ✅ 좋음: 이름에 맞는 동작만 수행
function formatDate(date: Date): string {
  return dayjs(date).format('YYYY.MM.DD');
}
```

```tsx
// ❌ 나쁨: 컴포넌트가 렌더링만 할 줄 알았는데 내부에서 API 호출
function PriceDisplay({ programId }: Props) {
  useEffect(() => {
    // 가격을 보여주기만 하는 컴포넌트인 줄 알았는데
    // 렌더링될 때마다 조회수를 올리는 API를 호출
    incrementViewCount(programId);
  }, [programId]);

  return <span>{price}원</span>;
}

// ✅ 좋음: 사이드 이펙트는 상위에서 명시적으로 처리
function PriceDisplay({ price }: Props) {
  return <span>{price}원</span>;
}

// 부모에서 명시적으로
function ProgramDetail({ programId }: Props) {
  useTrackView(programId); // 명시적
  const { price } = useProgramPrice(programId);
  return <PriceDisplay price={price} />;
}
```

## 전략 4: Props 네이밍을 일관적으로

같은 의미의 props가 컴포넌트마다 다른 이름이면 예측하기 어렵다.

```tsx
// ❌ 나쁨: 같은 의미인데 이름이 제각각
<ChallengeCard onPress={handleClick} />
<BlogCard onClick={handleClick} />
<VodCard onTap={handleClick} />

// ✅ 좋음: 같은 의미의 props는 같은 이름
<ChallengeCard onClick={handleClick} />
<BlogCard onClick={handleClick} />
<VodCard onClick={handleClick} />
```

## 전략 5: Boolean props는 is/has/can 접두사

```tsx
// ❌ 나쁨: boolean인지 알기 어려움
<Badge visible />
<Modal close={false} />

// ✅ 좋음
<Badge isVisible />
<Modal isOpen={false} />
```
