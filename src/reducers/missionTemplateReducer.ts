import { IAction, IMissionTemplate } from '../interfaces/interface';

interface IMissionTemplateAction extends IAction {
  item?: IMissionTemplate;
  list?: IMissionTemplate[];
}

export default function missionTemplateReducer(
  missions: IMissionTemplate[],
  action: IMissionTemplateAction,
): IMissionTemplate[] {
  switch (action.type) {
    case 'add': {
      const i = missions?.findIndex(
        (mission: IMissionTemplate) => mission.id === action.item!.id,
      );
      if (i === -1) {
        return [action.item as IMissionTemplate, ...missions];
      }
      return [
        ...missions?.slice(0, i),
        action.item,
        ...missions?.slice(i + 1),
      ] as IMissionTemplate[];
    }

    case 'delete': {
      const i = missions?.findIndex(
        (mission) => mission.id === action.item!.id,
      );
      return [...missions?.slice(0, i), ...missions?.slice(i + 1)];
    }

    case 'init': {
      return [...action.list!];
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
