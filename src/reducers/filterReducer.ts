import { IAction } from '../interfaces/interface';

interface FilterCheckedAction extends IAction {
  index?: number;
}

export const initialFilterName = [false, false, false];
export const initialFilterType = [false, false, false, false];
export const initialFilterStatus = [false, false, false];

export function filterNameReducer(
  status: boolean[],
  action: FilterCheckedAction,
) {
  const _status = [...status];

  switch (action.type) {
    case 'init': {
      return initialFilterName;
    }

    case 'check': {
      _status[action.index!] = true;
      return _status;
    }

    case 'uncheck': {
      _status[action.index!] = false;
      return _status;
    }

    case 'toggle': {
      _status[action.index!] = !_status[action.index!];
      return _status;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function filterTypeReducer(
  status: boolean[],
  action: FilterCheckedAction,
) {
  const _status = [...status];

  switch (action.type) {
    case 'init': {
      return initialFilterType;
    }

    case 'check': {
      _status[action.index!] = true;
      return _status;
    }

    case 'uncheck': {
      _status[action.index!] = false;
      return _status;
    }

    case 'toggle': {
      _status[action.index!] = !_status[action.index!];
      return _status;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function filterStatusReducer(
  status: boolean[],
  action: FilterCheckedAction,
) {
  const _status = [...status];

  switch (action.type) {
    case 'init': {
      return [false, false, false];
    }

    case 'check': {
      _status[action.index!] = true;
      return _status;
    }

    case 'uncheck': {
      _status[action.index!] = false;
      return _status;
    }

    case 'toggle': {
      _status[action.index!] = !_status[action.index!];
      return _status;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
