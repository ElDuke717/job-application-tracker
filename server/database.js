// server/database.js
import { Sequelize } from 'sequelize';
import path from 'path';

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(process.cwd(), 'data', 'database.sqlite'), // Path to your SQLite file
});

export default sequelize;