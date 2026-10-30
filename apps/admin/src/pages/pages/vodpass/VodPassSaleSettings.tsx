import { Switch } from '@mui/material';
import { useMemo, useState } from 'react';

import { useGetProgramAdminQuery } from '@/api/program';
import {
  toVodPassSaleKey,
  useUpdateVodPassSaleMutation,
  useVodPassSaleQuery,
  VOD_PASS_SALE_PROGRAM_TYPES,
  type VodPassSaleProgramType,
} from '@/api/vodPassSale';
import Table from '@/domain/admin/ui/table/regacy/Table';
import TD from '@/domain/admin/ui/table/regacy/TD';
import TH from '@/domain/admin/ui/table/regacy/TH';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { programStatusToText } from '@/utils/convert';

const TYPE_LABEL: Record<VodPassSaleProgramType, string> = {
  CHALLENGE: '챌린지',
  LIVE: '라이브',
  VOD: 'VOD',
  REPORT: '리포트',
  GUIDEBOOK: '자료집',
  MEMBERSHIP: '올인원패스',
};

const isSaleProgramType = (type: string): type is VodPassSaleProgramType =>
  (VOD_PASS_SALE_PROGRAM_TYPES as readonly string[]).includes(type);

/**
 * VOD 이용권 판매 설정 (LC-3438).
 *
 * 프로그램마다 결제 시트에 VOD 이용권을 노출할지 켜고 끈다. 기본값은 꺼짐이고,
 * 켠 프로그램만 서버가 이용권 상품을 내려주고 구매 요청을 받는다.
 * 지금 결제가 연동된 유형은 챌린지뿐이다. 다른 유형은 설정만 저장된다.
 */
const VodPassSaleSettings = () => {
  const { snackbar } = useAdminSnackbar();
  const [typeFilter, setTypeFilter] = useState<'ALL' | VodPassSaleProgramType>(
    'ALL',
  );

  const programsQuery = useGetProgramAdminQuery({ page: 1, size: 1000 });
  const saleQuery = useVodPassSaleQuery();
  const updateSale = useUpdateVodPassSaleMutation({
    onError: (message) => snackbar(message),
  });

  const rows = useMemo(
    () =>
      (programsQuery.data?.programList ?? [])
        .map((item) => item.programInfo)
        .filter((info) => isSaleProgramType(info.programType))
        // 올인원패스는 이 목록이 아니라 올인원패스 목록에서 가져온다
        .filter((info) => info.programType !== 'MEMBERSHIP')
        // 모집 마감은 새로 판매를 켤 일이 없어 목록에서 뺀다. 이미 켜 둔 설정은 그대로 남는다
        .filter((info) => info.programStatusType !== 'POST')
        .filter(
          (info) => typeFilter === 'ALL' || info.programType === typeFilter,
        ),
    [programsQuery.data, typeFilter],
  );

  const renderBody = () => {
    if (programsQuery.isLoading || saleQuery.isLoading) {
      return <p className="text-sm">불러오는 중입니다.</p>;
    }
    if (programsQuery.error || saleQuery.error) {
      return (
        <p role="alert" className="text-sm text-red-500">
          설정을 불러오지 못했습니다.
        </p>
      );
    }

    const enabledKeys = saleQuery.data ?? new Set<string>();
    const pendingKey = updateSale.isPending
      ? toVodPassSaleKey(
          updateSale.variables.programType,
          updateSale.variables.programId,
        )
      : null;

    return (
      <>
        <div className="mb-4 flex items-center gap-4">
          <label className="text-xsmall14 font-medium" htmlFor="sale-type">
            프로그램 유형
          </label>
          <select
            id="sale-type"
            className="rounded-xxs border border-neutral-300 px-3 py-2 text-sm"
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as 'ALL' | VodPassSaleProgramType)
            }
          >
            <option value="ALL">전체</option>
            {VOD_PASS_SALE_PROGRAM_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABEL[type]}
              </option>
            ))}
          </select>
          <span className="text-sm">총 {rows.length}건</span>
        </div>
        <Table minWidth={800}>
          <thead>
            <tr>
              <TH>유형</TH>
              <TH>프로그램</TH>
              <TH>상태</TH>
              <TH>VOD 이용권 판매</TH>
            </tr>
          </thead>
          <tbody>
            {rows.map((info) => {
              const type = info.programType as VodPassSaleProgramType;
              const key = toVodPassSaleKey(type, info.id);
              return (
                <tr key={key}>
                  <TD>{TYPE_LABEL[type]}</TD>
                  <TD textAlign="left">{info.title ?? '-'}</TD>
                  <TD>{programStatusToText[info.programStatusType]}</TD>
                  <TD>
                    <Switch
                      checked={enabledKeys.has(key)}
                      disabled={pendingKey === key}
                      inputProps={{
                        'aria-label': `${info.title ?? ''} VOD 이용권 판매`,
                      }}
                      onChange={(_, checked) =>
                        updateSale.mutate({
                          programType: type,
                          programId: info.id,
                          enabled: checked,
                        })
                      }
                    />
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {rows.length === 0 && (
          <p className="mt-4 text-sm">조건에 맞는 프로그램이 없습니다.</p>
        )}
      </>
    );
  };

  return (
    <div className="p-8">
      <h1 className="text-1.5-bold mb-2">VOD 이용권 판매 설정</h1>
      <p className="mb-6 text-sm text-neutral-500">
        켠 프로그램에서만 VOD 이용권을 판매합니다. 기본값은 꺼짐입니다. 모집 전,
        모집 중인 프로그램만 보입니다. 지금은 챌린지에서만 결제가 연동되어 있고,
        다른 유형은 설정만 저장됩니다.
      </p>
      {renderBody()}
    </div>
  );
};

export default VodPassSaleSettings;
