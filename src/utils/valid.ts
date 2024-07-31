const isValidPhoneNumber = (phoneNumber: string) => {
  const regex = /^01[0-9]-[0-9]{4}-[0-9]{4}$/;

  return regex.test(phoneNumber);
};

const isValidEmail = (email: string) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

const isValidPassword = (password: string) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\W).{8,}$/;
  return regex.test(password);
};

export { isValidEmail, isValidPassword, isValidPhoneNumber };
