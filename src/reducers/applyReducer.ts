import { IAction } from '../interfaces/interface';

// 프로그램 신청 완료 모달 열기/닫기
export default function applyReducer(isOpen: boolean, action: IAction) {
  switch (action.type) {
    case 'toggle': {
      return !isOpen;
    }
    case 'close': {
      return false;
    }
    case 'open': {
      return true;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
