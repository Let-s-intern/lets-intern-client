import {
  Autocomplete,
  FormControlLabel,
  Switch,
  TextField,
} from '@mui/material';
import { WEB_MENU } from '../constants/webMenu';
import type { ProgramCategoryGroup } from '../programCategoryApi';
import type { LandingMenuDraft } from '../utils/placementUtils';

/** 메뉴 묶음 고르기 후보. 이미 쓰는 묶음 이름과 지금 웹 메뉴의 묶음 이름 */
export const menuGroupOptions = (groups: ProgramCategoryGroup[]) => [
  ...new Set([
    ...groups.flatMap((g) =>
      (g.placements ?? [])
        .map((p) => p.menuGroup?.trim())
        .filter((v): v is string => Boolean(v)),
    ),
    ...WEB_MENU.map((m) => m.group),
  ]),
];

/**
 * 랜딩 페이지의 GNB 메뉴와 상단 문구. 페이지 설정과 랜딩 추가 창에서 같이 쓴다.
 * 메뉴 이름을 비우면 노출 목록 이름, 상단 문구를 비우면 사이트 기본 문구가 보인다
 */
const LandingMenuFields = ({
  value,
  onChange,
  groups,
  defaultLabel,
}: {
  value: LandingMenuDraft;
  onChange: (next: LandingMenuDraft) => void;
  groups: ProgramCategoryGroup[];
  /** 메뉴 이름을 비웠을 때 보일 이름 (노출 목록 이름) */
  defaultLabel: string;
}) => {
  const set = (patch: Partial<LandingMenuDraft>) =>
    onChange({ ...value, ...patch });
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={value.showInMenu}
              onChange={(e) => set({ showInMenu: e.target.checked })}
            />
          }
          label={<span className="text-xsmall14">메뉴에 보이기</span>}
        />
        {value.showInMenu && (
          <div className="grid grid-cols-[1fr_1fr_88px] gap-2">
            <Autocomplete
              freeSolo
              size="small"
              options={menuGroupOptions(groups)}
              value={value.menuGroup}
              onInputChange={(_, next) => set({ menuGroup: next })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="메뉴 그룹"
                  placeholder="예: 서류 작성"
                />
              )}
            />
            <TextField
              size="small"
              label="메뉴 이름"
              placeholder={defaultLabel || '노출 목록 이름'}
              value={value.menuLabel}
              inputProps={{ maxLength: 30 }}
              onChange={(e) => set({ menuLabel: e.target.value })}
            />
            <TextField
              size="small"
              label="순서"
              value={value.menuOrder ?? ''}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '');
                set({ menuOrder: digits === '' ? null : Number(digits) });
              }}
            />
          </div>
        )}
        <p className="text-xxsmall12 text-neutral-40">
          {value.showInMenu
            ? '사이트 GNB "프로그램 카테고리"에 그룹별로, 순서가 작은 것부터 보여요. 메뉴 이름을 비우면 노출 목록 이름이 보여요.'
            : '끄면 메뉴에는 안 보이고 주소로만 열려요.'}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <TextField
          size="small"
          label="상단 제목"
          placeholder="비우면 사이트 기본 문구"
          value={value.heroTitle}
          inputProps={{ maxLength: 100 }}
          onChange={(e) => set({ heroTitle: e.target.value })}
        />
        <TextField
          size="small"
          label="상단 설명"
          placeholder="비우면 사이트 기본 문구"
          value={value.heroDescription}
          inputProps={{ maxLength: 300 }}
          multiline
          minRows={2}
          onChange={(e) => set({ heroDescription: e.target.value })}
        />
      </div>
    </div>
  );
};

export default LandingMenuFields;
