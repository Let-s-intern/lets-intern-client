import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Input from '../../../components/Input';

interface MemberInfoInputContentProps {
  user: any;
  hasDetailInfo: boolean;
  isLoggedIn: boolean;
  handleApplyInput: (e: any) => void;
}

const MemberInfoInputContent = ({
  user,
  hasDetailInfo,
  isLoggedIn,
  handleApplyInput,
}: MemberInfoInputContentProps) => {
  return (
    <>
      <h1 className="text-center text-xl">신청 정보</h1>
      <form className="mt-5 w-full">
        <div className="mx-auto max-w-md space-y-3">
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
            value={user.email}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            type="tel"
            label="전화번호"
            name="phoneNum"
            placeholder="-를 제외한 01012345678"
            value={user.phoneNum}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="학교"
            name="university"
            value={user.university}
            onChange={(e) => handleApplyInput(e)}
            disabled={hasDetailInfo}
          />
          <Input
            label="전공"
            name="major"
            value={user.major}
            onChange={(e) => handleApplyInput(e)}
            disabled={hasDetailInfo}
          />
          <FormControl fullWidth>
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
          <Input
            label="관심직군"
            name="wishJob"
            value={user.wishJob}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="희망 기업 형태"
            name="wishCompany"
            value={user.wishCompany}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="지원 동기"
            name="applyMotive"
            value={user.applyMotive}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="사전 질문"
            name="preQuestions"
            value={user.preQuestion}
            onChange={(e) => handleApplyInput(e)}
          />
          <FormControl fullWidth>
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
        </div>
      </form>
    </>
  );
};

export default MemberInfoInputContent;
