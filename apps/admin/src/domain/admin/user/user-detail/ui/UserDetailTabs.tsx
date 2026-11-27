export type UserDetailTabKey =
  | 'info'
  | 'purchase'
  | 'mentoring'
  | 'inquiry'
  | 'coupon';

export const USER_DETAIL_TABS: { key: UserDetailTabKey; label: string }[] = [
  { key: 'info', label: '기본 정보' },
  { key: 'purchase', label: '구매·참여 이력' },
  { key: 'mentoring', label: '멘토링 제출' },
  { key: 'inquiry', label: '문의' },
  { key: 'coupon', label: '쿠폰' },
];

interface Props {
  value: UserDetailTabKey;
  onChange: (key: UserDetailTabKey) => void;
}

/** 유저 상세의 섹션 전환. 문의와 쿠폰은 탭을 열 때만 조회하므로 선택된 탭만 그린다. */
const UserDetailTabs = ({ value, onChange }: Props) => (
  <div role="tablist" className="flex gap-x-1 border-b">
    {USER_DETAIL_TABS.map((tab) => (
      <button
        key={tab.key}
        type="button"
        role="tab"
        aria-selected={value === tab.key}
        className={`px-4 py-2 text-sm ${
          value === tab.key
            ? 'border-b-2 border-black font-semibold'
            : 'text-neutral-500 hover:text-black'
        }`}
        onClick={() => onChange(tab.key)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default UserDetailTabs;
