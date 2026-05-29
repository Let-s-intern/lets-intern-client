# 렛츠커리어 서버 구조 트리

> 목적: 서버 소스 1544개 파일에서 grep/find 로 헤매지 않도록, 파일 위치를 바로 짚기 위한 지도.
> 경로는 모두 클라이언트 레포 루트 기준 상대경로다. 소스 루트:
> `../lets-career-server/src/main/java/org/letscareer/letscareer/`
> (이하 표에서는 `domain/`, `global/` 로 줄여 쓴다.)
>
> 마지막 생성: 트리가 의심스러우면 `scripts/refresh-structure.sh` 로 갱신.

## 기술 스택

Java + Spring Boot. 주요 라이브러리:

- **Web/API**: Spring Web MVC, springdoc OpenAPI(Swagger)
- **DB**: Spring Data JPA + **QueryDSL 5.0** (커스텀 쿼리), MySQL
- **인증**: Spring Security, JWT(jjwt 0.11.5), OAuth2 client
- **인프라**: Redis(캐시/세션), Spring Batch, ShedLock(분산 락 스케줄러)
- **연동**: AWS S3, OpenFeign(외부 API — NHN 등), Slack webhook, Spring Mail
- **보일러플레이트**: Lombok

## 최상위 구조

```
lets-career-server/
├── build.gradle                # 의존성·빌드 설정
├── src/main/
│   ├── java/org/letscareer/letscareer/
│   │   ├── LetsCareerApplication.java   # 엔트리포인트
│   │   ├── domain/             # 45개 비즈니스 도메인 (아래 목록)
│   │   └── global/             # 공통 설정·보안·에러·배치 (아래)
│   └── resources/
│       ├── application.yml     # 환경설정(DB·Redis·S3·외부키 등)
│       ├── messages.properties
│       └── messages_ko.properties
└── src/test/java/...           # 테스트
```

## 표준 도메인 레이어 (★ 한 번만 기억하면 됨)

**모든 도메인이 아래 레이어 규칙을 따른다.** 도메인마다 일부 폴더는 생략될 수 있다.
질문 유형 → 레이어 매핑은 SKILL.md 의 "의도별 탐색 맵" 표 참고.

```
domain/{domain}/
├── controller/   # REST 엔드포인트. {Domain}V{1|2}{Admin?}Controller.java
│                 #   - V1/V2 = API 버전, Admin = 관리자 전용 엔드포인트
│                 #   - @RequestMapping("/api/v{n}/{kebab-domain}")
├── service/      # 비즈니스 로직·트랜잭션
├── repository/   # JPA Repository(인터페이스) + QueryDSL ...RepositoryImpl
├── entity/       # JPA 엔티티 = 실제 DB 테이블/컬럼/연관관계
├── vo/           # 쿼리 결과 투영(Value Object) — 조인/집계 응답 형태
├── dto/
│   ├── request/  # 요청 바디·파라미터 (...RequestDto)
│   └── response/ # 응답 JSON 형태 (...ResponseDto)  ← API 응답 확인 1순위
├── mapper/       # entity ↔ dto 변환
├── type/         # enum·상태값
├── helper/       # 도메인 보조 컴포넌트
└── error/        # 도메인별 에러 코드/예외 (없는 도메인도 있음)
```

## 도메인 ↔ API 경로 매핑

도메인명만 알면 경로를 추론할 수 있다: `/api/v{1,2}/{kebab-domain}`, 관리자용은 `/api/v{n}/admin/...`.
아래는 실제 `@RequestMapping` 으로 확인된 매핑이다.

