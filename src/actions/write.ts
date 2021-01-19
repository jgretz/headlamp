/* eslint-disable no-bitwise */
import {Socket} from 'net';

const DATA = 'data';
const handleData = (socket: Socket, resolve: (data: Buffer) => void) => (data: Buffer) => {
  socket.removeListener(DATA, handleData);
  resolve(data);
};

export default async (
  socket: Socket,
  message: number[],
  includeChecksum = true,
  waitForResponse = true,
): Promise<Buffer> => {
  // prep the message
  if (includeChecksum) {
    let sum = 0;
    for (let index = 0; index < message.length; index++) {
      sum += message[index];
    }
    message.push(sum & 0xff);
  }

  return new Promise<Buffer>((resolve) => {
    if (waitForResponse) {
      socket.on(DATA, handleData(socket, resolve));
    }

    socket.write(Buffer.from(message));

    if (!waitForResponse) {
      resolve(null);
    }
  });
};
