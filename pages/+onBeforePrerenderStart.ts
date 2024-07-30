import { OnBeforePrerenderStartAsync } from 'vike/types';

export { onBeforePrerenderStart };

const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async () => {
  return ['/'];
};
