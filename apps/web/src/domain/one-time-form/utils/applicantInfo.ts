import type { User } from '@/api/user/user';

// 계약 5.6: name 1~50, email 형식·255 이하, phoneNum ^01\d-\d{3,4}-\d{4}$ (웹이 하이픈을 넣어 보낸다)

export interface ApplicantInfo {
  name: string;
  email: string;
  phoneNum: string;
}

export type ApplicantField = keyof ApplicantInfo;

export const APPLICANT_FIELDS: ApplicantField[] = ['name', 'email', 'phoneNum'];

export const EMPTY_APPLICANT_INFO: ApplicantInfo = {
  name: '',
  email: '',
  phoneNum: '',
};

const NAME_MAX_LENGTH = 50;
const EMAIL_MAX_LENGTH = 255;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^01\d-\d{3,4}-\d{4}$/;

/** 숫자만 남겨 11자리까지 자르고 끝 4자리를 마지막 묶음으로 하이픈을 넣는다. 예 01012345678 -> 010-1234-5678 */
export const formatPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, -4)}-${digits.slice(-4)}`;
};

/** 계정 정보로 채울 값. 연락 이메일이 있으면 그것을, 없으면 가입 이메일을 쓴다 */
export const applicantInfoFromUser = (
  user: Pick<User, 'name' | 'email' | 'contactEmail' | 'phoneNum'>,
): ApplicantInfo => ({
  name: user.name ?? '',
  email: user.contactEmail || user.email || '',
  phoneNum: user.phoneNum ? formatPhoneNumber(user.phoneNum) : '',
});

const validateName = (name: string): string | null => {
  const trimmed = name.trim();
  if (!trimmed) return '이름을 입력해 주세요.';
  return trimmed.length > NAME_MAX_LENGTH
    ? `이름은 ${NAME_MAX_LENGTH}자 이하로 입력해 주세요.`
    : null;
};

const validateEmail = (email: string): string | null => {
  const trimmed = email.trim();
  if (!trimmed) return '이메일을 입력해 주세요.';
  return trimmed.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(trimmed)
    ? null
    : '이메일 형식을 확인해 주세요.';
};

const validatePhoneNum = (phoneNum: string): string | null => {
  const trimmed = phoneNum.trim();
  if (!trimmed) return '전화번호를 입력해 주세요.';
  return PHONE_PATTERN.test(trimmed) ? null : '전화번호 형식을 확인해 주세요.';
};

/** 필수 정보 3개를 검사한다. 칸마다 문제가 없으면 null, 있으면 문구 */
export const validateApplicantInfo = (
  info: ApplicantInfo,
): Record<ApplicantField, string | null> => ({
  name: validateName(info.name),
  email: validateEmail(info.email),
  phoneNum: validatePhoneNum(info.phoneNum),
});
