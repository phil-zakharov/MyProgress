import { type ErrorRequestHandler } from 'express'

export const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  console.log(err)
}