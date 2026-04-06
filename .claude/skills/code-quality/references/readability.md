# 가독성 (Readability)

코드가 읽기 쉬운 정도. 코드를 변경하려면 먼저 어떤 동작을 하는지 이해할 수 있어야 한다.
읽기 좋은 코드는 **한 번에 머릿속에서 고려하는 맥락이 적고, 위에서 아래로 자연스럽게 이어진다.**

---

## 전략 1: 같이 실행되지 않는 코드 분리하기

조건에 따라 실행되는 코드가 다르다면 분리해야 한다. 하나의 함수/컴포넌트에 여러 분기가 합쳐져 있으면 읽는 사람이 모든 분기를 머릿속에 올려놔야 한다.

```tsx
// ❌ 나쁨: 로그인/비로그인 로직이 하나에 합쳐져 있음
function UserProfile({ user }: { user: User | null }) {
  if (!user) {
    return (
      <div>
        <h2>로그인이 필요합니다</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div>
      <h2>{user.name}님의 프로필</h2>
      <ProfileDetails user={user} />
      <ChallengeHistory userId={user.id} />
    </div>
  );
}

// ✅ 좋음: 각 상태를 별도 컴포넌트로 분리
function UserProfile({ user }: { user: User | null }) {
  if (!user) return <LoginPrompt />;
  return <ProfileView user={user} />;
}
```

## 전략 2: 구현 상세 추상화하기

"어떻게(how)" 하는지를 감추고 "무엇을(what)" 하는지만 드러낸다. 읽는 사람이 세부 구현을 알 필요 없는 경우 함수로 추출한다.

```tsx
// ❌ 나쁨: 가격 계산 로직이 그대로 노출
const finalPrice =
  price - (coupon ? coupon.discount : 0) - (point > 1000 ? point : 0);
const displayPrice = finalPrice < 0 ? 0 : finalPrice;

// ✅ 좋음: 무엇을 하는지만 드러남
const displayPrice = calculateFinalPrice({ price, coupon, point });
```

## 전략 3: 로직 종류에 따라 합쳐진 함수 쪼개기

하나의 함수가 데이터 가공, 유효성 검사, API 호출을 모두 하고 있다면 쪼갠다.

```tsx
// ❌ 나쁨: 한 함수에서 너무 많은 일을 함
async function submitApplication(formData: FormData) {
  // 유효성 검사
  if (!formData.name) throw new Error('이름을 입력하세요');
  if (!formData.email.includes('@')) throw new Error('이메일 형식이 잘못됐습니다');

  // 데이터 가공
  const payload = {
    name: formData.name.trim(),
    email: formData.email.toLowerCase(),
    phone: formData.phone.replace(/-/g, ''),
  };

  // API 호출
  const res = await fetch('/api/application', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ✅ 좋음: 역할별로 분리
function validateApplication(formData: FormData) { ... }
function formatApplicationPayload(formData: FormData) { ... }
async function createApplication(payload: ApplicationPayload) { ... }

async function submitApplication(formData: FormData) {
  validateApplication(formData);
  const payload = formatApplicationPayload(formData);
  return createApplication(payload);
}
```

## 전략 4: 복잡한 조건에 이름 붙이기

복잡한 조건문은 읽는 사람이 조건의 의미를 해석해야 한다. 변수로 이름을 붙이면 의도가 명확해진다.

```tsx
// ❌ 나쁨: 이 조건이 뭔지 해석해야 함
if (
  challenge.deadline > new Date() &&
  challenge.participantCount < challenge.maxParticipants &&
  user.applicationStatus !== 'APPLIED'
) {
  showApplyButton();
}

// ✅ 좋음: 조건의 의미가 명확
const isBeforeDeadline = challenge.deadline > new Date();
const hasAvailableSlot = challenge.participantCount < challenge.maxParticipants;
const hasNotApplied = user.applicationStatus !== 'APPLIED';
const canApply = isBeforeDeadline && hasAvailableSlot && hasNotApplied;

if (canApply) {
  showApplyButton();
}
```

## 전략 5: 매직 넘버에 이름 붙이기

의미를 알 수 없는 숫자/문자열 리터럴은 상수로 추출한다.

```tsx
// ❌ 나쁨
if (password.length < 8) { ... }
if (status === 3) { ... }

// ✅ 좋음
const MIN_PASSWORD_LENGTH = 8;
const REPORT_STATUS_COMPLETED = 3;

if (password.length < MIN_PASSWORD_LENGTH) { ... }
if (status === REPORT_STATUS_COMPLETED) { ... }
```

## 전략 6: 시점 이동 줄이기

코드를 읽다가 다른 파일이나 함수로 점프해야 하는 횟수를 줄인다. 관련 코드가 가까이 있을수록 좋다.

```tsx
// ❌ 나쁨: 이벤트 핸들러 정의가 JSX와 멀리 떨어져 있음
function ChallengeCard({ challenge }: Props) {
  const router = useRouter();
  const { mutate } = useApplyChallenge();
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => { ... };  // 20줄
  const handleShare = () => { ... };  // 15줄
  const handleBookmark = () => { ... }; // 10줄

  // ... 여기까지 50줄 이상 스크롤해야 JSX가 나옴
  return ( ... );
}

// ✅ 좋음: 핸들러를 커스텀 훅으로 추출하거나, 간단하면 인라인으로
function ChallengeCard({ challenge }: Props) {
  const { handleApply, handleShare, handleBookmark } = useChallengeActions(challenge);

  return ( ... );
}
```

## 전략 7: 삼항 연산자 단순하게 하기

중첩된 삼항 연산자는 읽기 어렵다. 2단 이상 중첩되면 if문이나 early return으로 바꾼다.

```tsx
// ❌ 나쁨: 중첩 삼항
const statusText =
  status === 'PREV'
    ? '모집 예정'
    : status === 'PROCEEDING'
      ? '진행 중'
      : status === 'POST'
        ? '종료'
        : '알 수 없음';

// ✅ 좋음: 맵 또는 함수로 분리
const STATUS_TEXT: Record<string, string> = {
  PREV: '모집 예정',
  PROCEEDING: '진행 중',
  POST: '종료',
};

const statusText = STATUS_TEXT[status] ?? '알 수 없음';
```
