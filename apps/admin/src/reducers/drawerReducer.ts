// Drawer UI 열기/닫기
export default function drawerReducer(
  isOpen: boolean,
  action: {
    type: 'toggle' | 'close' | 'open';
  },
) {
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
