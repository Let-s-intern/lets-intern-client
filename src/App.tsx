import { createTheme, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useState } from 'react';
import { Root } from 'react-dom/client';
import { Helmet } from 'react-helmet';
import { ZodError } from 'zod';
import Router from './Router';
import './fonts/font.css';
import './index.css';
import './styles/apply.scss';
import './styles/card.scss';
import './styles/github-markdown-light.css';
import './styles/modal.scss';
import './styles/mypage.scss';

declare global {
  interface Window {
    __root: Root;
    __lastRenderMode: 'blog' | 'catch_all';
  }
}

export const fontFamily = [
  'Pretendard Variable',
  '-apple-system',
  'BlinkMacSystemFont',
  'system-ui',
  'Roboto',
  'sans-serif',
].join(',');

const materialUiTheme = createTheme({
  typography: {
    fontFamily,
  },
  components: {
    MuiFormControl: {
      styleOverrides: {
        root: {
          fontFamily,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily,
        },
        body1: {
          fontFamily,
        },
      },
    },
  },
});

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 0 },
        },

        queryCache: new QueryCache({
          onError: (error) => {
            // eslint-disable-next-line no-console
            console.error(error);
            if (error instanceof ZodError) {
              // eslint-disable-next-line no-console
              console.log(error.issues);
            }
          },
        }),
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
        <Helmet>
          <meta name="robots" content="index,follow" />
          <meta property="og:site_name" content="렛츠커리어" />
          <title>렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요</title>
          <meta
            name="description"
            content="커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어"
          />
          <meta
            name="keywords"
            content="렛츠커리어, 렛츠인턴, 챌린지, 인턴, 신입, 취업, 취업준비, 취뽀, 인턴합격, 신입합격, 서류합격, 면접합격"
          />
          <meta
            property="og:title"
            content="렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요"
          />
          <meta
            property="og:description"
            content="커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어"
          />
          <meta
            property="twitter:title"
            content="렛츠커리어 | 인턴/신입, 커리어의 첫 걸음을 함께 해요"
          />
          <meta
            property="twitter:description"
            content="커리어 탐색, 서류 준비, 면접 준비까지 취업 준비생 관점에서 함께 하는 커리어 플랫폼, 렛츠커리어"
          />
          <meta
            property="og:image"
            content="https://letsintern-bucket.s3.ap-northeast-2.amazonaws.com/banner/popup/%E1%84%85%E1%85%A6%E1%86%BA%E1%84%8E%E1%85%B3%E1%84%8F%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%A5%20%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9%20og_image%201200_630.png"
          />
          <meta property="og:url" content="https://www.letscareer.co.kr/" />
        </Helmet>
        <ThemeProvider theme={materialUiTheme}>
          <Router />
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default App;
