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
          • <b>상세 접속</b> : 상세 페이지가 열리는지 여부. 끄면 상세·신청이
          모두 막히고, 목록·마이페이지·검색 노출도 함께 잠깁니다(출시 알림
          제외).
        </p>
        <p>
          • <b>신청 가능</b> : 신청 페이지에서 신청할 수 있는지 여부. 상세는
          열어 두고 신청만 마감할 때 끕니다. 무료 자료집의{' '}
          <b>출시 알림 일괄신청 목록</b>은 신청폼 안에 있으므로 신청이 막히면
          함께 보이지 않습니다.
        </p>
        <p>
          • <b>목록노출</b> : 무료 자료집 목록에 띄울지 여부. 끄면 링크로만
          들어올 수 있습니다.
        </p>
        <p>
          • <b>마이페이지</b> : 신청한 사람의 MY 자료집·마이페이지(출시 알림
          목록 포함)에 보일지 여부. 기본 켬.
        </p>
        <p>
          • <b>검색 노출</b> : 검색엔진 색인 여부. 끄면 상세가 noindex 가 되고
          sitemap 에서 빠집니다. 기본 켬.
        </p>
        <p>
          • <b>공개 예정일(노출 시작일)·노출 종료일</b> : 마그넷의 동작(활성)
          여부가 이 기간으로 결정됩니다. 시작일 전 = 공개 예정, 종료일 후 =
          만료(접속·노출 모두 불가). 출시 알림은 종료일까지 구독 가능합니다.
        </p>
        <p className="mt-1 text-neutral-500">
          ※ 출시 알림 마그넷은 무료 자료집 목록에는 노출하지 않습니다(고정).
          멘티 마이페이지 출시 알림 목록(출시 알림 끄기)은 <b>마이페이지</b>{' '}
          값을 탑니다.
        </p>
      </div>
    </div>
  );
};

export default MagnetFilter;
