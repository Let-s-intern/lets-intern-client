import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { bankTypeToText, feeTypeToText } from '../../../../../utils/convert';
import Input from '../../../../ui/input/Input';
import { DateTimeControl, DateTimeLabel } from '../editor/ProgramEditor';

interface Props {
  values: any;
  setValues: (values: any) => void;
}

const FeeSection = ({ values, setValues }: Props) => {
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
      {(values.feeType === 'CHARGE' || values.feeType === 'DEPOSIT') && (
        <>
          <Input
            label="금액"
            type="number"
            value={values.feeTotal ? values.feeTotal : ''}
            placeholder="금액을 입력하세요"
            onChange={(e: any) =>
              setValues({ ...values, feeTotal: e.target.value })
            }
          />
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
            type="number"
            value={values.accountNumber ? values.accountNumber : ''}
            placeholder="입금계좌 번호를 입력하세요"
            onChange={(e: any) =>
              setValues({ ...values, accountNumber: e.target.value })
            }
          />
          <DateTimeControl>
            <DateTimeLabel htmlFor="depositDueDate">
              입금 마감 기한
            </DateTimeLabel>
            <input
              id="depositDueDate"
              type="datetime-local"
              value={values.depositDueDate}
              onChange={(e) =>
                setValues({ ...values, depositDueDate: e.target.value })
              }
            />
          </DateTimeControl>
        </>
      )}
    </>
  );
};

export default FeeSection;
