// models/JournalEntry.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const JournalEntry = sequelize.define('JournalEntry', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON, // Change from STRING to JSON
    allowNull: true,
  },
}, {
  // Additional model options if needed
});

export default JournalEntry;