import { IAction, IFilter } from '../interfaces/interface';
import {
  PROGRAM_FILTER_NAME,
  PROGRAM_FILTER_STATUS,
  PROGRAM_FILTER_TYPE,
} from '../utils/programConst';

interface FilterCheckedAction extends IAction {
  value?: string;
}

export const initialFilterName = {
  [PROGRAM_FILTER_NAME.CHALLENGE]: false,
  [PROGRAM_FILTER_NAME.LIVE]: false,
  [PROGRAM_FILTER_NAME.VOD]: false,
};
export const initialFilterType = {
  [PROGRAM_FILTER_TYPE.MEETING_PREPARATION]: false,
  [PROGRAM_FILTER_TYPE.DOCUMENT_PREPARATION]: false,
  [PROGRAM_FILTER_TYPE.PASS]: false,
};
export const initialFilterStatus = {
  [PROGRAM_FILTER_STATUS.PREV]: false,
  [PROGRAM_FILTER_STATUS.PROCEEDING]: false,
  [PROGRAM_FILTER_STATUS.POST]: false,
};

export function filterNameReducer(
  status: IFilter,
  action: FilterCheckedAction,
) {
  const _status = { ...status };

  switch (action.type) {
    case 'init': {
      return initialFilterName;
    }

    case 'check': {
      _status[action.value!] = true;
      return _status;
    }

    case 'uncheck': {
      _status[action.value!] = false;
      return _status;
    }

    case 'toggle': {
      _status[action.value!] = !_status[action.value!];
      return _status;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function filterTypeReducer(
  status: IFilter,
  action: FilterCheckedAction,
) {
  const _status = { ...status };

  switch (action.type) {
    case 'init': {
      return initialFilterType;
    }

    case 'check': {
      _status[action.value!] = true;
      return _status;
    }

    case 'uncheck': {
      _status[action.value!] = false;
      return _status;
    }

    case 'toggle': {
      _status[action.value!] = !_status[action.value!];
      return _status;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function filterStatusReducer(
  status: IFilter,
  action: FilterCheckedAction,
) {
  const _status = { ...status };

  switch (action.type) {
    case 'init': {
      return initialFilterStatus;
    }

    case 'check': {
      _status[action.value!] = true;
      return _status;
    }

    case 'uncheck': {
      _status[action.value!] = false;
      return _status;
    }

    case 'toggle': {
      _status[action.value!] = !_status[action.value!];
      return _status;
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
