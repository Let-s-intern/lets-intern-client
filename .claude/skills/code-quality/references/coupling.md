# 결합도 (Coupling)

코드를 수정했을 때의 **영향범위**를 말한다.
영향범위가 적어서, 변경에 따른 범위를 예측할 수 있는 코드가 수정하기 쉬운 코드다.

---

## 전략 1: 책임을 하나씩 관리하기

하나의 컴포넌트/함수가 여러 책임을 갖고 있으면, 한 책임을 수정할 때 다른 책임에도 영향이 간다.

```tsx
// ❌ 나쁨: 하나의 컴포넌트가 데이터 페칭 + 필터링 + 렌더링 모두 담당
function ChallengeList() {
  const [challenges, setChallenges] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/challenges')
      .then((r) => r.json())
      .then(setChallenges);
  }, []);

  const filtered = challenges.filter((c) =>
    filter === 'ALL' ? true : c.type === filter,
  );

  return (
    <div>
      <FilterButtons value={filter} onChange={setFilter} />
      {filtered.map((c) => (
        <div key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <span>{c.price}원</span>
        </div>
      ))}
    </div>
  );
}

// ✅ 좋음: 책임별로 분리
// 데이터 페칭
function useChallengeList() {
  return useQuery({ queryKey: ['challenges'], queryFn: fetchChallenges });
}

// 필터링 로직
function useFilteredChallenges(challenges: Challenge[], filter: string) {
  return useMemo(
    () =>
      filter === 'ALL'
        ? challenges
        : challenges.filter((c) => c.type === filter),
    [challenges, filter],
  );
}

// 렌더링만 담당
function ChallengeList() {
  const { data: challenges } = useChallengeList();
  const [filter, setFilter] = useState('ALL');
  const filtered = useFilteredChallenges(challenges ?? [], filter);

  return (
    <div>
      <FilterButtons value={filter} onChange={setFilter} />
      {filtered.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  );
}
```

## 전략 2: 중복 코드 허용하기

성급한 추상화는 오히려 결합도를 높인다. 두 곳에서 비슷한 코드를 쓴다고 해서 반드시 공통화할 필요는 없다.

```tsx
// ❌ 나쁨: 성급한 추상화로 인한 높은 결합도
// 챌린지와 VOD에서 비슷한 카드 UI를 쓴다고 ProgramCard로 통합
function ProgramCard({ type, data }: Props) {
  // 챌린지와 VOD의 미묘한 차이를 분기 처리
  const title = type === 'challenge' ? data.title : data.vodTitle;
  const price = type === 'challenge' ? formatChallengePrice(data) : formatVodPrice(data);
  const badge = type === 'challenge' ? <ChallengeBadge /> : null;
  // → type이 추가될 때마다 모든 분기에 영향

  return ( ... );
}

// ✅ 좋음: 비슷해 보여도 별도로 유지
function ChallengeCard({ challenge }: Props) {
  return ( ... ); // 챌린지에 맞는 표현
}

function VodCard({ vod }: Props) {
  return ( ... ); // VOD에 맞는 표현
}
```

**공통화 판단 기준**:

- 두 코드가 **같은 이유로 같은 시점에** 수정된다 → 공통화
- 두 코드가 **지금은 비슷하지만 다른 이유로** 수정될 수 있다 → 중복 허용

## 전략 3: Props Drilling 지우기

Props가 여러 단계를 거쳐 전달되면, 중간 컴포넌트들이 불필요하게 결합된다.

```tsx
// ❌ 나쁨: Props Drilling
function ChallengePage({ user }: Props) {
  return <ChallengeContent user={user} />;
}
function ChallengeContent({ user }: Props) {
  return <ChallengeSidebar user={user} />;
}
function ChallengeSidebar({ user }: Props) {
  return <UserBadge name={user.name} />; // 여기서만 user 필요
}
// → user 타입이 바뀌면 중간 컴포넌트 모두 수정해야 함

// ✅ 좋음: 필요한 곳에서 직접 가져오기
function ChallengeSidebar() {
  const user = useUser(); // Zustand, Context, 또는 React Query
  return <UserBadge name={user.name} />;
}
```

## 전략 4: 외부 라이브러리 의존도 줄이기

특정 라이브러리에 직접 의존하는 코드가 프로젝트 전체에 퍼져 있으면, 라이브러리를 교체하기 어렵다.

```tsx
// ❌ 나쁨: dayjs가 프로젝트 전체에 직접 import됨
// ComponentA.tsx
import dayjs from 'dayjs';
dayjs(date).format('YYYY.MM.DD');

// ComponentB.tsx
import dayjs from 'dayjs';
dayjs(date).format('YYYY.MM.DD');

// ✅ 좋음: 유틸로 감싸서 한 곳에서 관리
// utils/date.ts
import dayjs from 'dayjs';
export function formatDate(date: Date | string): string {
  return dayjs(date).format('YYYY.MM.DD');
}

// ComponentA.tsx, ComponentB.tsx
import { formatDate } from '@/utils/date';
formatDate(date);
// → dayjs를 date-fns로 바꿔도 utils/date.ts만 수정하면 됨
```

## 전략 5: 컴포넌트 인터페이스를 좁게 유지하기

Props가 많으면 그만큼 외부에 대한 의존이 크다. 꼭 필요한 것만 받는다.

```tsx
// ❌ 나쁨: 전체 객체를 받음
function ChallengeTitle({ challenge }: { challenge: Challenge }) {
  return <h2>{challenge.title}</h2>;
  // challenge 객체의 다른 필드가 바뀌어도 리렌더링됨
}

// ✅ 좋음: 필요한 것만 받음
function ChallengeTitle({ title }: { title: string }) {
  return <h2>{title}</h2>;
}
```
