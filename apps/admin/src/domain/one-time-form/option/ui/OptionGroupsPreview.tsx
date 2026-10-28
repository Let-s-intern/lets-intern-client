import type { OptionGroupDraft } from '../types/optionGroupDraft';
import {
  formatAdditionalPrice,
  getVisibleOptionGroups,
} from '../utils/optionPreview';

interface OptionGroupsPreviewProps {
  groups: OptionGroupDraft[];
}

/**
 * 신청 화면의 옵션 선택(시안 7절 오른쪽). 저장 전 값을 그대로 보여 준다.
 * 하나만은 라디오, 여러 개는 체크박스 모양이다. 필수 하나만 그룹은 첫 옵션을 고른 모습으로 둔다.
 */
const OptionGroupsPreview = ({ groups }: OptionGroupsPreviewProps) => {
  const visibleGroups = getVisibleOptionGroups(groups);
  if (visibleGroups.length === 0) return null;

  return (
    <div className="border-neutral-80 flex flex-col gap-6 rounded-md border p-4">
      {visibleGroups.map((group) => {
        const isSingle = group.selectType === 'SINGLE';
        return (
          <div key={group.key} className="flex flex-col gap-2">
            <div>
              <p className="text-xsmall16 text-neutral-0 font-bold">
                {group.title.trim() || '그룹 제목'}
              </p>
              {group.description.trim() ? (
                <p className="text-xxsmall12 text-neutral-40 mt-0.5">
                  {group.description}
                </p>
              ) : null}
            </div>
            <ul className="flex flex-col gap-2">
              {group.options.map((option, index) => {
                const isSelected = isSingle && group.isRequired && index === 0;
                return (
                  <li
                    key={option.key}
                    data-selected={isSelected}
                    className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 ${
                      isSelected ? 'border-primary' : 'border-neutral-80'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`mt-0.5 h-4 w-4 flex-none border ${
                        isSingle ? 'rounded-full' : 'rounded-xxs'
                      } ${
                        isSelected
                          ? 'border-primary border-[5px]'
                          : 'border-neutral-80'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xsmall14 text-neutral-0 break-words font-semibold">
                        {option.name.trim() || '옵션 이름'}
                        {option.badge.trim() ? (
                          <span className="text-xxsmall10 bg-primary-10 text-primary rounded-xxs ml-1.5 px-1 py-0.5 align-middle font-semibold">
                            {option.badge}
                          </span>
                        ) : null}
                      </p>
                      {option.description.trim() ? (
                        <p className="text-xxsmall12 text-neutral-40 mt-0.5">
                          {option.description}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`text-xsmall14 flex-none font-semibold ${
                        isSelected ? 'text-primary' : 'text-neutral-0'
                      }`}
                    >
                      {formatAdditionalPrice(option.additionalPrice)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default OptionGroupsPreview;
