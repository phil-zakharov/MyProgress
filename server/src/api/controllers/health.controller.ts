import { type Request, type Response, type NextFunction } from 'express';

async function getHealth(req:Request, res: Response) {
  res.status(200).send({ status: 'ok' })
}

export const HealthController = { getHealth }