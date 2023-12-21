import { useEffect, useState } from 'react';
import cn from 'classnames';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import Input from '../../../components/Input';
import styles from './InputContent.module.scss';
import axios from '../../../libs/axios';
import { typeToText } from '../../../libs/converTypeToText';
import { isValidEmail, isValidPhoneNumber } from '../../../libs/valid';
import { useQuery } from 'react-query';

interface InputContent {
  program: any;
  formData: any;
  isLoggedIn: boolean;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setFormData: (formData: any) => void;
}

const InputContent = ({
  program,
  formData,
  isLoggedIn,
  setApplyPageIndex,
  setFormData,
}: InputContent) => {
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await axios.get('/user');
      return res.data;
    },
    enabled: isLoggedIn,
  });

  const { data: hasDetailInfo } = useQuery({
    queryKey: ['user', 'detail-info'],
    queryFn: async () => {
      const res = await axios.get('/user/detail-info');
      return res.data;
    },
    enabled: isLoggedIn,
  });

  const handleApplyInput = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    setLoading(true);
    if (isLoggedIn && userData && hasDetailInfo) {
      setFormData({
        ...userData,
        major: hasDetailInfo ? userData.major : '',
        university: hasDetailInfo ? userData.university : '',
      });
    } else {
      setFormData({});
    }
    setLoading(false);
  }, [isLoggedIn, userData, hasDetailInfo]);

  useEffect(() => {
    setIsNextButtonDisabled(true);
    if (!formData) return;
    if (
      formData.grade &&
      formData.wishCompany &&
      formData.wishJob &&
      formData.applyMotive &&
      formData.name &&
      formData.email &&
      formData.phoneNum &&
      formData.major &&
      formData.university &&
      formData.inflowPath &&
      (program.way === 'ALL' ? formData.way : true)
    ) {
      setIsNextButtonDisabled(false);
    }
  }, [formData]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (isNextButtonDisabled) return;
    if (!isValidEmail(formData.email)) {
      alert('이메일 형식이 올바르지 않습니다.');
      return;
    } else if (!isValidPhoneNumber(formData.phoneNum)) {
      alert('휴대폰 번호 형식이 올바르지 않습니다.');
      return;
    }
    setApplyPageIndex(3);
  };

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
    <form className={styles.content} onSubmit={handleSubmit}>
      <div>
        <h3>{typeToText[program.type]}</h3>
        <h2>{program.title}</h2>
      </div>
      {!loading && (
        <div className={styles['input-list']}>
          <Input
            label="이름"
            name="name"
            value={formData.name}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="이메일"
            name="email"
            placeholder="example@example.com"
            value={formData.email}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="전화번호"
            name="phoneNum"
            placeholder="010-1234-5678"
            value={formData.phoneNum}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="학교"
            name="university"
            placeholder="렛츠대학교"
            value={formData.university}
            onChange={(e) => handleApplyInput(e)}
            disabled={hasDetailInfo ? true : false}
          />
          <Input
            label="전공"
            name="major"
            placeholder="컴퓨터공학과"
            value={formData.major}
            onChange={(e) => handleApplyInput(e)}
            disabled={hasDetailInfo ? true : false}
          />
          <FormControl fullWidth sx={dropdownStyle}>
            <InputLabel id="grade">학년</InputLabel>
            <Select
              labelId="grade"
              id="grade"
              label="학년"
              name="grade"
              value={formData.grade}
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
            value={formData.wishJob}
            onChange={(e) => handleApplyInput(e)}
          />
          <Input
            label="희망 기업 형태"
            name="wishCompany"
            value={formData.wishCompany}
            onChange={(e) => handleApplyInput(e)}
          />
          <FormControl fullWidth sx={dropdownStyle}>
            <InputLabel id="inflowPath">유입 경로</InputLabel>
            <Select
              labelId="inflowPath"
              id="inflowPath"
              label="유입 경로"
              name="inflowPath"
              value={formData.inflowPath}
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
                value={formData.way}
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
            value={formData.applyMotive}
            onChange={(e) => handleApplyInput(e)}
            multiline
            rows={4}
          />
          {program.type === 'LETS_CHAT' && (
            <Input
              label="사전 질문 (선택)"
              placeholder="멘토님께 궁금한 점이 있다면, 사전질문으로 남겨주세요!"
              name="preQuestions"
              value={formData.preQuestions}
              onChange={(e) => handleApplyInput(e)}
              multiline
              rows={4}
            />
          )}
        </div>
      )}
      <button
        type="submit"
        className={cn({
          disabled: isNextButtonDisabled,
        })}
      >
        다음
      </button>
    </form>
  );
};

export default InputContent;
