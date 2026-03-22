# Agent Team Roles

이 디렉토리는 lets-intern-client 프로젝트를 위한 에이전트 팀 역할 정의를 포함합니다.

## 팀 구성

### 1. Coordinator (메인 코디네이터)
- **역할**: 사용자 명령을 받아 팀원들에게 작업 할당 및 방향 조정
- **파일**: `coordinator.md`
- **권한**: 사용자에게 확인 요청 가능 (`permissionMode: ask`)
- **도구**: Task, Read, Bash, Glob, Grep, TodoWrite, AskUserQuestion

### 2. Developer (개발자)
- **역할**: 코드 구현, 기능 개발, 버그 수정, 리팩토링
- **파일**: `developer.md`
- **권한**: 자율 실행 (`permissionMode: dontAsk`)
- **도구**: Read, Write, Edit, Bash, Glob, Grep, Task
- **스킬**: Vercel 베스트 프랙티스, 코드 품질, 폴더 구조

### 3. Tester (테스터)
- **역할**: 타입 체크, 단위 테스트, 빌드 테스트 실행 및 보고
- **파일**: `tester.md`
- **권한**: 자율 실행 (`permissionMode: dontAsk`)
- **도구**: Read, Bash, Grep, Glob, Write, Edit
- **모델**: haiku (빠른 실행)

## 사용 방법

### CLI에서 역할 사용

```bash
# Coordinator 역할로 시작
claude --role coordinator

# Developer 역할로 시작
claude --role developer

# Tester 역할로 시작
claude --role tester
```

### 워크플로우 예시

#### 1. 새 기능 개발

```
사용자 → Coordinator:
"사용자 프로필 편집 기능을 추가해줘"

Coordinator:
1. TodoWrite로 작업 계획 수립
   - [ ] 프로필 편집 UI 구현
   - [ ] API 연동
   - [ ] 테스트 작성
   - [ ] 테스트 실행

2. Developer에게 개발 작업 할당:
   Task(subagent_type: "developer")
   "사용자 프로필 편집 기능을 구현해주세요.
   - ProfileEditForm 컴포넌트
   - useProfile 훅에 update 기능 추가
   - 낙관적 업데이트 적용"

Developer:
1. 기존 코드 탐색 (Glob/Grep)
2. Vercel 베스트 프랙티스 적용하여 구현
3. 타입 체크 실행
4. 커밋 생성
5. Coordinator에게 완료 보고

Coordinator:
3. Tester에게 테스트 작업 할당:
   Task(subagent_type: "tester")
   "프로필 편집 기능을 테스트해주세요"

Tester:
1. 타입 체크 실행
2. 단위 테스트 실행
3. 필요시 테스트 코드 작성
4. 결과를 Coordinator에게 보고

Coordinator:
4. 사용자에게 최종 결과 보고
```

#### 2. 방향 수정 시나리오

```
사용자 → Coordinator:
"다크모드 기능 추가해줘"

Coordinator → Developer:
"다크모드 토글과 CSS 변수 기반 테마 구현"

Developer: (작업 중...)

사용자 → Coordinator:
"아니야, styled-components의 ThemeProvider 사용해"

Coordinator → Developer:
"현재 작업 중단하고 styled-components ThemeProvider로 다시 구현해주세요"

Developer:
1. 이전 작업 되돌리기
2. styled-components 방식으로 재구현
3. 완료 보고

Coordinator → Tester:
"다크모드 기능 테스트"

Tester → Coordinator:
"✅ 모든 테스트 통과"

Coordinator → 사용자:
"다크모드 기능이 styled-components ThemeProvider로 구현되어 테스트까지 완료되었습니다"
```

## 각 역할의 주요 특징

### Coordinator
- **사용자 중심**: 사용자의 피드백을 실시간으로 받아 팀원에게 전달
- **방향 조정**: 팀원의 작업이 잘못된 방향이면 즉시 개입
- **상황 파악**: TodoWrite로 전체 진행 상황 관리
- **의사소통**: 모호한 부분은 AskUserQuestion으로 확인

### Developer
- **자율성**: 할당된 작업은 스스로 판단하여 실행
- **품질**: Vercel 베스트 프랙티스와 코드 품질 기준 준수
- **일관성**: 기존 코드베이스의 패턴을 분석하여 따름
- **자동화**: 코드 작성 후 ESLint/Prettier 자동 실행

### Tester
- **신속성**: haiku 모델로 빠른 테스트 실행
- **포괄성**: 타입 체크 → 단위 테스트 → 빌드 순서로 검증
- **문제 해결**: 간단한 오류는 직접 수정, 복잡한 것은 보고
- **명확성**: 테스트 결과를 간결하고 정확하게 전달

## 팀 협업 원칙

1. **명확한 역할 분담**
   - Coordinator: 지시, 조정, 보고
   - Developer: 구현
   - Tester: 검증

2. **자율성과 책임**
   - Developer와 Tester는 자율적으로 작업
   - 문제 발생 시 Coordinator에게 즉시 보고

3. **사용자 우선**
   - Coordinator는 항상 사용자의 피드백을 최우선
   - 사용자가 방향을 바꾸면 즉시 팀원에게 전달

4. **품질 유지**
   - Developer는 베스트 프랙티스 준수
   - Tester는 빠뜨리지 않고 검증
   - Coordinator는 전체 품질 관리

5. **효율적 커뮤니케이션**
   - 간결하고 명확한 지시
   - 완료 보고는 핵심만
   - 문제는 즉시 공유

## 설정 활성화

`.claude/settings.json`에 다음 설정이 필요합니다:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  },
  "teammateMode": "tmux"
}
```

현재 프로젝트는 이미 설정되어 있습니다.

## 추가 정보

- 각 역할의 상세 가이드는 해당 `.md` 파일 참조
- Vercel 베스트 프랙티스: `.claude/skills/vercel-react-best-practices/`
- 코드 품질 기준: `.claude/skills/code-quality/`
- 폴더 구조 규칙: `.claude/skills/folder-structure/`
