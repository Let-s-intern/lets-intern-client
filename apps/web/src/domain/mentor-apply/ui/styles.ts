/*
  멘토 신청 화면은 렛츠커리어 토큰이 아니라 멘토 모집 시안(lets-mentor 저장소)의 값을 그대로 쓴다.
  시안은 Tailwind 기본 반경을 쓰지만 web 프리셋은 rounded-* 를 덮어써서, 반경은 px 로 고정한다.
  brand-50 #eef0ff, brand-100 #dfe1fe, brand-500 #6f76f7, brand-600 #4d55f5, brand-700 #3a41d6
*/

export const inputClassName =
  'w-full rounded-[8px] border border-zinc-300 bg-white px-3.5 py-2.5 text-[15px] text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#6f76f7] focus:ring-2 focus:ring-[#dfe1fe]';

export const inputInvalidClassName = 'border-red-400 focus:border-red-400';

export const primaryButtonClassName =
  'rounded-[8px] bg-[#4d55f5] font-semibold text-white transition-colors hover:bg-[#3a41d6] disabled:cursor-not-allowed disabled:opacity-60';

export const secondaryButtonClassName =
  'rounded-[8px] border border-zinc-200 font-semibold text-zinc-700 transition-colors hover:bg-zinc-50';

export const chipClassName =
  'inline-block rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 peer-checked:border-[#4d55f5] peer-checked:bg-[#eef0ff] peer-checked:font-semibold peer-checked:text-[#3a41d6] peer-focus-visible:ring-2 peer-focus-visible:ring-[#dfe1fe]';

export const pageTitleClassName = 'text-3xl font-bold tracking-tight';
