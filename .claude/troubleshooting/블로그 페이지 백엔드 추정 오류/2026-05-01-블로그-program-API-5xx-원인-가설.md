# 블로그 program API 5xx — 원인 가설 및 BE 검증 가이드

> **연관 문서**: [2026-05-01-블로그-program-API-5xx.md](./2026-05-01-블로그-program-API-5xx.md) (현황 보고서)
> **분석 대상**: `workspace/lets-career-server` (Java Spring + QueryDSL)
> **작성일**: 2026-05-01

---

## 결정적 단서

`"서버 내부 오류입니다."`는 **`GlobalExceptionHandler.java:85`의 fallback `Exception.class` handler에서만 출력**된다.

```java
@ExceptionHandler(Exception.class)
protected ResponseEntity<ErrorResponse> handleException(Exception e) {
    log.error(">>> handle: Exception ", e);  // ← CloudWatch에 stack trace 출력
    final ErrorResponse errorBaseResponse = ErrorResponse.of(GlobalErrorCode.INTERNAL_SERVER_ERROR);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorBaseResponse);
}
```

→ 의도된 도메인 예외(`BusinessException` 계열)였다면 별도 handler가 정의된 status code로 응답했을 것.
→ 즉 **개발자가 catch하지 못한 unhandled exception**. 코드 결함 또는 데이터 결함.

`GlobalErrorCode.INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류입니다.")` — 정확히 일치.

---

## 호출 경로 매핑

각 5xx endpoint별 실행 경로와 의심 helper:

### `GET /v1/program/recommend`

```
ProgramV1Controller.getProgramsForCondition()
  └─ programService.getProgramsForRecommend()
     ├─ challengeHelper.findAllChallengeRecommendVos()    ← 단순 쿼리
     ├─ liveHelper.findLiveRecommendVo()                  ← 가설 C 의심
     ├─ vodHelper.findAllVodRecommendVos()                ← VOD 내부화 영향
     └─ reportHelper.findAllReportRecommendVos()          ← 단순 쿼리
```

### `GET /v1/challenge/{id}`

```
ChallengeV1Controller.getChallengeDetail(343|259|258)
  └─ challengeService.getChallengeDetail()
     ├─ challengeHelper.findChallengeDetailByIdOrThrow()  ← 단순 select
     ├─ challengeClassificationHelper.findClassificationDetailVos()
     ├─ challengeAdminClassificationHelper.findAdminClassificationDetailVos()
     ├─ challengePriceHelper.findChallengePriceDetailVos()  ← 가설 A 강력 의심
     └─ faqHelper.findChallengeFaqDetailVos()
```

### `GET /v1/vods/{id}` (VOD-14)

```
VodUserV1Controller.getVodDetailForUser(14)
  └─ vodService.getVodDetailForUser()
     ├─ vodHelper.findVodByIdOrThrow()             ← 없으면 404
     └─ vodPriceHelper.findVodPriceDetailVo()      ← 가설 D, 없으면 404
```

---

## 가설 A 🔴 (가장 강력) — 비정상 QueryDSL 쿼리

**위치**: `ChallengePriceQueryRepositoryImpl.java:33-78`
**호출처**: `GET /v1/challenge/{id}`

```java
@Override
public List<ChallengePriceDetailVo> findChallengePriceDetailVos(Long challengeId) {
    List<ChallengePriceDetailVo> challengePriceDetailVos = jpaQueryFactory
        .select(...)
        .from(challengePrice)
        .where(eqChallengeId(challengeId))
        .fetch();

    Map<Long, List<ChallengeOptionVo>> challengeOptionListMap = jpaQueryFactory
        .select(challengePrice.id,                    // ❌ FROM은 challengePriceOption인데
                Projections.constructor(ChallengeOptionVo.class,
                    challengeOption.id,
                    challengeOption.title,
                    challengeOption.price,
                    challengeOption.discountPrice))
        .from(challengePriceOption)                   // ❌ FROM은 이거
        .join(challengePriceOption.challengeOption, challengeOption)
        .stream()                                      // ❌ JPAQuery에 직접 .stream()
        .collect(Collectors.groupingBy(
                tuple -> tuple.get(0, Long.class),
                Collectors.mapping(tuple -> tuple.get(1, ChallengeOptionVo.class), Collectors.toList())
        ));

    for (ChallengePriceDetailVo vo : challengePriceDetailVos) {
        vo.setChallengeOptionList(challengeOptionListMap.getOrDefault(vo.getPriceId(), Collections.emptyList()));
    }

    return challengePriceDetailVos;
}
```

