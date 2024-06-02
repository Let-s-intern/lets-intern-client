import { IAction, IFilter } from '../interfaces/interface';

interface FilterCheckedAction extends IAction {
  value?: string;
}

export const initialFilterName = {
  CHALLENGE: false,
  LIVE: false,
  VOD: false,
};
export const initialFilterType = {
  CAREER_SEARCH: false,
  MEETING_PREPARATION: false,
  DOCUMENT_PREPARATION: false,
  PASS: false,
};
export const initialFilterStatus = {
  PREV: false,
  PROCEEDING: false,
  POST: false,
};

export function filterNameReducer(
  status: IFilter,
  action: FilterCheckedAction,
) {
  const _status = { ...status };
  console.log(status);

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
      _status[action.value!] = !status[action.value!];
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
