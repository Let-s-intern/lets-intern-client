# BE 협업 요청 — 멘토 피드백 화면 개선 3건 (소감 노출 / LIVE 미션 혼입 / 권한 검증)

> 작성일: 2026-06-05
> 컨텍스트: 멘토 마이페이지(`mentor.letscareer.co.kr`) 서면 피드백 모달에서 경험정리형 제출물·유저 소감을 멘토가 확인할 수 있도록 개선하는 작업(LC-3117) 중 발견된 BE 측 선행 과제.
> 관련 PRD: `.claude/tasks/prd-멘토 마이페이지 오류.md` (§4 P1)
> 관련 메모: `.claude/tasks/memos/be-request-feedback-mission-live-type-filtered.md` (피드백 미션 타입 필터 — 같은 뿌리, 아래 #2에서 연결)
> BE 검증 기준: `origin/main` (`git rev-parse origin/main` = `444af521702fff70035dc67a016c8977f65fdd12`, 2026-06-05 fetch)

본 메모는 독립적인 3개 요청을 담는다. 우선순위와 난이도가 다르므로 개별 착수 가능하다.

| # | 요청 | 우선순위 | 변경 규모 |
|---|---|---|---|
| 1 | `FeedbackMissionAttendanceVo`에 `review` 추가 | MEDIUM | projection 1줄 × 3쿼리 + record 필드 1개 |
| 2 | 피드백 미션 타입 필터 일관화 (LIVE 혼입) | MEDIUM | 쿼리 조건 1줄 제거 또는 타입 필드 노출 |
| 3 | `user-experiences` 멘토-멘티 권한 검증 | **HIGH (보안)** | 검증 로직 추가 (배포 전 필수) |

---

## #1. 유저 소감(`review`) 노출 — `FeedbackMissionAttendanceVo`에 `review` 필드 추가

### 증상

멘토가 서면 피드백을 작성할 때, 유저가 미션 제출 시 함께 적은 **소감(`attendance.review`)을 볼 수 없다.** 링크형·경험정리형 미션 공통이다. 멘토는 "유저가 무엇을 느꼈는지" 모른 채 피드백을 써야 한다.

### 루트 원인

멘티 제출 내역 응답 VO에 `review`가 빠져 있다. 정작 엔티티에는 `review` 컬럼이 존재한다.

- 엔티티에 `review`는 이미 존재:
  `domain/attendance/entity/Attendance.java:40` — `private String review;`
  (참고: `Attendance.java:43`에 `private Boolean reviewIsVisible = false;`도 있음 — 노출 여부 플래그가 필요하면 함께 활용 가능)

- 그러나 응답 VO에는 `review`가 없음:
  `domain/attendance/vo/FeedbackMissionAttendanceVo.java:8-23`
  ```java
  public record FeedbackMissionAttendanceVo(
          Long id, Long userId, Long challengeMentorId, String mentorName,
          String name, String major, String wishJob, String wishCompany,
          String link,                       // ← 제출물 관련은 link 뿐, review 없음
          AttendanceStatus status, AttendanceResult result,
          ChallengePricePlanType challengePricePlanType,
          AttendanceFeedbackStatus feedbackStatus, String optionCode
  ) {}
  ```

- 이 VO를 투영하는 쿼리 3곳 모두 `attendance.review`를 select 하지 않음:
  `domain/attendance/repository/AttendanceQueryRepositoryImpl.java`
  - `findFeedbackMissionAttendanceVos` (158행~, projection 160행~)
  - `findFeedbackMissionAttendanceVos_prev` (202행~, projection 205행~)
  - `findMenteeFeedbackMissionAttendanceVos` (245행~, projection 250행~)  ← **멘토 화면이 호출하는 멘티 목록 쿼리**

### 요청

`FeedbackMissionAttendanceVo`에 `String review`를 추가하고, 위 3개 쿼리 projection에 `attendance.review`를 추가해 주세요.

```diff
 public record FeedbackMissionAttendanceVo(
         Long id, Long userId, Long challengeMentorId, String mentorName,
         String name, String major, String wishJob, String wishCompany,
         String link,
+        String review,
         AttendanceStatus status, AttendanceResult result,
         ChallengePricePlanType challengePricePlanType,
         AttendanceFeedbackStatus feedbackStatus, String optionCode
 ) {}
```

각 projection(`Projections.constructor`)에서 `attendance.link` 바로 다음에 `attendance.review` 한 줄 추가 (record 필드 순서와 일치시켜야 함). `_prev` 쿼리도 동일.

> 노출 정책 메모: 어드민/유저 마이페이지에서 `reviewIsVisible`로 소감 공개 여부를 제어하고 있다면, 멘토 화면 노출 시에도 같은 정책을 적용할지 BE 판단 부탁드립니다. (FE는 우선 값이 내려오면 표시할 예정)

### FE 측 현황

멘티 목록 스키마(`mentorMenteeAttendanceListSchema`)에 `review` nullish 파싱을 추가하면 즉시 표시 가능. 필드가 내려오는 즉시 모달에 소감 노출.

---

## #2. LIVE 피드백 미션이 서면 피드백 관리 목록에 혼입 (피드백 미션 타입 필터가 화면마다 제각각)

> **이 건은 기존 메모 `be-request-feedback-mission-live-type-filtered.md`와 같은 뿌리다.**
> 그 메모는 "어드민 목록에서 LIVE가 **누락**"되는 증상(WRITTEN 필터로 제외), 이 건은 멘토 화면에서 "LIVE가 **혼입**"되는 반대 증상이다. **공통 원인은 "피드백 미션 조회 쿼리/응답마다 타입 필터 기준이 통일돼 있지 않다"**는 것. 두 건을 하나의 이슈로 묶어 타입 필터 정책을 정해 주시면 좋겠습니다.

### 증상

멘토 마이페이지 → 피드백 관리(서면)에서:
- 목록(`/challenge/mentor/feedback-management`)에는 LIVE 피드백 미션도 **떠 있다.**
- 그런데 그 LIVE 미션 행의 피드백 작성 모달을 열면 **멘티가 0명**으로 나온다(서면 멘티 목록이 비어 있음).
- → 목록엔 보이는데 들어가면 빈 화면인 불일치.

### 루트 원인 — 두 API의 타입 필터 기준이 다름

**(A) 목록 API** `GET /api/v1/challenge/mentor/feedback-management`:
- `domain/challenge/controller/ChallengeV1Controller.java:295` `@GetMapping("/mentor/feedback-management")`
- `domain/challenge/service/ChallengeServiceImpl.java:431` `getMentorFeedbackManagement`
- 내부에서 `missionHelper.findFeedbackMissionAdminVodByChallengeId(...)`를 호출
  → **이 쿼리는 `be-request-feedback-mission-live-type-filtered.md` 요청대로 WRITTEN 타입 필터가 제거된(또는 제거 예정) 공유 쿼리.** 따라서 LIVE 미션도 함께 반환된다. 게다가 응답 VO(`FeedbackMissionAdminVo`)에 타입 필드가 없어 서면/LIVE 구분 불가(이 부분은 위 메모의 후속 요청 `challengeOptionType` 추가로 처리 중).

**(B) 멘티 목록 API** `.../feedback/attendances/mentee`:
- `domain/challenge/service/ChallengeServiceImpl.java:266` → `findMenteeFeedbackMissionAttendanceVos`
- `domain/attendance/repository/AttendanceQueryRepositoryImpl.java:295`:
  ```java
  .where(
      challengeApplication.challenge.id.eq(challengeId),
      challengeMentor.id.eq(challengeMentorId),
      challengeApplication.isCanceled.isFalse(),
      challengeOption.id.eq(challengeOptionId),
      challengeOption.isFeedback.isTrue(),
      challengeOption.type.eq(ChallengeOptionType.WRITTEN_FEEDBACK)   // ← 295행: WRITTEN만 통과
  )
  ```
  → LIVE 미션의 `missionId`로 호출하면 `WRITTEN_FEEDBACK` 조건에서 전부 걸러져 **빈 목록** 반환.

즉 **목록(A)은 LIVE 포함, 멘티 목록(B)은 LIVE 제외** → LIVE 미션이 목록에 떴다가 열면 0명이 되는 불일치.

### 요청 — 타입 필터 정책 통일

서면 피드백 관리 화면은 **서면(WRITTEN_FEEDBACK) 미션만** 다루는 게 의도이므로, 두 가지 중 택1로 정책을 일관되게 맞춰 주세요(BE 판단):

- **(권장) 목록(A)을 서면으로 좁히기**: 멘토 피드백 관리 목록이 서면 전용 화면이라면, `getMentorFeedbackManagement` 경로에서 LIVE를 제외. 단, `findFeedbackMissionAdminVodByChallengeId`는 어드민 목록과 **공유**되어 직접 WHERE에 타입 조건을 다시 넣으면 어드민 LIVE 누락이 재발(기존 메모의 117행 이슈)하므로, **서비스 레이어에서 `challengeOptionType == WRITTEN_FEEDBACK`만 필터**하거나 멘토 전용 조회 메서드로 분리하는 방식 권장.
  - 전제: 기존 메모 후속 요청대로 `FeedbackMissionAdminVo.challengeOptionType` 필드가 추가되어 있어야 서비스 레이어 필터가 가능. (FE도 `useLiveMissionIdSet`으로 이미 LIVE 제외 로직을 선반영해 둠 — `apps/mentor/src/pages/feedback-management/hooks/useMergedFeedbackRows.ts`)
- **(대안) 멘티 목록(B)에서 WRITTEN 한정을 풀고** LIVE도 멘티가 채워지도록 → LIVE 피드백을 같은 화면에서 다루기로 한다면. 단 이 경우 서면/LIVE를 화면에서 구분해 다른 UX로 보여줘야 하므로 정책 정의가 선행돼야 함.

> 핵심은 "목록에 보이는 미션 = 멘티 목록이 채워지는 미션"이 되도록 두 쿼리의 타입 기준을 일치시키는 것. 어느 쪽으로 정하든 FE는 맞춰 대응 가능합니다.

---

## #3. [보안 · HIGH] `user-experiences` 엔드포인트 멘토-멘티 매칭 검증 추가

> **우선순위 HIGH.** FE가 이 엔드포인트를 멘토 화면에 정식 노출할 예정(LC-3117 — 경험정리형 제출물 보기)이므로, **배포 전** 권한 검증 추가가 필요합니다.

### 증상 (취약점)

`GET /api/v2/admin/attendance/user-experiences/{missionId}?userId={userId}` 는 경로상 `admin`이고 Swagger 설명도 `[어드민]`이지만, 실제 보안 설정은 **일반 USER 권한으로 호출 가능**하도록 열려 있다. 그리고 서비스에 **멘토-멘티(또는 호출자-대상 유저) 매칭 검증이 없어**, 임의의 로그인 USER가 `missionId`와 `userId`만 알면 **타인의 경험 제출물(STAR·느낀점·핵심역량 등 개인정보)을 조회**할 수 있다.

### 루트 원인 (코드 인용)

**(1) 보안 설정상 USER에게 열려 있음** — `global/config/WebSecurityConfig.java`:
```java
// 91-92행: user-experiences가 UserGetPatterns에 명시 등록됨
private final String[] UserGetPatterns = {
        "/api/v2/admin/attendance/user-experiences/**"
};
...
// 124행: 위 패턴은 USER 또는 ADMIN이면 통과
.requestMatchers(HttpMethod.GET, UserGetPatterns).hasAnyAuthority("USER", "ADMIN")
```
→ `/api/v2/admin/...` 경로지만 `AdminGetPatterns`(128행, `hasAuthority("ADMIN")`)가 아니라 `UserGetPatterns`에 올라가 있어 **일반 USER도 통과.** (멘토 화면이 USER 토큰으로 호출해야 하기 때문에 의도적으로 열어둔 것으로 보이나, 그 대가로 어드민 검증이 사라짐.)

**(2) 서비스에 소유권/매칭 검증 없음** — `domain/attendance/service/AttendanceServiceImpl.java:63-70`:
```java
public GetUserExperiencesResponseDto getAttendanceUserExperiences(Long missionId, Long userId) {
    Attendance attendance = attendanceHelper.findAttendanceByMissionIdAndUserIdOrNull(missionId, userId);
    if (attendance == null) {
        return attendanceMapper.toGetUserExperiencesResponseDto(Collections.emptyList());
    }
    List<UserExperienceVo> userExperiences = attendanceHelper.findUserExperienceVosByAttendanceId(attendance.getId());
    return attendanceMapper.toGetUserExperiencesResponseDto(userExperiences);
}
```
→ 파라미터 `missionId + userId`만으로 조회. **호출한 주체(`@CurrentUser`)가 누구인지조차 받지 않으며**, "이 멘토가 이 멘티의 미션 담당 멘토인가"를 전혀 확인하지 않는다. (컨트롤러 `AttendanceV2AdminController.java:58-63`도 `@CurrentUser`를 받지 않음.)

### 요청

다음 중 한 방식으로 **호출자가 대상 유저의 경험을 볼 정당한 권한이 있는지** 검증해 주세요.

1. 컨트롤러에서 `@CurrentUser User user`를 받도록 시그니처 추가
   (`AttendanceV2AdminController.java:58` `getUserExperienceIds`)
2. 서비스에서 권한 분기:
   - 호출자가 ADMIN → 통과(기존 어드민 사용 유지)
   - 호출자가 멘토(USER) → 해당 `challengeMentor`가 대상 `userId`의 미션(`missionId`이 속한 챌린지) 담당 멘토인지 확인.
     - 매칭 판별은 `#2`의 `findMenteeFeedbackMissionAttendanceVos`와 동일하게 `challengeApplication.challengeMentor` ↔ `challengeMentorId` 관계로 가능.
   - 매칭 실패 → 403(`UnauthorizedException`)

> 참고: 같은 파일 `getMentorFeedbackManagement`(ChallengeServiceImpl:432)는 `if(!user.getIsMentor()) throw new UnauthorizedException(IS_NOT_MENTOR);`로 멘토 여부를 가드한다. user-experiences에도 최소한 "멘토 여부 + 담당 멘티 여부" 가드를 동일 수준으로 추가하는 것이 일관적.

### FE 측 현황

멘토 FE 훅 `useMissionAttendanceUserExperiencesQuery`(`apps/mentor/src/api/challenge/challenge.ts:499`)가 이 엔드포인트를 호출하도록 LC-3117에서 연동 예정. **BE 검증이 들어오면 FE는 정상 경로(담당 멘티)만 호출하므로 동작 변화 없음.** 검증 추가가 배포돼야 정식 노출 가능.

---

## 검증 근거 요약 (origin/main `444af52`, 2026-06-05 fetch)

| 항목 | 근거 파일·라인 |
|---|---|
| `review` 미노출 | VO: `domain/attendance/vo/FeedbackMissionAttendanceVo.java:8-23` (review 없음) / 엔티티: `domain/attendance/entity/Attendance.java:40` (`review` 존재), `:43` (`reviewIsVisible`) / 쿼리 projection: `AttendanceQueryRepositoryImpl.java:160·205·250` |
| LIVE 혼입 (타입 필터 불일치) | 목록: `ChallengeServiceImpl.java:431` → 공유 쿼리 `findFeedbackMissionAdminVodByChallengeId` / 멘티 목록: `AttendanceQueryRepositoryImpl.java:295` (`WRITTEN_FEEDBACK` 한정) |
| 보안 (권한 검증 없음) | 보안설정: `WebSecurityConfig.java:91-92`(UserGetPatterns 등록), `:124`(USER/ADMIN 허용) / 서비스 무검증: `AttendanceServiceImpl.java:63-70` / 컨트롤러: `AttendanceV2AdminController.java:58-63` |
