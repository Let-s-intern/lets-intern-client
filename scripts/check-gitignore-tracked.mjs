#!/usr/bin/env node
// .gitignore 대상인데 git에 이미 추적(tracked) 중인 파일이 있으면 실패한다.
// bash 대신 Node로 작성해 Windows(cmd/PowerShell)에서도 `pnpm check` 가 동작하게 한다.
import { execFileSync } from 'node:child_process';

const tracked = execFileSync('git', ['ls-files', '-ci', '--exclude-standard']).toString().trim();

if (tracked) {
  console.error('gitignore 대상인데 git에 추적 중인 파일:');
  console.error(tracked);
  console.error('해결: git rm --cached <파일>');
  process.exit(1);
}
