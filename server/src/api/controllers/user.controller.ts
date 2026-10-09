import { type Request, type Response, type NextFunction } from 'express';
import { pool } from '../../database/connection.js';


async function getUsers(req: Request, res: Response) {
    try {
    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createUser(req: Request, res: Response) {
    const { name, email } = req.body;
  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const UserController = { getUsers, createUser };
