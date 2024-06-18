export interface IBanner {
  id: number;
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  isValid: boolean;
  isVisible: boolean;
  imgUrl: string;
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

export interface IBannerForm {
  title: string;
  link: string;
  startDate: string;
  endDate: string;
  imgUrl: string;
  mobileImgUrl?: string;
  file: File | null;
  mobileFile?: File | null;
}

export interface ILineBannerForm {
  title: string;
  colorCode: string;
  contents: string;
  startDate: string;
  endDate: string;
  link: string;
  textColorCode: string;
}
