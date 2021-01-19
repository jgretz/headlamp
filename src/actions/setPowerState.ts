import {Bulb} from '../types';
import connect from './connect';
import write from './write';

export default async (bulb: Bulb, state: boolean): Promise<void> => {
  const socket = await connect(bulb);
  const powerFlag = state ? 0x23 : 0x24;

  try {
    await write(socket, [0x71, powerFlag, 0x0f]);
  } finally {
    socket.destroy();
  }
};