**의심 포인트 3가지**:

1. **FROM과 다른 entity 참조**: `.from(challengePriceOption)`인데 `.select(challengePrice.id, ...)`. QueryDSL이 묵시적 cross join 또는 invalid SQL 생성 가능.
2. **`.stream()` 직접 호출**: 정석은 `.fetch().stream()` 또는 `.iterate().stream()`. JPAQuery API에 따라 빈 stream 또는 unintended 동작.
3. **`tuple.get(0, Long.class)`로 첫 번째 select 추출**: cross join 결과면 wrong type cast로 ClassCastException 가능.

**throw 가능 예외**: `IllegalArgumentException`, `ClassCastException`, JPA 또는 querydsl 내부 `IllegalStateException`.

---

## 가설 B 🟡 — `LC-3004 ChallengeOption.type` schema drift

**관련 커밋**: `f738a8856` (Apr 22, 2026) `LC-3004-feat ChallengeOption type 추가`

**변경 내용**:

```java
// ChallengeOption.java — 신규 필드 추가
@Convert(converter = ChallengeOptionTypeConverter.class)
private ChallengeOptionType type;
```

```java
// ChallengeOptionType.java — 신규 enum
public enum ChallengeOptionType implements EnumField {
    WRITTEN_FEEDBACK(1, "서면 피드백"),
    LIVE_FEEDBACK(2, " 라이브 피드백");
}
```

**Converter 동작** (`EnumValueUtils.toEntityCode`):

```java
public static <T extends Enum<T> & EnumField> T toEntityCode(Class<T> enumClass, Integer dbCode) {
    if (dbCode == null) return null;       // ✅ 안전
    if (dbCode == -1 || dbCode == 0) return null;  // ✅ 안전
    return EnumSet.allOf(enumClass).stream()
            .filter(e -> e.getCode().equals(dbCode))
            .findAny()
            .orElseThrow(() -> new InvalidValueException(INVALID_ENUM_CODE));  // ❌ enum 정의 외 → throw
}
```

**시나리오**:
- 마이그레이션 후 기존 row의 `challenge_option.type`이 `1` 또는 `2`가 아닌 임의 값(예: 3, 4 같은 garbage)이거나
- 마이그레이션이 default value를 박지 않아 일부 row가 NULL이 아닌 unexpected 값

**throw**: `InvalidValueException(INVALID_ENUM_CODE)` — `BusinessException` 상속이라 정상이라면 별도 status code 응답해야 하지만, **Hibernate의 entity hydration 단계에서 throw되면 wrapping되어 unhandled로 fallback 가능**.

---

## 가설 C 🟢 — Live recommend의 안티패턴 (throw는 안 함)

**위치**: `LiveQueryRepositoryImpl.java:297-304`

```java
private OrderSpecifier<?> orderByRecommendCondition() {
    LocalDateTime now = LocalDateTime.now();
    BooleanExpression isRecruiting = liveRecruiting(now);
    if(isRecruiting.toString().contains("true")) {  // ← 안티패턴
        return new OrderSpecifier<>(Order.ASC, live.deadline);
    }
    return new OrderSpecifier<>(Order.DESC, live.createDate);
}
```

QueryDSL `BooleanExpression.toString()`은 SQL 표현 트리를 직렬화. 실제 데이터에 의존하지 않음.
→ `"true"` 문자열 포함 여부는 결정적이지 않으며 **항상 else 분기로 흐름**.

**의도와 어긋나는 코드이지만 직접 throw는 안 함.** 현재 5xx의 직접 원인은 아니지만 별도 fix 필요.

---

## 가설 D 🟢 — VOD-14 = 데이터 결손 (500 아닌 404)

**위치**: `VodPriceHelper.java:34-37`

```java
public VodPriceDetailVo findVodPriceDetailVo(Long vodId) {
    return vodPriceRepository.findVodPriceDetailVo(vodId)
            .orElseThrow(() -> new EntityNotFoundException(PriceErrorCode.VOD_PRICE_NOT_FOUND));
}
```

