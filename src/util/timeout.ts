import {promisify} from 'util';

const sleep = promisify(setTimeout);

export default async (logic: () => Promise<void>, time: number): Promise<void> => {
  await sleep(time);
  await logic();
};
