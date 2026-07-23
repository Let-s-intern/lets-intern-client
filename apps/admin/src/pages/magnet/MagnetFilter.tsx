import ActionButton from '@/domain/admin/ui/button/ActionButton';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { MAGNET_TYPE, MagnetFilterValues, MagnetTypeKey } from './types';

interface MagnetFilterProps {
  values: MagnetFilterValues;
  onChange: (values: MagnetFilterValues) => void;
  onSearch: () => void;
  onShowAll: () => void;
}

const MagnetFilter = ({
  values,
  onChange,
  onSearch,
  onShowAll,
}: MagnetFilterProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div>
      <div className="rounded border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex gap-4">
          <TextField
            size="small"
            label="마그넷 ID"
            value={values.magnetId}
            onChange={(e) => onChange({ ...values, magnetId: e.target.value })}
            onKeyDown={handleKeyDown}
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>타입</InputLabel>
            <Select
              value={values.type}
              label="타입"
              onChange={(e) => onChange({ ...values, type: e.target.value })}
            >
              <MenuItem value="">전체</MenuItem>
              {Object.entries(MAGNET_TYPE).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mb-3">
          <TextField
            size="small"
            label="제목 키워드"
            value={values.titleKeyword}
            onChange={(e) =>
              onChange({ ...values, titleKeyword: e.target.value })
            }
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            type="button"
            bgColor="blue"
            width="5rem"
            onClick={onSearch}
          >
            검색
          </ActionButton>
          <ActionButton
            type="button"
            bgColor="gray"
            width="5rem"
            onClick={onShowAll}
          >
            전체보기
          </ActionButton>
          <span className="ml-2 text-sm text-neutral-500">
            여러 값을 입력할 경우 쉼표(,) 또는 줄바꿈으로 구분해주세요.
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-400">
        필터 적용 시 페이지는 초기화됩니다. 그리드의 정렬 및 검색 기능은
        지원하지 않습니다.
      </p>

      {/* 노출·접속 상태 필드 안내 (어드민이 마그넷 노출 상태를 이해하도록 표시) */}
      <div className="mt-3 flex flex-col gap-1 rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
        <p className="font-semibold text-neutral-900">※ 노출·접속 상태 안내</p>
        <p>
          • <b>접속가능</b> : 신청 링크(신청폼)에 접속·신청할 수 있는지 여부.
          무료 자료집의 <b>출시 알림 일괄신청 목록</b>은 신청폼 내부에 있기
          때문에, 신청폼 접근 여부(= 접속가능)에 따라 보이거나 사라집니다.
        </p>
        <p>
          • <b>목록노출</b> : 목록에 띄울지 여부. 유저{' '}
          <b>마이페이지 출시 알림 목록</b>은 이 값을 탑니다.
        </p>
        <p>
          • <b>공개 예정일(노출 시작일)·노출 종료일</b> : 마그넷의 동작(활성)
          여부가 이 기간으로 결정됩니다. 시작일 전 = 공개 예정, 종료일 후 =
          만료(접속·노출 모두 불가). 출시 알림은 종료일까지 구독 가능합니다.
        </p>
        <p className="mt-1 text-neutral-500">
          ※ 출시 알림 마그넷은 무료 자료집 목록에는 노출하지 않습니다(고정).
          한편 유저 마이페이지 출시 알림 목록은 <b>목록노출</b> 값을 타므로,
          목록노출을 켜야 멘티 마이페이지에 떠서 출시 알림 끄기(신청 취소)가
          가능합니다. 비공개면 신청되어도 마이페이지에 뜨지 않으며, 이 동작을
          바꾸려면 서버 수정이 필요합니다.
        </p>
      </div>
    </div>
  );
};

export default MagnetFilter;
