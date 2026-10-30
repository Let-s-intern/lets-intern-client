import {
  toVodPassSaleKey,
  useUpdateVodPassSaleMutation,
  useVodPassSaleQuery,
} from '@/api/vodPassSale';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { Switch } from '@mui/material';

interface Props {
  passId: number;
}

/**
 * 올인원패스 VOD 옵션 추가결제 판매 토글 (LC-3533).
 *
 * VOD 이용권 판매 설정 화면과 같은 값을 읽고 쓴다. 폼 저장과 별개로 바꾸는 즉시 저장된다.
 */
export default function VodPassSaleToggle({ passId }: Props) {
  const { snackbar } = useAdminSnackbar();
  const saleQuery = useVodPassSaleQuery();
  const updateSale = useUpdateVodPassSaleMutation({
    onError: (message) => snackbar(message),
  });

  const checked =
    saleQuery.data?.has(toVodPassSaleKey('MEMBERSHIP', passId)) ?? false;

  return (
    <div className="flex items-center gap-1">
      <span className="text-xsmall14 font-medium">VOD 옵션 추가결제</span>
      <Switch
        checked={checked}
        disabled={
          saleQuery.isLoading ||
          Boolean(saleQuery.error) ||
          updateSale.isPending
        }
        inputProps={{ 'aria-label': 'VOD 옵션 추가결제' }}
        onChange={(_, enabled) =>
          updateSale.mutate({
            programType: 'MEMBERSHIP',
            programId: passId,
            enabled,
          })
        }
      />
      {saleQuery.error && (
        <span role="alert" className="text-xsmall14 text-red-500">
          판매 설정을 불러오지 못했습니다.
        </span>
      )}
    </div>
  );
}
