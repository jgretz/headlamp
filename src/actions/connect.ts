import net, {Socket} from 'net';
import {Bulb} from '../types';

const API_PORT = 5577;

export default async (bulb: Bulb): Promise<Socket> => {
  const socket = net.connect(API_PORT, bulb.address);

  return new Promise<Socket>((resolve) => {
    socket.on('connect', () => {
      resolve(socket);
    });
  });
};
