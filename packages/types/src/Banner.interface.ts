export interface IBanner {
  id: number;
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  isValid: boolean;
  isVisible: boolean;
  imgUrl: string;
  mobileImgUrl: string;
}

export interface ILineBanner {
  id: number;
  title: string;
  colorCode: string;
  contents: string;
  startDate: string;
  endDate: string;
  isValid: boolean;
  link: string;
  textColorCode: string;
}
