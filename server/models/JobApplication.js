// server/models/JobApplication.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  dateSubmitted: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedDate: DataTypes.DATE,
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: DataTypes.STRING,
  applicationStatus: DataTypes.STRING,
  applicationType: DataTypes.STRING,
  resume: DataTypes.TEXT,
  coverLetter: DataTypes.TEXT,
  jobPostingURL: DataTypes.STRING,
  internalContactName: DataTypes.STRING,
  internalContactTitle: DataTypes.STRING,
  doubleDown: DataTypes.BOOLEAN,
  notesComments: DataTypes.TEXT,
  emailScreen: DataTypes.BOOLEAN,
  phoneScreen: DataTypes.BOOLEAN,
  interview: DataTypes.BOOLEAN,
});

export default JobApplication;