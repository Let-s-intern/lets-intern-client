// 챌린지 도메인 공용 색상 팔레트 / 색상 타입.
// 이전에는 ChallengePortfolioView 컴포넌트에서 export 하여 18개 파일이 페이지 컴포넌트를
// 색상 때문에 import 하는 역결합이 있었다. 도메인 공용 상수로 분리.

export const challengeColors = {
  _4D55F5: '#4D55F5',
  E45BFF: '#E45BFF',
  F3F4FF: '#F3F4FF',
  FDF6FF: '#FDF6FF',
  _763CFF: '#763CFF',
  _1A1D5F: '#1A1D5F',
  _757BFF: '#757BFF',
  _5C63FF: '#5C63FF',
  _222A7E: '#222A7E',
  _111449: '#111449',
  F2F2F5: '#F2F2F5',
  E8EAFF: '#E8EAFF',
  EDEEFE: '#EDEEFE',
  _4A76FF: '#4A76FF',
  F8AE00: '#F8AE00',
  F0F4FF: '#F0F4FF',
  FFF9EA: '#FFF9EA',
  _4A56FF: '#4A56FF',
  _1A2A5D: '#1A2A5D',
  F3F3F3: '#F3F3F3',
  DEE7FF: '#DEE7FF',
  FFF4DB: '#FFF4DB',
  _14BCFF: '#14BCFF',
  _32B750: '#32B750',
  FF9C34: '#FF9C34',
  EEFAFF: '#EEFAFF',
  FFF7EF: '#FFF7EF',
  _39DEFF: '#39DEFF',
  _20304F: '#20304F',
  EFF4F7: '#EFF4F7',
  F1FBFF: '#F1FBFF',
  DDF5FF: '#DDF5FF',
  E6F9DE: '#E6F9DE',
  F26646: '#F26646',
  FFF6F4: '#FFF6F4',
  EB7900: '#EB7900',
  FF8E36: '#FF8E36 ',
  FFC6B9: '#FFC6B9',
  FFF0ED: '#FFF0ED',
  FB8100: '#FB8100',
  _202776: '#202776',
  FFC8BC: '#FFC8BC',
  _261F1E: '#261F1E',
  ADC3FF: '#ADC3FF',
  B8BBFB: '#B8BBFB',
  A8E6FF: '#A8E6FF',
  FF5E00: '#FF5E00',
  FEEEE5: '#FEEEE5',
  _1BC47D: '#1BC47D',
  D1F3E5: '#D1F3E5',
  E8F9F2: '#E8F9F2',
};

export type ChallengeColor = {
  primary: string;
  basicInfoPrimary?: string | null;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  gradient: string;
  dark: string;
  subTitle: string;
  subBg: string;
  gradientBg: string;
  curriculumBg: string;
  recommendBg: string;
  recommendLogo: string;
  thumbnailBg: string;
};
