import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import cn from 'classnames';
import { useEffect, useRef, useState } from 'react';

import Input from '../../../../../../../common/input/v1/Input';
import axios from '../../../../../../../utils/axios';
import { typeToText } from '../../../../../../../utils/converTypeToText';
import {
  isValidEmail,
  isValidPhoneNumber,
} from '../../../../../../../utils/valid';

import {
  bankTypeToText,
  wishJobToText,
} from '../../../../../../../utils/convert';
import InputPriceContent from '../../../ui/price/InputPriceContent';
import classes from './InputContent.module.scss';

interface InputContentProps {
  program: any;
  formData: any;
  isLoggedIn: boolean;
  wishJobList?: any;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setFormData: (formData: any) => void;
  setShowAlert: (showAlert: boolean) => void;
  setAlertInfo: (alertInfo: { title: string; message: string }) => void;
  couponDiscount: number;
  setCouponDiscount: (couponDiscount: number) => void;
}

interface ScrollableDiv extends HTMLDivElement {
  scrollTimeout?: number;
}

const InputContent = ({
  program,
  formData,
  isLoggedIn,
  wishJobList,
  setApplyPageIndex,
  setFormData,
  setShowAlert,
  setAlertInfo,
  couponDiscount,
  setCouponDiscount,
}: InputContentProps) => {
  const scrollRef = useRef<ScrollableDiv>(null);

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
    if (!isLoggedIn) {
      setFormData({});
      setLoading(false);
      return;
    }
    if (!hasDetailInfo) {
      setFormData({ ...userData });
      setLoading(false);
      return;
    }
    setFormData({
      ...userData,
      major: hasDetailInfo ? userData.major : '',
      university: hasDetailInfo ? userData.university : '',
    });
    setLoading(false);
  }, [isLoggedIn, userData, hasDetailInfo, setFormData]);

  useEffect(() => {
    if (loading) return;

    const handleScroll = () => {
      if (scrollRef.current) {
        scrollRef.current.classList.add('scrolling');

        clearTimeout(scrollRef.current.scrollTimeout);
        scrollRef.current.scrollTimeout = setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.classList.remove('scrolling');
          }
        }, 500) as unknown as number;
      }
    };

    const scrollableElement = scrollRef.current;
    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading, scrollRef]);

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
      (isLoggedIn ? formData.major && formData.university : true) &&
      formData.inflowPath &&
      (program.feeType === 'REFUND'
        ? formData.accountType && formData.accountNumber
        : true) &&
      (program.way === 'ALL' ? formData.way : true)
    ) {
      setIsNextButtonDisabled(false);
    }
  }, [program, formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextButtonDisabled) return;
    if (!isValidEmail(formData.email)) {
      setAlertInfo({
        title: '신청 정보 오류',
        message: '이메일 형식이 올바르지 않습니다.',
      });
      setShowAlert(true);
      return;
    } else if (!isValidPhoneNumber(formData.phoneNum)) {
      setAlertInfo({
        title: '신청 정보 오류',
        message: '휴대폰 번호 형식이 올바르지 않습니다.',
      });
      setShowAlert(true);
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
    <form className={classes.content} onSubmit={handleSubmit}>
      <div>
        <h3 className="program-type">{typeToText[program.type]}</h3>
        <h2 className="program-title">{program.title}</h2>
      </div>
      {!loading && (
        <div
          ref={scrollRef}
          className={cn(classes['input-list'], 'scrollable-box')}
        >
          <Input
            label="이름"
            name="name"
            value={formData.name ? formData.name : ''}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="이메일"
            name="email"
            placeholder="example@example.com"
            value={formData.email ? formData.email : ''}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          <Input
            label="전화번호"
            name="phoneNum"
            placeholder="010-1234-5678"
            value={formData.phoneNum ? formData.phoneNum : ''}
            onChange={(e) => handleApplyInput(e)}
            disabled={isLoggedIn}
          />
          {isLoggedIn && (
            <>
              <Input
                label="학교"
                name="university"
                placeholder="렛츠대학교"
                value={formData.university ? formData.university : ''}
                onChange={(e) => handleApplyInput(e)}
                disabled={hasDetailInfo ? true : false}
              />
              <Input
                label="전공"
                name="major"
                placeholder="컴퓨터공학과"
                value={formData.major ? formData.major : ''}
                onChange={(e) => handleApplyInput(e)}
                disabled={hasDetailInfo ? true : false}
              />
            </>
          )}
          {program.feeType === 'REFUND' && (
            <>
              <FormControl fullWidth sx={dropdownStyle}>
                <InputLabel id="acccount-type">환급계좌 은행</InputLabel>
                <Select
                  labelId="acccount-type"
                  id="acccount-type"
                  label="환급계좌 은행"
                  name="accountType"
                  value={formData.accountType ? formData.accountType : ''}
                  onChange={(e) => handleApplyInput(e)}
                >
                  {Object.keys(bankTypeToText).map((bankType: any) => (
                    <MenuItem key={bankType} value={bankType}>
                      {bankTypeToText[bankType]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Input
                label="환급계좌 번호"
                name="accountNumber"
                placeholder="- 없이 숫자만 입력"
                value={formData.accountNumber ? formData.accountNumber : ''}
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
              value={formData.grade ? formData.grade : ''}
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
              value={formData.wishJob ? formData.wishJob : ''}
              onChange={(e) => handleApplyInput(e)}
            >
              {wishJobList.map((wishJobKey: any) => (
                <MenuItem key={wishJobKey} value={wishJobKey}>
                  {wishJobToText[wishJobKey]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Input
            label="희망 기업 형태"
            name="wishCompany"
            value={formData.wishCompany ? formData.wishCompany : ''}
            onChange={(e) => handleApplyInput(e)}
          />
          <FormControl fullWidth sx={dropdownStyle}>
            <InputLabel id="inflowPath">유입 경로</InputLabel>
            <Select
              labelId="inflowPath"
              id="inflowPath"
              label="유입 경로"
              name="inflowPath"
              value={formData.inflowPath ? formData.inflowPath : ''}
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
                value={formData.way ? formData.way : ''}
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
            value={formData.applyMotive ? formData.applyMotive : ''}
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
              value={formData.preQuestions ? formData.preQuestions : ''}
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
            formData={formData}
            setFormData={setFormData}
            isLoggedIn={isLoggedIn}
          />
        </div>
      )}
      <button
        id="member_info_input_next_button"
        type="submit"
        className={cn('member-info-input-next-button', 'next-button', {
          disabled: isNextButtonDisabled,
        })}
      >
        다음
      </button>
    </form>
  );
};

export default InputContent;
