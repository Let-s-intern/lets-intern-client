// @see https://vike.dev/broken-npm-package#named-export-not-found
import * as pkg from '@mui/material/styles';
const { createTheme } = pkg;

export const theme = createTheme({
  palette: {
    primary: {
      main: '#F5F6FF',
    },
  },

  typography: {
    fontFamily: ['Pretendard Variable', 'sans-serif'].join(','),
  },

  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          fontWeight: 500,
          color: '#4D5358', // 기본 페이지 번호 색상
          '&:hover': {
            backgroundColor: '#F5F6FF', // hover 배경색
          },
          '&.Mui-selected': {
            backgroundColor: '#F5F6FF', // 선택된 페이지 배경색
            color: '#4D55F5', // 선택된 페이지 텍스트 색상
            '&:hover': {
              backgroundColor: '#F5F6FF', // 선택된 페이지 hover 색상
            },
          },
        },
      },
    },
  },
});
