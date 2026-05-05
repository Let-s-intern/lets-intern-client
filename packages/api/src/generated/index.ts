/**
 * orval generated API의 공용 진입점.
 *
 * 사용 규칙(PRD-0505 §6):
 * - 신규 hook은 도메인 단위 서브패스로 import 하세요:
 *     `import { useGetXxx } from '@letscareer/api/generated/<domain>'`
 * - 이 index에서는 도메인 hook을 일괄 re-export 하지 않습니다 (의도적).
 *   barrel import로 인한 tree-shaking 저해 및 코드 분할 약화를 막기 위함입니다.
 *
 * 이 파일은 공용 zod-style schema(타입 전용)만 re-export 합니다.
 * 타입 선언이라 런타임 비용이 없으며, 여러 도메인에서 참조될 수 있습니다.
 */
export type * from './letsCareerAPI.schemas';
