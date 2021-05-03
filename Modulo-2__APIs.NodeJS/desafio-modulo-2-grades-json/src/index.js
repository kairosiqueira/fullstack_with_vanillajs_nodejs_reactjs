import express from 'express';
import router from './routes/routes.js';
import winston from 'winston';
 
const app = express();

const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File(
      { filename: 'src/logs/grades-control-api-log.log' }
    ),
  ],
  format: combine(
    label(
      { label: 'grades-control-api' }
    ),
    timestamp(),
    myFormat
  ),
});

app.use(express.json());
app.use('/', router);
app.listen(3000, () => console.log('Started API'));
