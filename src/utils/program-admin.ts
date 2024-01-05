export const convertResponseToForm = (data: any) => {
  const {
    id,
    status,
    content,
    faqList,
    headcount,
    isApproved,
    isVisible,
    ...values
  } = data;

  return values;
};

export const convertFormToRequest = (values: any, content: string) => {
  const reqData = {
    ...values,
    th: Number(values.th),
    announcementDate: '2023-12-20T19:30:00',
    location: '강남역',
    link: '',
    maxHeadcount: 30,
    notice: '필독',
    contents: content,
  };

  if (reqData.startDate instanceof Date) {
    reqData.startDate = reqData.startDate.toISOString().replace(/\.\d+Z$/, '');
  }

  if (reqData.dueDate instanceof Date) {
    reqData.dueDate = reqData.dueDate.toISOString().replace(/\.\d+Z$/, '');
  }

  return reqData;
};
