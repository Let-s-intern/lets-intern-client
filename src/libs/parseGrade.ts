const parseGrade = (grade: number): string => {
  if (grade === 1) {
    return '1학년';
  } else if (grade === 2) {
    return '2학년';
  } else if (grade === 3) {
    return '3학년';
  } else if (grade === 4) {
    return '4학년';
  } else if (grade === 5) {
    return '5학년 이상';
  } else if (grade === -1) {
    return '졸업생';
  } else {
    return '기타';
  }
};

export default parseGrade;
