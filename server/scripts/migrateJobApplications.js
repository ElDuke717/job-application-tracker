// scripts/migrateJobApplications.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../database.js';
import JobApplication from '../models/JobApplication.js';

async function migrateJobApplications() {
  const filePath = path.join(process.cwd(), 'data', 'jobApplications.json');

  // Read and parse the JSON data
  const data = fs.readFileSync(filePath, 'utf8');
  const applications = JSON.parse(data);

  // Synchronize the database
  await sequelize.sync();

  for (const appData of applications) {
    try {
      // Ensure the application has an ID
      const id = appData.id || uuidv4();

      // Prepare the data
      const newApplication = {
        id,
        dateSubmitted: appData.dateSubmitted,
        updatedDate: appData.updatedDate,
        company: appData.company,
        jobTitle: appData.jobTitle,
        location: appData.location,
        applicationStatus: appData.applicationStatus,
        applicationType: appData.applicationType,
        resume: appData.resume,
        coverLetter: appData.coverLetter,
        jobPostingURL: appData.jobPostingURL,
        internalContactName: appData.internalContactName,
        internalContactTitle: appData.internalContactTitle,
        doubleDown: appData.doubleDown,
        notesComments: appData.notesComments,
        emailScreen: appData.emailScreen,
        phoneScreen: appData.phoneScreen,
        interview: appData.interview,
      };

      // Insert into the database
      await JobApplication.create(newApplication);
      console.log(`Imported Job Application: ${id}`);
    } catch (error) {
      console.error(`Error importing application ${appData.id}:`, error);
    }
  }

  console.log('Job applications migration completed.');
  await sequelize.close();
}

migrateJobApplications();