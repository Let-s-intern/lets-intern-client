import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { bankTypeToText, feeTypeToText } from '../../../../../utils/convert';
import Input from '../../../../ui/input/Input';
import { DateTimeControl, DateTimeLabel } from '../editor/ProgramInputContent';

interface Props {
  values: any;
  setValues: (values: any) => void;
  editorMode: 'create' | 'edit';
}

const FeeSection = ({ values, setValues, editorMode }: Props) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel id="feeType">금액 유형</InputLabel>
        <Select
          labelId="feeType"
          id="feeType"
          label="금액 유형"
          value={values.feeType ? values.feeType : ''}
          onChange={(e) => {
            setValues({ ...values, feeType: e.target.value });
          }}
        >
          {Object.keys(feeTypeToText).map((feeType: any) => (
            <MenuItem value={feeType}>{feeTypeToText[feeType]}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {(values.feeType === 'CHARGE' || values.feeType === 'REFUND') && (
        <>
          <Input
            label="이용료 금액"
            type="number"
            value={
              values.feeCharge !== null
                ? values.feeCharge
                : editorMode === 'edit'
                ? '0'
                : ''
            }
            placeholder="이용료 금액을 입력하세요"
            onChange={(e: any) =>
              setValues({ ...values, feeCharge: e.target.value })
            }
          />
          {values.feeType === 'REFUND' && (
            <Input
              label="보증금 금액"
              type="number"
              value={
                values.feeRefund !== null
                  ? values.feeRefund
                  : editorMode === 'edit'
                  ? '0'
                  : ''
              }
              placeholder="보증금 금액을 입력하세요"
              onChange={(e: any) =>
                setValues({ ...values, feeRefund: e.target.value })
              }
            />
          )}
          <FormControl fullWidth>
            <InputLabel id="accountType">입금계좌 은행</InputLabel>
            <Select
              labelId="accountType"
              id="accountType"
              label="입금계좌 은행"
              value={values.accountType ? values.accountType : ''}
              onChange={(e) => {
                setValues({ ...values, accountType: e.target.value });
              }}
            >
              {Object.keys(bankTypeToText).map((bankType: any) => (
                <MenuItem value={bankType}>{bankTypeToText[bankType]}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Input
            label="입금계좌 번호"
            value={values.accountNumber ? values.accountNumber : ''}
            placeholder="입금계좌 번호를 입력하세요"
            onChange={(e: any) =>
              setValues({ ...values, accountNumber: e.target.value })
            }
          />
          <Input
            label="할인 금액"
            type="number"
            value={
              values.discountValue !== null
                ? values.discountValue
                : editorMode === 'edit'
                ? '0'
                : ''
            }
            onChange={(e: any) =>
              setValues({ ...values, discountValue: e.target.value })
            }
          />
          <DateTimeControl>
            <DateTimeLabel htmlFor="feeDueDate">입금 마감 기한</DateTimeLabel>
            <input
              id="feeDueDate"
              type="datetime-local"
              value={values.feeDueDate}
              onChange={(e) =>
                setValues({ ...values, feeDueDate: e.target.value })
              }
            />
          </DateTimeControl>
        </>
      )}
    </>
  );
};

export default FeeSection;
