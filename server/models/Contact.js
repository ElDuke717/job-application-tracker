// server/models/Contact.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  company: DataTypes.STRING,
  title: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true,
    },
  },
  phoneNumber: DataTypes.STRING,
  linkedIn: DataTypes.STRING,
  twitter: DataTypes.STRING,
  relationship: DataTypes.STRING,
  interactionHistory: DataTypes.TEXT,
  professionalInterests: DataTypes.TEXT,
  opportunities: DataTypes.TEXT,
  personalNotes: DataTypes.TEXT,
  lastContactDate: DataTypes.DATE,
  futurePlans: DataTypes.TEXT,
  referralStatus: DataTypes.STRING,
  feedback: DataTypes.TEXT,
  links: DataTypes.TEXT,
  sharedDocuments: DataTypes.TEXT,
});

export default Contact;