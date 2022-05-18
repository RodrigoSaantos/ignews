import { NextApiRequest, NextApiResponse } from 'next';

export default (resquest: NextApiRequest, response: NextApiResponse) => {
  console.log('Evento recebido');

  response.status(200).json({ ok: true });
};