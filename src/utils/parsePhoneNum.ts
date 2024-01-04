const parsePhoneNum = (phoneNum: string, toDash: boolean) => {
  if (toDash) {
    return `${phoneNum.slice(0, 3)}-${phoneNum.slice(3, 7)}-${phoneNum.slice(
      7,
      11,
    )}`;
  } else {
    return phoneNum.replace(/[^0-9]/g, '');
  }
};

export default parsePhoneNum;
