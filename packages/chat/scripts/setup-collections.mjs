// @letscareer/chat — PocketBase 컬렉션 자동 생성 스크립트 (임시 채팅용).
//
// PocketBase Admin API + JS SDK로 chat_rooms / chat_messages 컬렉션을
// 슈퍼유저 권한으로 생성한다. UI Import("Invalid collections configuration")가
// 까다로워 코드로 생성하는 경로. 멱등(idempotent): 이미 있으면 규칙만 갱신.
//
// 사용법 (슈퍼유저 = PocketBase Admin 로그인 계정):
//   PB_ADMIN_EMAIL='you@example.com' PB_ADMIN_PASSWORD='****' \
//     pnpm -F @letscareer/chat setup:pb
//
//   # 또는 직접:
//   PB_ADMIN_EMAIL=... PB_ADMIN_PASSWORD=... \
//     node packages/chat/scripts/setup-collections.mjs
//
//   # PB 주소 override가 필요하면 PB_URL=... 추가
//
// 정식 BE 채팅 전환 시 이 패키지 폴더와 함께 삭제하면 된다.

import PocketBase from 'pocketbase';

const PB_URL =
  process.env.PB_URL ||
  'https://pocketbase-vwp7yn8luvxu80x8qlqg9y0l.supabin.com';
const email = process.env.PB_ADMIN_EMAIL;
const password = process.env.PB_ADMIN_PASSWORD;

if (!email || !password) {
  console.error(
    '\n[setup:pb] 슈퍼유저 자격이 필요합니다.\n' +
      "  PB_ADMIN_EMAIL='you@example.com' PB_ADMIN_PASSWORD='****' " +
      'pnpm -F @letscareer/chat setup:pb\n',
  );
  process.exit(1);
}

/** 공개(오픈) 규칙: '' = 누구나, null = 잠금. PRD §6. */
const OPEN = '';
const LOCK = null;

const CHAT_ROOMS = {
  name: 'chat_rooms',
  type: 'base',
  listRule: OPEN,
  viewRule: OPEN,
  createRule: OPEN,
  updateRule: OPEN, // lastReadAt·종료 플래그 갱신 허용
  deleteRule: OPEN, // 양쪽 종료 시 방 삭제 허용 (임시)
  fields: [
    { name: 'room', type: 'text', required: true, max: 100 },
    { name: 'menteeName', type: 'text', max: 100 },
    { name: 'mentorName', type: 'text', max: 100 },
    { name: 'challengeTitle', type: 'text', max: 200 },
    { name: 'mentorLastReadAt', type: 'date' },
    { name: 'menteeLastReadAt', type: 'date' },
    // 채팅 종료 플래그 — 멘토·멘티 둘 다 종료하면 방을 삭제한다.
    { name: 'mentorEnded', type: 'bool' },
    { name: 'menteeEnded', type: 'bool' },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ],
  indexes: [
    'CREATE UNIQUE INDEX `idx_chat_rooms_room` ON `chat_rooms` (`room`)',
  ],
};

const CHAT_MESSAGES = {
  name: 'chat_messages',
  type: 'base',
  listRule: OPEN,
  viewRule: OPEN,
  createRule: OPEN, // 전송
  updateRule: LOCK, // 메시지 수정 불가
  deleteRule: OPEN, // 방 삭제 시 메시지 정리 허용 (임시)
  fields: [
    { name: 'room', type: 'text', required: true, max: 100 },
    {
      name: 'sender',
      type: 'select',
      required: true,
      maxSelect: 1,
      values: ['mentor', 'mentee', 'system'],
    },
    { name: 'text', type: 'text', required: true, max: 5000 },
    { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
  ],
  indexes: [
    'CREATE INDEX `idx_chat_messages_room` ON `chat_messages` (`room`)',
    'CREATE INDEX `idx_chat_messages_created` ON `chat_messages` (`created`)',
  ],
};

/** PB v0.23+ 슈퍼유저 인증 (구버전 admins 폴백 포함). */
async function authSuperuser(pb) {
  try {
    return await pb.collection('_superusers').authWithPassword(email, password);
  } catch (err) {
    if (pb.admins?.authWithPassword) {
      return await pb.admins.authWithPassword(email, password);
    }
    throw err;
  }
}

/** 멱등 upsert: 없으면 생성, 있으면 규칙만 갱신(필드 파괴 방지). */
async function upsertCollection(pb, cfg) {
  const existing = await pb.collections.getOne(cfg.name).catch(() => null);
  if (existing) {
    // 기존 필드(id 보존)는 유지하되 select values는 cfg 기준으로 갱신,
    // cfg에만 있는 신규 필드(name 기준)는 추가.
    const cfgByName = new Map(cfg.fields.map((f) => [f.name, f]));
    const fields = existing.fields.map((ef) => {
      const cf = cfgByName.get(ef.name);
      if (cf && cf.type === 'select' && Array.isArray(cf.values)) {
        return { ...ef, values: cf.values };
      }
      return ef;
    });
    const existingNames = new Set(existing.fields.map((f) => f.name));
    for (const f of cfg.fields) {
      if (!existingNames.has(f.name)) fields.push(f);
    }
    await pb.collections.update(existing.id, {
      fields,
      listRule: cfg.listRule,
      viewRule: cfg.viewRule,
      createRule: cfg.createRule,
      updateRule: cfg.updateRule,
      deleteRule: cfg.deleteRule,
    });
    console.log(`✓ 갱신(필드 병합 + 규칙): ${cfg.name}`);
  } else {
    await pb.collections.create(cfg);
    console.log(`✓ 생성 완료: ${cfg.name}`);
  }
}

async function main() {
  const pb = new PocketBase(PB_URL);
  pb.autoCancellation(false);

  console.log(`[setup:pb] 대상: ${PB_URL}`);
  await authSuperuser(pb);
  console.log('[setup:pb] 슈퍼유저 인증 성공');

  for (const cfg of [CHAT_ROOMS, CHAT_MESSAGES]) {
    try {
      await upsertCollection(pb, cfg);
    } catch (err) {
      console.error(
        `✗ 실패: ${cfg.name} —`,
        err?.response ?? err?.message ?? err,
      );
      process.exitCode = 1;
    }
  }

  console.log('[setup:pb] 종료');
}

main().catch((err) => {
  console.error('[setup:pb] 치명적 오류:', err?.response ?? err?.message ?? err);
  process.exit(1);
});
