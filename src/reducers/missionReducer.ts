import { IAction, IMission } from '../interfaces/interface';

interface IMissionAction extends IAction {
  item: IMission;
}

export default function missionReducer(
  missions: IMission[],
  action: IMissionAction,
) {
  switch (action.type) {
    case 'add': {
      const i = missions.findIndex(
        (mission: IMission) => mission.id === action.item?.id,
      );
      if (i === -1) {
        return [action.item, ...missions];
      }
      return [...missions.slice(0, i), action.item, ...missions.slice(i + 1)];
    }

    case 'delete': {
      const i = missions.findIndex((mission) => mission.id === action.item.id);
      return [...missions.slice(0, i), ...missions.slice(i + 1)];
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