| 도메인 폴더 | API 베이스 경로 |
|---|---|
| `application` | `/api/v1/application` |
| `attendance` | `/api/v1/attendance`, `/api/v2/admin/attendance` |
| `banner` | `/api/v1/banner` |
| `blog` | `/api/v1/blog`, `/api/v1/blog-rating`, `/api/v1/blog-tag` |
| `blogbanner` | `/api/v1/blog-banner`, `/api/v1/admin/blog-banner` |
| `challenge` | `/api/v1/challenge`, `/api/v2/admin/challenge` |
| `challengeguide` | `/api/v1/challenge-guide` |
| `challengementor` | `/api/v1/challenge-mentor`, `/api/v1/admin/challenge-mentor` |
| `challengementorguide` | `/api/v1/challenge-mentor-guide`, `/api/v1/admin/challenge-mentor-guide` |
| `challengeoption` | `/api/v1/admin/challenge-option` |
| `challlengenotice` | `/api/v1/challenge-notice` (폴더명 오타 주의: `challlenge`) |
| `commonbanner` | `/api/v1/common-banner`, `/api/v1/admin/common-banner` |
| `contents` | `/api/v1/contents` |
| `coupon` | `/api/v1/coupon` |
| `curation` | `/api/v1/curation`, `/api/v1/admin/curation` |
| `faq` | `/api/v1/faq` |
| `feedback` | `/api/v1/feedback`, `/api/v1/feedback/mentor`, `/api/v1/admin/feedback` |
| `file` | `/api/v1/file` |
| `guidebook` | `/api/v1/guidebook`, `/api/v1/guidebooks` |
| `lead` | `/api/v1/admin/lead-event`, `/api/v1/admin/lead-history` |
| `live` | `/api/v1/live` |
| `magnet` | `/api/v1/magnet`, `/api/v1/magnet-application`, `/api/v1/admin/magnet`, `/api/v1/admin/magnet-question` |
| `mission` | `/api/v1/mission` |
| `missiontemplate` | `/api/v1/mission-template` |
| `notice` | `/api/v1/admin/notice` |
| `payment` | `/api/v1/payment` |
| `pg` | `/api/v1/pg` |
| `program` | `/api/v1/program` |
| `report` | `/api/v1/report` |
| `review` | `/api/v1/review`, `/api/v2/review`, `/api/v2/admin/review` |
| `s3` | `/api/v1/s3` |
| `user` | `/api/v1/user`, `/api/v2/user`, `/api/v2/admin/user` |
| `usercareer` | `/api/v1/user-career`, `/api/v1/admin/user-career` |
| `userdocument` | `/api/v1/user-document`, `/api/v1/admin/user-document` |
| `userexperience` | `/api/v1/user-experience`, `/api/v1/admin/user-experience` |
| `vod` | `/api/v1/vod`, `/api/v1/vods` |

### 내부/지원 도메인 (직접 노출 컨트롤러 없음)

다른 도메인에서 쓰이거나 내부 처리용이라 컨트롤러가 없다. 필요하면 `service`/`entity` 를 직접 본다.
역할은 폴더명 기반 추정이니 실제 코드로 확인할 것.

`admincalssification`, `classification` (분류/카테고리), `couponprogram` (쿠폰↔프로그램 연결),
`missioncontents` (미션 콘텐츠), `price` (가격), `score` (점수), `withdraw` (회원 탈퇴),
`notification` (알림), `nhn` (NHN 외부 연동 — Feign, `global/config/NhnFeignClientConfig` 참고)

## `global/` 구조 (공통 인프라)

도메인에 속하지 않는 횡단 관심사. 인증/에러/설정/배치를 볼 때 여기를 본다.

```
global/
├── config/     # 설정 클래스 — JpaConfig, QuerydslConfig, RedisConfig,
│               #   RedisCacheConfig, AsyncConfig, MessageConfig, FactoryConfig,
│               #   NhnFeignClientConfig 등
├── security/   # 인증/인가
│   ├── jwt/        # JWT 발급·검증
│   ├── oauth2/     # 소셜 로그인
│   └── user/       # 인증 주체(principal)
├── error/      # 전역 에러 처리
│   ├── ErrorCode.java, GlobalErrorCode.java
│   ├── exception/  # 커스텀 예외
│   ├── handler/    # @ControllerAdvice 전역 핸들러
│   └── toss/       # 토스 결제 관련 에러
├── common/     # 공통 유틸·필터·컨버터·기반 엔티티(BaseEntity 등)
│               #   annotation/ converter/ entity/ filter/ util/ utils/
│               #   + HealthCheckApiController.java
└── batch/      # Spring Batch — config/ scheduler/ tasklet/
```

## 탐색 치트시트

```bash
# 특정 도메인 한 눈에 (예: program)
ls ../lets-career-server/src/main/java/org/letscareer/letscareer/domain/program

# 어떤 응답 DTO가 있는지 (예: challenge)
ls ../lets-career-server/src/main/java/org/letscareer/letscareer/domain/challenge/dto/response

# API 경로로 컨트롤러 찾기 (도메인 모를 때만)
grep -rl '"/api/v1/찾는경로"' ../lets-career-server/src/main/java/org/letscareer/letscareer/domain --include=*.java

# 특정 엔티티(테이블) 정의
ls ../lets-career-server/src/main/java/org/letscareer/letscareer/domain/{domain}/entity
```
