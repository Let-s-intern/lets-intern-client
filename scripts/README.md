# PR Impact Visualization

이 스크립트(`visualize-pr-impact.mjs`)는 Pull Request의 변경사항이 프로젝트에 미치는 영향 범위를 시각화합니다.

## 개요

Dependency Cruiser를 사용하여 프로젝트의 의존성 그래프를 분석하고, PR에서 변경된 파일들이 어떤 다른 파일들에 영향을 미치는지 시각화합니다.

## 설치

Dependency Cruiser는 이미 devDependencies에 포함되어 있습니다:

```bash
npm install
```

## 사용법

### 로컬에서 실행

PR 브랜치에서 다음 명령어를 실행하세요:

```bash
npm run analyze:impact
```

이 명령어는:
1. 베이스 브랜치와 비교하여 변경된 파일 감지
2. 프로젝트의 전체 의존성 그래프 생성
3. 변경된 파일에 영향을 받는 파일들 추적 (depth 3까지)
4. Mermaid 다이어그램으로 시각화
5. `pr-impact.md` 파일로 결과 저장
6. `pr-impact-diagram.png` 이미지 생성 (선택사항)

### GitHub Actions

Pull Request가 생성되거나 업데이트되면 자동으로 실행됩니다:
- `.github/workflows/pr-impact-visualization.yml` 참조
- PR 코멘트로 영향 범위 시각화 결과가 자동으로 게시됩니다

## 출력 예시

생성되는 `pr-impact.md` 파일에는 다음이 포함됩니다:

### Summary
- **Changed files**: 변경된 파일 수
- **Impacted files**: 영향을 받는 파일 수
- **Total affected files**: 총 영향 받는 파일 수
- **Analysis depth**: 분석 깊이 (기본 3 레벨)

### Impact Graph
Mermaid 다이어그램으로 의존성 관계를 시각화:
- 🔴 빨간색 노드: PR에서 변경된 파일
- 🟡 노란색 노드: 변경에 영향을 받는 파일
- 화살표: 의존성 방향 (A → B는 B가 A에 의존함을 의미)

## 설정

### Dependency Cruiser 설정

`.dependency-cruiser.cjs` 파일에서 다음을 설정할 수 있습니다:
- 순환 의존성 감지
- 분석 제외 경로
- TypeScript 설정 연동

### GitHub Actions 설정

`.github/workflows/pr-impact-visualization.yml`에서:
- 트리거 조건 수정
- 분석 대상 파일 패턴 변경
- 추가 분석 단계 구성

## 주의사항

- 대규모 프로젝트에서는 실행 시간이 길어질 수 있습니다
- `src/` 디렉토리의 TypeScript/JavaScript 파일만 분석합니다
- `node_modules`, `.next`, `dist` 등은 자동으로 제외됩니다
- 의존성 분석은 depth 3까지 추적합니다 (직접 의존성 + 2단계 간접 의존성)
- PNG 이미지 생성은 선택사항이며, 실패해도 markdown 파일은 정상 생성됩니다

## 문제 해결

### 의존성 그래프 생성 실패

```bash
npx depcruise --validate .dependency-cruiser.cjs src
```

위 명령어로 설정이 올바른지 확인하세요.

### GitHub Actions 실패

워크플로우 로그를 확인하여 권한 또는 설정 문제를 해결하세요.

## 참고 자료

- [Dependency Cruiser 문서](https://github.com/sverweij/dependency-cruiser)
- [당근마켓 기술 블로그 - 의존성 그래프를 활용한 프로젝트 시각화](https://medium.com/daangn)
