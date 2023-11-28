const parseInflowPath = (inflowPath: string): string => {
  if (inflowPath === 'EVERYTIME') {
    return '에브리타임';
  } else if (inflowPath === 'KAKAO') {
    return '카카오톡 채팅방';
  } else if (inflowPath === 'INSTA_LETS') {
    return '렛츠인턴 인스타그램';
  } else if (inflowPath === 'INSTA_AD') {
    return '인스타그램 광고';
  } else if (inflowPath === 'PREV_PARTICIPATED') {
    return '이전 기수 참여 경험 보유';
  } else if (inflowPath === 'PREV_RECOMMENDED') {
    return '이전 기수 참여자 추천';
  } else if (inflowPath === 'ACQUAINTANCE') {
    return '지인 추천';
  } else {
    return '기타';
  }
};

export default parseInflowPath;
