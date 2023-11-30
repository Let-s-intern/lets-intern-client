const formatDateString = (dateString: string) => {
  const date = new Date(dateString);

  // 날짜 부분만 포맷팅
  const dateOptions: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  };

  // 시간 부분만 포맷팅
  const timeOptions: any = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  };

  // 요일 계산
  const weekdayShortNames = ['일', '월', '화', '수', '목', '금', '토'];
  const weekdayShort = weekdayShortNames[date.getUTCDay()];

  // 날짜, 요일, 시간을 결합
  const formattedDate = new Intl.DateTimeFormat('ko-KR', dateOptions).format(
    date,
  );
  const formattedTime = new Intl.DateTimeFormat('ko-KR', timeOptions).format(
    date,
  );

  return `${formattedDate} (${weekdayShort}) ${formattedTime}`;
};

export default formatDateString;
