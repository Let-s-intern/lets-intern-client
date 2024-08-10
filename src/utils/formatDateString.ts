const formatDateString = (
  dateString: string,
  format?: { date: boolean; weekday: boolean; time: boolean },
) => {
  const date = new Date(dateString);

  // 날짜 부분만 포맷팅
  const dateOptions: any = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // 시간 부분만 포맷팅
  const timeOptions: any = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
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

  if (!format) {
    return `${formattedDate} (${weekdayShort}) ${formattedTime}`;
  }

  const resultFormatList = [];

  if (format?.date === true) {
    resultFormatList.push(`${formattedDate}`);
  }

  if (format?.weekday === true) {
    resultFormatList.push(`(${weekdayShort})`);
  }

  if (format?.time === true) {
    resultFormatList.push(`${formattedTime}`);
  }

  return resultFormatList.join(' ');
};

export default formatDateString;

export const formatMissionDateString = (dateString: string) => {
  const endDate = new Date(dateString);
  const weekdayList = ['일', '월', '화', '수', '목', '금', '토'];
  const formattedString = `${endDate.getMonth() + 1}/${endDate.getDate()}(${
    weekdayList[endDate.getDay()]
  }) ${
    endDate.getHours() > 9 ? endDate.getHours() : '0' + endDate.getHours()
  }:${
    endDate.getMinutes() > 9 ? endDate.getMinutes() : '0' + endDate.getMinutes()
  }`;
  return formattedString;
};
