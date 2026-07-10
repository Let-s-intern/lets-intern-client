# Jitsi 서버 인증·인가 처리 확인 (석준님 요청)

> 조사일 2026-07-10 · FE(this repo) + BE(`lets-career-server` `origin/dev`) 소스 기준

## 요청

석준님: "jitsi 서버 인증인가 처리 한번 확인 부탁드립니다."

## 결론

**앱(FE)·백엔드(BE) 어느 쪽에도 Jitsi 전용 인증·인가 로직이 없다.** 회의실은 사실상 오픈 룸이며,
접근 보호는 *추측 불가한 랜덤 방 이름* 하나에만 의존한다. 실제 인증 게이팅 여부는
`jitsi-meet.letscareer.co.kr` **셀프호스팅 서버 설정(Prosody/JWT 플러그인) 레벨에서 별도 확인**이 필요하다.

## 근거

### BE (`origin/dev`)

- `jitsi`·JWT-for-jitsi·JaaS·moderator·room-auth 토큰 생성 코드 **0건**(대소문자 무시 grep 전무).
  BE의 유일한 JWT(`global/security/jwt/TokenProvider`, `JwtAuthenticationFilter`, `WebSecurityConfig`)는
  앱 자체 REST API용 Spring Security 인증으로 **Jitsi와 무관**.
- 방 이름은 서버 랜덤 NanoID: `meetingRoom = nanoIdGenerator.generate()`
  (`FeedbackServiceImpl.createFeedback`). 미션/피드백 id 파생 아님.
- 최종 URL은 `meetingUrl = base(FE 전달) + meetingRoom` 단순 합성
  (`FeedbackServiceImpl.updateFeedbackMeetingUrl`). base(호스트)는 FE env에서 옴.

### FE

- `packages/ui/src/JitsiEmbed/*`는 방 URL을 그대로 iframe에 로드할 뿐 토큰/`jwt` 파라미터를 붙이지 않음.
- 방 이름 추측 난이도는 `NEXT_PUBLIC_JITSI_ROOM_SALT` / `VITE_JITSI_ROOM_SALT`(web·mentor 동일 값)로만 보강.

## 보안 관점 정리

- 현재 상태 = **인가 없음 + 추측 난이도**. 링크(랜덤 room)를 아는 사람은 인증 없이 입장 가능.
- 민감 세션이면 서버단 JWT(Prosody `token` 모듈)로 도메인·방·moderator 게이팅을 켜는 것을 권장.
  이 경우 BE가 방별 JWT를 발급해 `meetingUrl`에 `?jwt=` 로 실어 보내는 계약이 추가로 필요
  (현재 계약엔 없음 → BE 협의 사항).

## 관련

- 신규 도메인 `jitsi-meet.letscareer.co.kr`을 web·mentor `.env.example`의 `*_JITSI_BASE_URL`
  값으로 반영함(이 PR 포함). `apps/mentor/.env.prod`는 gitignore 대상이라 로컬만 반영됨.
  web 프로덕션은 Vercel env `NEXT_PUBLIC_JITSI_BASE_URL`을 별도 갱신해야 하며,
  `ROOM_SALT`는 web·mentor 동일 값 유지 필요.
- `GET /feedback/{id}` 3필드(`programTitle/mentorName/menteeName`, BE LC-3147) FE 스키마 반영함.
