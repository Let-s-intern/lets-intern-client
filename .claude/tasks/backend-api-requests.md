# 백엔드 API 요청사항

> 멘토 관리 기능 구현 중 프론트엔드에서 확인된 백엔드 API 부재/수정 필요 사항

## 요청 목록

| # | API 엔드포인트 | 메서드 | 현재 상태 | 필요한 이유 |
|---|---------------|--------|----------|------------|
| 1 | `/admin/user-career/user/{userId}/{careerId}` | `DELETE` | 없음 | 어드민이 추가한 경력을 삭제할 수 없음. 잘못 입력한 경력을 수정/삭제 못하면 관리 불가 |
| 2 | `/admin/user-career/user/{userId}/{careerId}` | `PATCH` | 없음 | 어드민이 추가한 경력을 수정할 수 없음. 오타나 정보 변경 시 삭제 후 재등록해야 함 |
| 3 | `/user-career/my` | `GET` 수정 | `isAddedByAdmin: true` 경력 미포함 | 어드민이 추가한 경력이 멘토 마이페이지에 안 보임. 외부 노출 시에도 누락됨 |
| 4 | `/admin/user/mentor` | `GET` 수정 | `email`, `phoneNum`, `nickname` 미반환 | 멘토 관리 목록에서 이메일/전화번호가 안 보여서 유저 전체 목록 API로 우회 중 |

## 상세 설명

### 1. 어드민 경력 삭제 API (DELETE)

- **엔드포인트**: `DELETE /api/v1/admin/user-career/user/{userId}/{careerId}`
- **현재 상태**: Swagger에 존재하지 않음
- **필요한 이유**: 어드민이 멘토에게 경력을 추가할 수 있지만, 삭제할 수 없음. 잘못된 경력 추가 시 되돌릴 방법이 없음
- **프론트 상태**: DELETE mutation 구현 완료 (`useDeleteAdminCareerMutation`). 백엔드 API 추가되면 즉시 연동 가능

### 2. 어드민 경력 수정 API (PATCH)

- **엔드포인트**: `PATCH /api/v1/admin/user-career/user/{userId}/{careerId}`
- **현재 상태**: Swagger에 존재하지 않음
- **필요한 이유**: 어드민이 추가한 경력 정보(회사명, 직무, 기간 등)에 오류가 있을 때 수정 불가. 삭제 후 재등록해야 함
- **프론트 상태**: 미구현. 백엔드 API 추가 후 구현 예정

### 3. 멘토 본인 경력 조회 시 어드민 추가 경력 포함 (GET 수정)

- **엔드포인트**: `GET /api/v1/user-career/my`
- **현재 상태**: `isAddedByAdmin: true`인 경력이 응답에 포함되지 않음
- **필요한 이유**:
  - 어드민이 추가한 경력이 멘토 마이페이지 프로필에 표시되지 않음
  - 외부에 멘토 프로필을 노출할 때 어드민이 추가한 경력이 누락됨
  - 어드민 상세페이지에서는 4개 경력이 보이지만, 멘토 마이페이지에서는 3개만 보이는 데이터 불일치 발생
- **확인된 응답 예시**:
  - `/admin/user-career/user/{userId}` → 4개 (isAddedByAdmin true/false 모두 포함)
  - `/user-career/my` → 3개 (isAddedByAdmin: false만 포함)

### 4. 멘토 목록 API 응답 필드 보강 (GET 수정)

- **엔드포인트**: `GET /api/v2/admin/user/mentor`
- **현재 상태**: `id`, `name`만 반환하는 것으로 추정. `email`, `phoneNum`, `nickname` 미포함
- **필요한 이유**: 멘토 관리 테이블에서 이메일, 전화번호를 표시해야 하는데 데이터가 없음
- **현재 우회 방법**: `GET /api/v2/admin/user`로 전체 유저를 조회한 뒤 `isMentor === true`로 필터링 (비효율적)
- **권장 수정**: 응답에 `email`, `phoneNum`, `nickname` 필드 추가

## 우선순위

1. **높음**: #3 (멘토 본인 경력 조회 시 어드민 추가 경력 포함) — 데이터 불일치 및 외부 노출 이슈
2. **높음**: #1 (어드민 경력 삭제) — 관리 기능 필수
3. **중간**: #4 (멘토 목록 응답 보강) — 현재 우회 중이나 비효율적
4. **낮음**: #2 (어드민 경력 수정) — 삭제 후 재등록으로 대체 가능
