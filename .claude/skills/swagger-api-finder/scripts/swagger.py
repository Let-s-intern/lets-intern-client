#!/usr/bin/env python3
"""렛츠커리어 OpenAPI(Swagger) 탐색기.

전체 api-docs(~357KB, 257 endpoints, 449 schemas)를 모델 컨텍스트에 올리지 않고,
디스크 캐시에서 필요한 조각만 추출해 출력한다. 모델은 이 스크립트의 작은 stdout만 본다.

사용:
  swagger.py list [--tag TAG]        # 전체(또는 태그별) 엔드포인트 인덱스 (경량)
  swagger.py search <keyword> ...    # path/summary/operationId/tag 검색 (여러 키워드 AND)
  swagger.py show <METHOD> <PATH>    # 한 엔드포인트 + 참조 스키마만 추출 (핵심)
  swagger.py schema <SchemaName>     # 특정 스키마 + 중첩 스키마만 추출
  swagger.py tags                    # 태그 목록

공통 옵션:
  --refresh        캐시 무시하고 재다운로드
  --url URL        스펙 URL 직접 지정 (기본: 운영 서버)
"""
import sys
import os
import json
import time
import argparse
import urllib.request

DEFAULT_URL = os.environ.get("SWAGGER_URL", "https://letsintern.kr/v3/api-docs")
CACHE = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "cache", "api-docs.json"))
CACHE_TTL = 6 * 3600  # 6시간 — 세션 내 반복 조회는 캐시로 빠르게, 그 이상은 자동 갱신
HTTP_METHODS = ("get", "post", "put", "patch", "delete", "head", "options")


