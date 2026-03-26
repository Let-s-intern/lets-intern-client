import {
  FULL_NAVBAR_HEIGHT_OFFSET,
  SINGLE_ROW_NAVBAR_HEIGHT_OFFSET,
} from '@/common/layout/header/NavBar';
import useScrollDirection from '@/hooks/useScrollDirection';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';
import { useMediaQuery } from '@mui/material';

/**
 * 프로그램 상페에서 스크롤 방향과 모바일 여부에 따라 네비게이션 바의 스타일 클래스를 반환하는 커스텀 훅
 * @returns {string} 스타일 클래스명
 */
export default function useProgramScrollDirectionStyle() {
  const scrollDirection = useScrollDirection();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  return scrollDirection === 'UP'
    ? `duration-300 ${isMobile ? SINGLE_ROW_NAVBAR_HEIGHT_OFFSET : FULL_NAVBAR_HEIGHT_OFFSET}`
    : '-top-0.5 duration-200 md:top-0';
}
