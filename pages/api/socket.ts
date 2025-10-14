import { NextApiRequest } from 'next';
import SocketHandler, { NextApiResponseServerIo } from '@/lib/socket-server';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIo) {
  return SocketHandler(req, res);
}