def load_spec(url, refresh):
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    fresh = os.path.exists(CACHE) and (time.time() - os.path.getmtime(CACHE) < CACHE_TTL)
    if refresh or not fresh:
        try:
            req = urllib.request.Request(url, headers={"Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=20) as r:
                data = r.read()
            json.loads(data)  # 유효성 확인
            with open(CACHE, "wb") as f:
                f.write(data)
        except Exception as e:
            if os.path.exists(CACHE):
                sys.stderr.write(f"⚠️  다운로드 실패 → 기존 캐시 사용 ({e})\n")
            else:
                sys.exit(f"❌ 스펙을 가져올 수 없습니다: {e}\n   네트워크 또는 --url 을 확인하세요.")
    with open(CACHE, encoding="utf-8") as f:
        return json.load(f)


def iter_ops(spec):
    for path, item in spec.get("paths", {}).items():
        if not isinstance(item, dict):
            continue
        for method, op in item.items():
            if method.lower() in HTTP_METHODS and isinstance(op, dict):
                yield path, method.upper(), op


def fmt_row(method, path, op):
    tags = ",".join(op.get("tags", []))
    summary = op.get("summary", "")
    tail = ""
    if tags:
        tail += f"  [{tags}]"
    if summary:
        tail += f"  — {summary}"
    return f"{method:6} {path}{tail}"


def cmd_list(spec, tag):
    rows = []
    for path, method, op in iter_ops(spec):
        if tag and tag not in op.get("tags", []):
            continue
        rows.append((path, method, op))
    rows.sort(key=lambda r: (r[0], r[1]))
    for path, method, op in rows:
        print(fmt_row(method, path, op))
    sys.stderr.write(f"\n총 {len(rows)}개 엔드포인트\n")


def cmd_search(spec, keywords):
    kws = [k.lower() for k in keywords]
    hits = []
    for path, method, op in iter_ops(spec):
        hay = " ".join([
            path,
            op.get("summary", ""),
            op.get("operationId", ""),
            " ".join(op.get("tags", [])),
        ]).lower()
        if all(k in hay for k in kws):
            hits.append((path, method, op))
    hits.sort(key=lambda r: (r[0], r[1]))
    for path, method, op in hits:
        print(fmt_row(method, path, op))
    sys.stderr.write(f"\n'{' '.join(keywords)}' 검색 결과 {len(hits)}개\n")
    if not hits:
        sys.stderr.write("→ 키워드를 줄이거나 `list` 로 전체를 훑어보세요.\n")


def collect_refs(node, acc):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == "$ref" and isinstance(v, str):
                acc.add(v)
            else:
                collect_refs(v, acc)
    elif isinstance(node, list):
        for it in node:
            collect_refs(it, acc)


def resolve_needed_schemas(spec, root):
    """root(operation 또는 schema)에서 도달 가능한 모든 컴포넌트 스키마를 BFS로 수집."""
    schemas = spec.get("components", {}).get("schemas", {})
    needed = set()
    refs = set()
    collect_refs(root, refs)
    queue = [r.split("/")[-1] for r in refs if "/schemas/" in r]
    while queue:
        name = queue.pop()
        if name in needed:
            continue
        needed.add(name)
        sch = schemas.get(name)
        if sch is None:
            continue
        child = set()
        collect_refs(sch, child)
        for r in child:
            if "/schemas/" in r:
                n = r.split("/")[-1]
                if n not in needed:
                    queue.append(n)
    return {n: schemas[n] for n in sorted(needed) if n in schemas}


def suggest_paths(spec, path):
    """경로 못 찾을 때 마지막 세그먼트 기준 유사 경로 추천."""
    paths = list(spec.get("paths", {}))
    tail = path.rstrip("/").split("/")[-1].lower()
    if not tail:
        return []
    cands = [p for p in paths if tail in p.lower()]
    if not cands:  # programs↔program 같은 오타: 접두 4글자로 완화
        pref = tail[:4]
        cands = [p for p in paths if pref in p.lower()]
    return sorted(set(cands))[:10]


def cmd_show(spec, method, path):
    paths = spec.get("paths", {})
    if path not in paths:
        msg = f"❌ 경로 없음: {path}"
        sug = suggest_paths(spec, path)
        if sug:
            msg += "\n비슷한 경로:\n  " + "\n  ".join(sug)
        sys.exit(msg)
    item = paths[path]
    m = method.lower()
    if m not in item:
        avail = [k.upper() for k in item if k.lower() in HTTP_METHODS]
        sys.exit(f"❌ {method} 메서드 없음. 가능한 메서드: {', '.join(avail)}")
    op = item[m]
    out = {
        "method": method.upper(),
        "path": path,
        "operation": op,
        "schemas": resolve_needed_schemas(spec, op),
    }
    print(json.dumps(out, ensure_ascii=False, indent=2))


def cmd_schema(spec, name):
    schemas = spec.get("components", {}).get("schemas", {})
    if name not in schemas:
        cands = sorted([s for s in schemas if name.lower() in s.lower()])[:10]
        msg = f"❌ 스키마 없음: {name}"
        if cands:
            msg += "\n비슷한 스키마:\n  " + "\n  ".join(cands)
        sys.exit(msg)
    out = {name: schemas[name]}
    out.update(resolve_needed_schemas(spec, schemas[name]))
    print(json.dumps(out, ensure_ascii=False, indent=2))


def cmd_tags(spec):
    counter = {}
    for _, _, op in iter_ops(spec):
        for t in op.get("tags", []):
            counter[t] = counter.get(t, 0) + 1
    for t in sorted(counter):
        print(f"{counter[t]:4}  {t}")
    sys.stderr.write(f"\n총 {len(counter)}개 태그\n")


def main():
    p = argparse.ArgumentParser(add_help=True)
    p.add_argument("command", choices=["list", "search", "show", "schema", "tags"])
    p.add_argument("args", nargs="*")
    p.add_argument("--tag")
    p.add_argument("--refresh", action="store_true")
    p.add_argument("--url", default=DEFAULT_URL)
    ns = p.parse_args()

    spec = load_spec(ns.url, ns.refresh)

    if ns.command == "list":
        cmd_list(spec, ns.tag)
    elif ns.command == "tags":
        cmd_tags(spec)
    elif ns.command == "search":
        if not ns.args:
            sys.exit("사용: swagger.py search <keyword> [keyword ...]")
        cmd_search(spec, ns.args)
    elif ns.command == "show":
        if len(ns.args) < 2:
            sys.exit("사용: swagger.py show <METHOD> <PATH>  (예: show GET /api/v1/program)")
        cmd_show(spec, ns.args[0], ns.args[1])
    elif ns.command == "schema":
        if not ns.args:
            sys.exit("사용: swagger.py schema <SchemaName>")
        cmd_schema(spec, ns.args[0])


if __name__ == "__main__":
    main()
