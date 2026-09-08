#!/usr/bin/env node
/**
 * `pnpm local` — 백엔드(Spring)와 프론트 3개 앱을 한 번에 로컬로 띄운다.
 *
 * 백엔드는 별도 레포(기본 `../lets-career-server`)에 있어 turbo 로 묶을 수 없다.
 * 그래서 이 스크립트가 두 프로세스를 함께 띄우고, Ctrl+C 한 번에 같이 내린다.
 *
 * 환경변수
 *   SERVER_REPO   백엔드 레포 경로 (기본: 클라이언트 레포와 형제인 ../lets-career-server)
 *   JAVA_HOME     지정하지 않으면 JDK 17 을 자동 탐지한다
 *   SKIP_SERVER=1 백엔드는 이미 떠 있고 프론트만 다시 띄우고 싶을 때
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CLIENT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SERVER_REPO =
  process.env.SERVER_REPO ?? resolve(CLIENT_ROOT, '../lets-career-server');
const API_ORIGIN = 'http://localhost:8080';

const color = {
  server: '\x1b[35m',
  front: '\x1b[36m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
  reset: '\x1b[0m',
};

const log = (tag, message) =>
  console.log(`${color[tag] ?? ''}[local:${tag}]${color.reset} ${message}`);

const fail = (message) => {
  console.error(`${color.error}[local]${color.reset} ${message}`);
  process.exit(1);
};

/**
 * JDK 17 을 찾는다.
 *
 * Homebrew 의 `openjdk@17` 은 keg-only 라 PATH 에 잡히지 않는다 — `java -version` 만
 * 보고 "자바가 없다"고 판단하면 멀쩡히 설치된 JDK 를 놓친다.
 */
function resolveJavaHome() {
  if (process.env.JAVA_HOME) return process.env.JAVA_HOME;

  const viaJavaHome = spawnSync('/usr/libexec/java_home', ['-v', '17'], {
    encoding: 'utf8',
  });
  if (viaJavaHome.status === 0) return viaJavaHome.stdout.trim();

  const candidates = [
    '/opt/homebrew/opt/openjdk@17',
    '/usr/local/opt/openjdk@17',
  ];
  return candidates.find((path) => existsSync(`${path}/bin/java`)) ?? null;
}

/**
 * 프론트 env 가 로컬 서버를 보고 있는지 확인한다.
 *
 * 예전에 vite 프록시 주소가 소스에 하드코딩돼 있어, `.env` 를 로컬로 바꿔도 요청은 배포
 * 서버로 나갔다. 화면만 보고는 어느 서버에 붙었는지 알 수 없어 QA 결과를 통째로
 * 오해하게 만든다. 같은 사고를 막으려고 시작 전에 한 번 짚어준다.
 */
function warnIfEnvNotLocal() {
  const checks = [
    ['apps/web/.env.local', 'NEXT_PUBLIC_SERVER_API'],
    ['apps/admin/.env', 'VITE_API_BASE_PATH'],
    ['apps/mentor/.env', 'VITE_API_BASE_PATH'],
  ];

  for (const [file, key] of checks) {
    const path = resolve(CLIENT_ROOT, file);
    if (!existsSync(path)) {
      log('warn', `${file} 가 없습니다. 앱이 뜨지 않을 수 있어요.`);
      continue;
    }
    const line = readFileSync(path, 'utf8')
      .split('\n')
      .find((each) => each.startsWith(`${key}=`));
    if (!line?.includes('localhost:8080')) {
      log(
        'warn',
        `${file} 의 ${key} 가 로컬 서버를 가리키지 않습니다 (현재: ${line?.split('=')[1] ?? '없음'}). ` +
          `로컬 백엔드로 QA 하려면 ${API_ORIGIN} 으로 바꾸세요.`,
      );
    }
  }
}

const children = [];

function run(tag, command, args, cwd, env) {
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    log(tag, `종료됨 (code=${code}, signal=${signal}). 나머지도 내립니다.`);
    shutdown(code ?? 1);
  });
  children.push(child);
  return child;
}

let shuttingDown = false;
function shutdown(code) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  // 자식이 정리할 시간을 준 뒤 종료한다.
  setTimeout(() => process.exit(code), 500);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

warnIfEnvNotLocal();

if (process.env.SKIP_SERVER !== '1') {
  if (!existsSync(SERVER_REPO)) {
    fail(
      `백엔드 레포를 찾을 수 없습니다: ${SERVER_REPO}\n` +
        `  다른 위치에 있다면 SERVER_REPO=/path/to/lets-career-server pnpm local 로 실행하세요.\n` +
        `  백엔드 없이 프론트만 띄우려면 SKIP_SERVER=1 pnpm local 을 쓰세요.`,
    );
  }

  const javaHome = resolveJavaHome();
  if (!javaHome) {
    fail(
      'JDK 17 을 찾지 못했습니다.\n' +
        '  설치: brew install openjdk@17\n' +
        '  이미 있다면 JAVA_HOME=/path/to/jdk17 pnpm local 로 지정하세요.',
    );
  }

  log('server', `${SERVER_REPO} (JAVA_HOME=${javaHome})`);
  run('server', './gradlew', ['bootRun', '--console=plain'], SERVER_REPO, {
    JAVA_HOME: javaHome,
  });
}

log('front', 'web(3000) · admin(3001) · mentor(3002)');
run(
  'front',
  'pnpm',
  [
    'turbo',
    'run',
    'dev:local',
    '--filter=@letscareer/web',
    '--filter=@letscareer/admin',
    '--filter=@letscareer/mentor',
  ],
  CLIENT_ROOT,
);
