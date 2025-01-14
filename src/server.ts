/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { createServer } from 'http';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import swaggerDocs from './docs/swagger';
import { logger } from './config/Logger';
import { production, development, testing } from './db/config';
import session from 'express-session';
import router from './routes/index';
require('./associations/associations');
require('./utils/product.expiration.cron.job');
import { socketSetUp } from './utils/chat';
require('./associations/associations');
import startCronJob from './utils/password.expiration.cron.job';
import { socketserverstart } from './utils/notification';

startCronJob()
dotenv.config();

export function configureApp(): express.Application {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(router);
  app.get('/', (req, res) => {
    res.status(200).send('welcome to E-commerce API');
  });
  app.use(
    session({
      secret: '123',
      resave: false,
      saveUninitialized: false,
    }),
  );

  swaggerDocs(app, parseInt(`${PORT}`, 10));
  app.all('*', (req, res) => {
    res.status(404).json({
      message: `Route not found ${req.url}`,
    });
  });

  return app;
}

const PORT = process.env.PORT || 8000;
const app = configureApp();
export const server = createServer(app);
const isProduction = process.env.NODE_ENV === 'production';
const isTesting = process.env.NODE_ENV === 'testing';
const sequelize = isProduction ? production : isTesting ? testing : development;
socketserverstart(server);
sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');

    return sequelize.sync();
  })
  .then(() => {
    logger.info('Database tables synchronized successfully.');
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('Unable to connect to the database:', error);
  });
socketSetUp(server);
