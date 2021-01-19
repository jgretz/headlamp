import dgram, {Socket, RemoteInfo} from 'dgram';
import {Bulb} from '../types';

type SocketMessageListener = (message: Buffer, remoteInfo: RemoteInfo) => void;
type StopScanCallback = () => void;

const PORT = 48899;

const DISCOVERY_TIMEOUT = 1000;
const DISCOVER_PACKET = Buffer.from('HF-A11ASSISTHREAD');
const MASK = '255.255.255.255';

const INFO_PACKET = /^([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+),(.+),(.+)$/;

const createSocket = (processMessage: SocketMessageListener): Socket => {
  const socket = dgram.createSocket('udp4');
  socket.on('message', processMessage);
  socket.bind(PORT, () => socket.setBroadcast(true));

  return socket;
};

const sendDiscoveryPacket = (socket: Socket) => () => {
  socket.send(DISCOVER_PACKET, PORT, MASK);
};

const processSocketMessage = (bulbCache: Array<Bulb>) => (
  message: Buffer,
  remoteInfo: RemoteInfo,
): void => {
  if (message.equals(DISCOVER_PACKET)) {
    return;
  }

  const messageString = String(message);
  const info = messageString.match(INFO_PACKET);
  if (!info) {
    return;
  }

  const bulb = {
    id: info[2],
    model: info[3],
    address: remoteInfo.address,
    remotePort: remoteInfo.port,
  };

  const exists = bulbCache.find((x) => x.id === bulb.id);
  if (exists) {
    return;
  }
  bulbCache.push(bulb);
};

const scan = (socket: Socket): StopScanCallback => {
  const discoveryInterval = setInterval(sendDiscoveryPacket(socket), DISCOVERY_TIMEOUT);

  return () => {
    clearInterval(discoveryInterval);
  };
};

export default (timeout: number): Promise<Array<Bulb>> => {
  const bulbCache = new Array<Bulb>();
  const socket = createSocket(processSocketMessage(bulbCache));
  const stopScan = scan(socket);

  return new Promise<Array<Bulb>>((resolve: (cache: Array<Bulb>) => void) => {
    setTimeout(() => {
      stopScan();
      socket.close();

      resolve(bulbCache);
    }, timeout);
  });
};
