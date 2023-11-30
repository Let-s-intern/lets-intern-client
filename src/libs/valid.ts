// 정규식을 이용한 휴대폰 번호 유효성 검사
const isValidPhoneNumber = (phoneNumber: string) => {
  const regex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;

  return regex.test(phoneNumber);
};

// 정규식을 이용한 이메일 유효성 검사
const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

// 정규식을 이용한 비밀번호 유효성 검사
const isValidPassword = (password: string) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W).{8,}$/;
  return regex.test(password);
};

export { isValidPhoneNumber, isValidEmail, isValidPassword };
