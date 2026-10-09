
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import passport from 'passport'
import { HealthRouter } from './api/routers/health.route.js';
import { errorHandler } from './api/middleware/errorHandler.js';

const app = express()

app.use(helmet())
app.use(passport.initialize())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/health', HealthRouter)

app.use(errorHandler)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});