import {Bulb, BulbColor, BulbMode, BulbState} from '../types';
import connect from './connect';
import write from './write';

const parsePowerState = (buffer: Buffer): boolean => {
  const flag = buffer[2];
  return flag === 0x23;
};

const parseMode = (buffer: Buffer): BulbMode => {
  const patternFlag = buffer[3];

  if (patternFlag === 0x61 || patternFlag === 0x62) {
    if (buffer[9] !== 0) {
      return 'white';
    }
  }

  return 'color';
};

const parseColor = (buffer: Buffer): BulbColor => {
  return {r: buffer[6], g: buffer[7], b: buffer[8]};
};

export default async (bulb: Bulb): Promise<BulbState> => {
  const socket = await connect(bulb);

  try {
    const response = await write(socket, [0x81, 0x8a, 0x8b]);

    return {
      on: parsePowerState(response),
      mode: parseMode(response),
      color: parseColor(response),
    };
  } finally {
    socket.destroy();
  }
};