VOD-14에 대한 `vod_price` row가 없으면 `EntityNotFoundException` → `BusinessException` handler가 정의된 status (404)로 응답.

**클라이언트 측 손실**: `fetchPublicVodData`(`apps/web/src/api/program.ts:519`)가:

```ts
if (!res.ok) {
  throw new Error('VOD 상세 조회에 실패했습니다.');  // ← status 정보 미보존
}
```

→ Sentry에서 `httpStatus` 태그 없이 `error` level로 분류되어 `warning` 격하 안 됨.

**원인**: BE의 데이터 결손 (vod 14의 vod_price row 부재). 또는 VOD 내부화(`409d76fd`) 마이그레이션 미완.

---

## BE 검증 가이드

### 1. CloudWatch 로그 검색

해결 도착의 가장 빠른 길 — application 로그에서:

```
>>> handle: Exception
```

이 메시지 직후의 stack trace 첫 application frame이 정확한 throw 지점.

기간: 2026-05-01 06:17 UTC (KST 15:17) 부터.

### 2. DB 직접 점검 SQL

```sql
-- 가설 B 검증: ChallengeOption.type 컬럼의 invalid 값
SELECT id, type, COUNT(*) AS cnt
FROM challenge_option
GROUP BY type;
-- 기대: type IN (1, 2, NULL)만 있어야 함

SELECT id, type FROM challenge_option
WHERE type IS NOT NULL AND type NOT IN (1, 2);
-- 기대: 0 rows

-- 가설 A 검증: challenge_price_option orphan row
SELECT cpo.id, cpo.challenge_price_id, cpo.challenge_option_id
FROM challenge_price_option cpo
LEFT JOIN challenge_option co ON cpo.challenge_option_id = co.id
WHERE co.id IS NULL;
-- 기대: 0 rows

SELECT cpo.id, cpo.challenge_price_id, cpo.challenge_option_id
FROM challenge_price_option cpo
LEFT JOIN challenge_price cp ON cpo.challenge_price_id = cp.id
WHERE cp.id IS NULL;
-- 기대: 0 rows

-- 가설 D 검증: VOD-14 데이터 결손
SELECT v.id AS vod_id, vp.id AS vod_price_id, vp.vod_id AS price_vod_id
FROM vod v LEFT JOIN vod_price vp ON v.id = vp.vod_id
WHERE v.id = 14;
-- 기대: vod_price_id IS NOT NULL

-- 챌린지 343, 259, 258 상태
SELECT c.id, c.title, c.challenge_type
FROM challenge c WHERE c.id IN (343, 259, 258);
-- 기대: 3 rows, challenge_type 모두 enum 정의 내 값(1~10)

-- 챌린지 343, 259, 258의 challenge_price 관계
SELECT cp.id, cp.challenge_id, cp.title
FROM challenge_price cp
WHERE cp.challenge_id IN (343, 259, 258);
```

---

## 가설별 권장 fix

| 가설 | Fix 방안 | 작업량 |
|---|---|---|
| **A** | `findChallengePriceDetailVos`의 두 번째 쿼리를 `.fetch()`로 명시 + FROM/JOIN 정합성 확보 | 중 (테스트 추가 권장) |
| **B** | `ChallengeOption.type` 컬럼에 default value 마이그레이션 + `EnumValueUtils.toEntityCode`에 fallback (unknown code면 null 반환) | 소~중 |
| **C** | `liveRecruiting(now).toString()` 패턴 제거 — recruiting 여부는 별도 service 메서드로 DB 조회 | 소 |
| **D** | VOD-14의 `vod_price` row 생성 또는 VOD 14 자체 정리. 클라이언트 측 fix는 별개 (`fetchPublicVodData`가 status 보존하도록) | 소 (데이터 작업) |

---

## 정리: 우선순위

CloudWatch 로그 1건만 보면 가설 A/B/C 중 어느 게 실제 원인인지 즉시 확정 가능합니다.
**먼저 로그 확인 → 가설 좁히기 → fix 진행** 순서가 가장 효율적입니다.

DB 점검은 병렬로 진행 가능 (BE/SRE 파트 독립).
