#!/usr/bin/env node
/*
 * build_report.js — git 로그 JSON + Claude 작성 content JSON 을 흑백 HTML 보고서로 합성한다.
 * (git-branch-report 스킬)
 *
 * 사용법:
 *   node build_report.js --git <git.json> --content <content.json> [--out <dir>] [--templates <dir>]
 *
 *   --git        extract_git_log.sh 출력 JSON 파일 경로 (또는 '-' 로 stdin)
 *   --content    Claude 가 작성한 content JSON 경로 (스키마: templates/_index.md 참조)
 *   --out        출력 디렉토리. 생략 시 <repo>/.claude/tasks/branch_reports/<유형>-<브랜치>-<날짜>
 *   --templates  템플릿 디렉토리. 생략 시 이 스크립트 기준 ../templates
 *
 * 출력: <out>/report.html (자족적 — _base.css 를 inline). 디렉토리/screens 자동 생성.
 *       경로를 stdout 에 한 줄(JSON)로 출력해 후속 스크립트가 받아쓸 수 있게 한다.
 *
 * 의존성 없음(순수 Node). 템플릿 엔진은 mustache 의 최소 부분집합을 직접 구현.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// ── 인자 파싱 ────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      out[a.slice(2)] = true; // 값 없는 플래그(--print-dir) → boolean
    } else {
      out[a.slice(2)] = next;
      i += 1;
    }
  }
  return out;
}

function die(msg) {
  process.stderr.write(`[build_report] ${msg}\n`);
  process.exit(1);
}

function readJson(p) {
  const raw =
    p === '-' ? fs.readFileSync(0, 'utf8') : fs.readFileSync(p, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (e) {
    die(`JSON 파싱 실패 (${p}): ${e.message}`);
  }
}

// ── mustache-lite 템플릿 엔진 ─────────────────────────────────────────
// 지원: {{var}}(escape) · {{{var}}}(raw) · {{#k}}..{{/k}}(섹션/반복) · {{^k}}..{{/k}}(역섹션)
// 변수 해석은 컨텍스트 스택 상단부터 탐색하므로, 반복 블록 안에서도 바깥 값에 접근 가능.
const TAG = /\{\{(\{?)\s*([#^/]?)\s*([\w.]+)\s*\}?\}\}/g;

function escapeHtml(v) {
  return String(v)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parse(template) {
  const tokens = [];
  let last = 0;
  let m;
  TAG.lastIndex = 0;
  while ((m = TAG.exec(template)) !== null) {
    if (m.index > last)
      tokens.push({ t: 'text', v: template.slice(last, m.index) });
    const [, brace, sigil, name] = m;
    if (sigil === '#') tokens.push({ t: 'open', name });
    else if (sigil === '^') tokens.push({ t: 'inv', name });
    else if (sigil === '/') tokens.push({ t: 'close', name });
    else tokens.push({ t: 'var', name, raw: brace === '{' });
    last = m.index + m[0].length;
  }
  if (last < template.length)
    tokens.push({ t: 'text', v: template.slice(last) });

  // 토큰 → AST (open/inv ↔ close 매칭)
  const root = { children: [] };
  const stack = [root];
  for (const tok of tokens) {
    const top = stack[stack.length - 1];
    if (tok.t === 'open' || tok.t === 'inv') {
      const node = { t: tok.t, name: tok.name, children: [] };
      top.children.push(node);
      stack.push(node);
    } else if (tok.t === 'close') {
      if (stack.length < 2 || stack[stack.length - 1].name !== tok.name) {
        die(`템플릿 섹션 짝이 맞지 않습니다: {{/${tok.name}}}`);
      }
      stack.pop();
    } else {
      top.children.push(tok);
    }
  }
  if (stack.length !== 1)
    die(
      `템플릿 섹션이 닫히지 않았습니다: {{#${stack[stack.length - 1].name}}}`,
    );
  return root;
}

function lookup(name, ctxStack) {
  if (name === '.') return ctxStack[ctxStack.length - 1];
  for (let i = ctxStack.length - 1; i >= 0; i -= 1) {
    const c = ctxStack[i];
    if (c && typeof c === 'object' && !Array.isArray(c) && name in c)
      return c[name];
  }
  return undefined;
}

function truthy(v) {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && v !== false && v !== '' && v !== 0;
}

function renderNode(node, ctxStack) {
  let out = '';
  for (const child of node.children) {
    if (child.t === 'text') {
      out += child.v;
    } else if (child.t === 'var') {
      const v = lookup(child.name, ctxStack);
      if (v === undefined || v === null) continue;
      out += child.raw ? String(v) : escapeHtml(v);
    } else if (child.t === 'open') {
      const v = lookup(child.name, ctxStack);
      if (Array.isArray(v)) {
        for (const item of v) out += renderNode(child, ctxStack.concat([item]));
      } else if (truthy(v)) {
        out += renderNode(
          child,
          v && typeof v === 'object' ? ctxStack.concat([v]) : ctxStack,
        );
      }
    } else if (child.t === 'inv') {
      if (!truthy(lookup(child.name, ctxStack)))
        out += renderNode(child, ctxStack);
    }
  }
  return out;
}

function render(template, context) {
  return renderNode(parse(template), [context]);
}

// ── 도메인 라벨 ──────────────────────────────────────────────────────
const TYPE_LABEL = {
  feature: '새로운 기능 구현',
  bugfix: '오류 수정',
  refactor: '리팩터링 변경',
  security: '보안 패치',
  mixed: '혼합 작업',
};
const CAT_LABEL = {
  feat: '기능',
  fix: '수정',
  refactor: '리팩터링',
  security: '보안',
  docs: '문서',
  chore: '작업',
  기타: '기타',
};
const CAT_ORDER = [
  'feat',
  'fix',
  'refactor',
  'security',
  'docs',
  'chore',
  '기타',
];

function repoRoot() {
  try {
    return execFileSync('git', ['rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    return process.cwd();
  }
}

function slugifyBranch(branch) {
  return branch.replace(/\//g, '-').replace(/[^\w가-힣.-]/g, '-');
}

function ymd(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}`;
}

// ── 뷰 모델 합성 ─────────────────────────────────────────────────────
function buildView(git, content, outDir) {
  const type = content.type;
  if (!TYPE_LABEL[type]) {
    die(
      `알 수 없는 문서 유형: '${type}'. (feature|bugfix|refactor|security|mixed 중 하나)`,
    );
  }
  const sections = content.sections || {};
  const period = git.period || {};
  const periodText =
    period.from && period.to
      ? period.from === period.to
        ? period.from
        : `${period.from} ~ ${period.to}`
      : period.from || period.to || '';

  // 카테고리 분포 (요약·mixed 공용)
  const counts = git.category_counts || {};
  const categoryBreakdown = CAT_ORDER.filter((k) => counts[k]).map((k) => ({
    label: CAT_LABEL[k],
    count: counts[k],
  }));

  // 커밋 타임라인 — 날짜별 그룹(입력 순서=최신→과거 유지)
  const timelineMap = new Map();
  for (const c of git.commits || []) {
    if (!timelineMap.has(c.date)) timelineMap.set(c.date, []);
    timelineMap.get(c.date).push({
      catLabel: CAT_LABEL[c.category] || c.category,
      hash: c.hash,
      message: c.message,
    });
  }
  const timeline = [...timelineMap.entries()].map(([date, commits]) => ({
    date,
    commits,
  }));

  // 주요 변경사항 (Claude 작성)
  const changes = (content.changes || []).map((ch) => ({
    heading: ch.heading || '',
    detail: ch.detail || '',
    filesText: Array.isArray(ch.files) ? ch.files.join(', ') : ch.files || '',
  }));

  // 화면 캡처 (feature 전용) — 실제 PNG 존재 여부로 missing 판정 (PRD §9)
  const screens = (content.screens || []).map((s, i) => {
    const file = `screens/screen-${i + 1}.png`;
    const exists = fs.existsSync(path.join(outDir, file));
    return { src: file, caption: s.caption || s.url || '', missing: !exists };
  });

  return {
    // 헤더 메타
    title: content.title || git.branch,
    branchName: git.branch,
    baseBranch: git.base,
    periodText,
    authorsText: content.author || (git.authors || []).join(', '),
    typeLabel: TYPE_LABEL[type],
    totalCommits: git.total_commits,
    // 요약
    summary: content.summary || '',
    categoryBreakdown,
    // 주요 변경
    changes,
    changedFiles: git.changed_files || [],
    changedFilesCount: (git.changed_files || []).length,
    // 타임라인
    timeline,
    singleCommit: (git.total_commits || 0) <= 1, // 단일 커밋이면 타임라인 생략(PRD §9)
    // 유형별 섹션 (flatten)
    background: sections.background || '',
    implementation: sections.implementation || '',
    entrypoint: sections.entrypoint || '',
    problem: sections.problem || '',
    cause: sections.cause || '',
    fix: sections.fix || '',
    prevention: sections.prevention || '',
    motivation: sections.motivation || '',
    beforeAfter: sections.beforeAfter || '',
    impact: sections.impact || '',
    vulnerability: sections.vulnerability || '',
    patch: sections.patch || '',
    scope: sections.scope || '',
    highlights: sections.highlights || [],
    hasHighlights: (sections.highlights || []).length > 0,
    // 화면
    screens,
    hasScreens: screens.length > 0,
    // 푸터
    generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
  };
}

// ── main ────────────────────────────────────────────────────────────
function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.git || !args.content) {
    die('필수 인자 누락: --git <git.json> --content <content.json>');
  }
  const git = readJson(args.git);
  const content = readJson(args.content);
  const templatesDir =
    args.templates || path.join(__dirname, '..', 'templates');

  const type = content.type;
  const tplPath = path.join(templatesDir, `${type}.html`);
  if (!fs.existsSync(tplPath)) die(`템플릿을 찾을 수 없습니다: ${tplPath}`);

  // 출력 디렉토리 결정 + 생성
  const outDir =
    args.out ||
    path.join(
      repoRoot(),
      '.claude',
      'tasks',
      'branch_reports',
      `${type}-${slugifyBranch(git.branch)}-${ymd()}`,
    );
  fs.mkdirSync(path.join(outDir, 'screens'), { recursive: true });

  // 오케스트레이터용: 디렉토리만 만들고 경로를 알려준 뒤 종료(캡처가 build 보다 먼저 와야 하므로).
  if (args['print-dir']) {
    process.stdout.write(`${JSON.stringify({ outDir })}\n`);
    return;
  }

  const view = buildView(git, content, outDir);
  const baseCss = fs.readFileSync(path.join(templatesDir, '_base.css'), 'utf8');
  const template = fs.readFileSync(tplPath, 'utf8');
  const html = render(template, { ...view, baseCss });

  const htmlPath = path.join(outDir, 'report.html');
  fs.writeFileSync(htmlPath, html, 'utf8');

  // 후속 스크립트(render_to_pdf)가 받아쓰도록 경로를 JSON 한 줄로 출력
  process.stdout.write(
    `${JSON.stringify({ outDir, htmlPath, type, screens: view.screens.length })}\n`,
  );
  process.stderr.write(`[build_report] 생성: ${htmlPath}\n`);
}

main();
