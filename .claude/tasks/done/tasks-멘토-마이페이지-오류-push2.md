# Tasks: 멘토 마이페이지 서면 피드백 경험정리 제출물 미노출 오류 - Push 2

> PRD: `.claude/tasks/prd-멘토 마이페이지 오류.md`
> Push 범위: (P1) BE 협업 요청 메모 작성 — FE 코드 변경 없음, 문서만
> 상태: 🔲 진행 중
> 의존성: Push 1과 독립 (병렬 가능)

---

### 관련 파일

- `.claude/tasks/memos/be-request-*.md` - 기존 BE 요청 메모 컨벤션 참고
- BE 소스: `../lets-career-server` (origin/main `FeedbackMissionAttendanceVo`, `WebSecurityConfig`)

---

## 작업

- [x] 2.0 P1 항목 BE 협업 요청 메모 작성
    - [x] 2.1 `be-request-멘토-피드백-개선.md` 메모 작성 (커밋 단위)
        - 유저 소감(`review`) 노출: `FeedbackMissionAttendanceVo`에 `review` 필드 추가 요청 (링크형·경험정리형 공통)
        - LIVE 피드백 미션 혼입: `/challenge/mentor/feedback-management`는 `isFeedback=true` 전체 반환 vs 멘티 목록은 `WRITTEN_FEEDBACK`만 필터 → 불일치 정리 요청
        - 보안: `GET /api/v2/admin/attendance/user-experiences/{missionId}` 멘토-멘티 매칭 검증 추가 요청 (현재 임의 USER가 missionId+userId로 타인 경험 조회 가능)
        - 각 항목에 근거 파일·라인(BE 소스 기준) 명시
        - [x] 2.1.T1 메모 내 근거 체인 검증 (BE 소스 fetch 후 origin/main 기준 재확인 — [[feedback-verify-be-repo-synced]])
        - [x] 2.1.T2 메모 인덱스/컨벤션 일치 확인

---

## 검증 기준

- [x] P1 세 항목이 BE가 바로 착수 가능한 수준(엔드포인트·VO·검증 위치 명시)으로 정리됨
- [x] BE 소스 근거가 최신 origin 기준으로 검증됨
