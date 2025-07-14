import { IFilter } from '../types/interface';

export interface FilterCheckedAction {
  type: string;
  value?: string;
}

export const initialFilterType = {
  CHALLENGE: false,
  LIVE: false,
  VOD: false,
};
export const initialFilterClassification = {
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

export function filterTypeReducer(
  status: IFilter,
  action: FilterCheckedAction,
) {
  const _status = { ...status };

  switch (action.type) {
    case 'init': {
      return { ...initialFilterType };
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

export function filterClassificationReducer(
  status: IFilter,
  action: FilterCheckedAction,
) {
  const _status = { ...status };

  switch (action.type) {
    case 'init': {
      return { ...initialFilterClassification };
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
      return { ...initialFilterStatus };
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
