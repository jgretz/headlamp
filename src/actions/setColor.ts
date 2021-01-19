import {Bulb, BulbColor} from '../types';
import connect from './connect';
import write from './write';

export default async (bulb: Bulb, color: BulbColor): Promise<void> => {
  const socket = await connect(bulb);
  const command = [0x31, color.r, color.g, color.b, 0x00, 0x00, 0xf0, 0x0f];

  try {
    await write(socket, command, true, false);
  } finally {
    socket.destroy();
  }
};
