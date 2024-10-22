// server/models/JobSite.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const JobSite = sequelize.define('JobSite', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  siteName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: DataTypes.STRING,
  accountInfo: DataTypes.TEXT,
  responseRate: DataTypes.FLOAT,
  description: DataTypes.TEXT,
  reviews: DataTypes.TEXT,
  rating: DataTypes.FLOAT,
  notes: DataTypes.TEXT,
  networking: DataTypes.BOOLEAN,
  resourcesOffered: DataTypes.TEXT,
  successRate: DataTypes.FLOAT,
  costOrFees: DataTypes.STRING,
  privacyAndSecurity: DataTypes.TEXT,
  haveIUsed: DataTypes.BOOLEAN,
});

export default JobSite;