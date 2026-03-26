import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import Input from '../../../../../../../common/input/v1/Input';
import {
  bankTypeToText,
  wishJobToText,
} from '../../../../../../../utils/convert';
import InputPriceContent from '../../../ui/price/InputPriceContent';

interface MemberInfoInputContentProps {
  user: any;
  setUser: (user: any) => void;
  hasDetailInfo: boolean;
  isLoggedIn: boolean;
  program: any;
  wishJobList: any;
  handleApplyInput: (e: any) => void;
  couponDiscount: number;
  setCouponDiscount: (couponDiscount: number) => void;
}

const MemberInfoInputContent = ({
  user,
  setUser,
  hasDetailInfo,
  isLoggedIn,
  program,
  wishJobList,
  handleApplyInput,
  couponDiscount,
  setCouponDiscount,
}: MemberInfoInputContentProps) => {
  const dropdownStyle = {
    '& .MuiOutlinedInput-root': {
      '&:hover fieldset': {
        borderColor: '#6963f6',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#6963f6',
      },
    },
    '& label.Mui-focused': {
      color: '#6963F6',
    },
  };

  return (
    <>
      <h1 className="text-center text-xl">신청 정보</h1>
      <form className="mt-5 w-full">
        <div className="mx-auto flex max-w-md flex-col gap-3">
          <Input
            label="이름"
            name="name"
            value={user.name}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            type="email"
            label="이메일"
            name="email"
            placeholder="example@example.com"
            value={user.email}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="전화번호"
            name="phoneNum"
            placeholder="010-1234-5678"
            value={user.phoneNum}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          {isLoggedIn && (
            <>
              <Input
                label="학교"
                name="university"
                placeholder="렛츠대학교"
                value={user.university}
                onChange={(e) => handleApplyInput(e)}
                disabled={hasDetailInfo}
              />
              <Input
                label="전공"
                name="major"
                placeholder="컴퓨터공학과"
                value={user.major}
                onChange={(e) => handleApplyInput(e)}
                disabled={hasDetailInfo}
              />
            </>
          )}
          {program.feeType === 'REFUND' && (
            <>
              {' '}
              <FormControl fullWidth sx={dropdownStyle}>
                <InputLabel id="acccount-type">환급계좌 은행</InputLabel>
                <Select
                  labelId="acccount-type"
                  id="acccount-type"
                  label="환급계좌 은행"
                  name="accountType"
                  value={user.accountType}
                  onChange={(e) => handleApplyInput(e)}
                >
                  {Object.keys(bankTypeToText).map((bankType: any) => (
                    <MenuItem value={bankType}>
                      {bankTypeToText[bankType]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Input
                label="환급계좌 번호"
                name="accountNumber"
                placeholder="- 없이 숫자만 입력"
                value={user.accountNumber}
                onChange={(e) => handleApplyInput(e)}
              />
            </>
          )}
          <FormControl fullWidth sx={dropdownStyle}>
            <InputLabel id="grade">학년</InputLabel>
            <Select
              labelId="grade"
              id="grade"
              label="학년"
              name="grade"
              value={user.grade}
              onChange={(e) => handleApplyInput(e)}
            >
              <MenuItem value="1">1학년</MenuItem>
              <MenuItem value="2">2학년</MenuItem>
              <MenuItem value="3">3학년</MenuItem>
              <MenuItem value="4">4학년</MenuItem>
              <MenuItem value="5">5학년 이상</MenuItem>
              <MenuItem value="-1">졸업생</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={dropdownStyle}>
            <InputLabel id="wish-job">희망 직무</InputLabel>
            <Select
              labelId="wish-job"
              id="wish-job"
              label="희망 직무"
              name="wishJob"
              value={user.wishJob}
              onChange={(e) => handleApplyInput(e)}
            >
              {wishJobList.map((wishJobKey: any) => (
                <MenuItem value={wishJobKey}>
                  {wishJobToText[wishJobKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Input
            label="희망 기업 형태"
            name="wishCompany"
            value={user.wishCompany}
            onChange={(e) => handleApplyInput(e)}
          />
          <FormControl fullWidth sx={dropdownStyle}>
            <InputLabel id="inflowPath">유입 경로</InputLabel>
            <Select
              labelId="inflowPath"
              id="inflowPath"
              label="유입 경로"
              name="inflowPath"
              value={user.inflowPath}
              onChange={(e) => handleApplyInput(e)}
            >
              <MenuItem value="EVERYTIME">에브리타임</MenuItem>
              <MenuItem value="KAKAO">카카오톡 채팅방</MenuItem>
              <MenuItem value="INSTA_LETS">렛츠인턴 인스타그램</MenuItem>
              <MenuItem value="INSTA_AD">인스타그램 광고</MenuItem>
              <MenuItem value="PREV_PARTICIPATED">
                이전 기수 참여 경험 보유
              </MenuItem>
              <MenuItem value="PREV_RECOMMENDED">
                이전 기수 참여자 추천
              </MenuItem>
              <MenuItem value="ACQUAINTANCE">지인 추천</MenuItem>
            </Select>
          </FormControl>
          {program.way === 'ALL' && (
            <FormControl fullWidth sx={dropdownStyle}>
              <InputLabel id="way">온오프라인 참여 여부</InputLabel>
              <Select
                labelId="way"
                id="way"
                label="온오프라인 참여 여부"
                name="way"
                value={user.way}
                onChange={(e) => handleApplyInput(e)}
              >
                <MenuItem value="ONLINE">온라인 (Zoom)</MenuItem>
                <MenuItem value="OFFLINE">
                  오프라인 ({program.location})
                </MenuItem>
              </Select>
            </FormControl>
          )}
          <Input
            label="지원 동기"
            name="applyMotive"
            value={user.applyMotive}
            onChange={(e) => handleApplyInput(e)}
            multiline
            rows={4}
            maxLength={500}
          />
          {program.type === 'LETS_CHAT' && (
            <Input
              label="사전 질문 (선택)"
              placeholder="멘토님께 궁금한 점이 있다면, 사전질문으로 남겨주세요!"
              name="preQuestions"
              value={user.preQuestions}
              onChange={(e) => handleApplyInput(e)}
              multiline
              rows={4}
              maxLength={500}
            />
          )}
          <InputPriceContent
            program={{
              type: program.type,
              feeType: program.feeType,
              feeCharge: program.feeCharge,
              feeRefund: program.feeRefund,
              discountValue: program.discountValue,
            }}
            couponDiscount={couponDiscount}
            setCouponDiscount={setCouponDiscount}
            formData={user}
            setFormData={setUser}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </form>
    </>
  );
};

export default MemberInfoInputContent;
