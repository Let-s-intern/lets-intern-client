/**
 * 옛날 버전의 프로그램인지 확인합니다. (챌린지, LIVE 클래스)
 * 새로운 버전의 프로그램은 description이 무조건 JSON Object 형식입니다.
 */
export function isDeprecatedProgram(program: { desc?: string | null }) {
  return program.desc && program.desc.startsWith('<');
}

/**
 * 새로운 버전의 프로그램인지 확인합니다. (챌린지, LIVE 클래스) 2024/11 기준.
 */
export function isNewProgram(program: { desc?: string | null }) {
  return program.desc && !program.desc.startsWith('<');
}
