// scripts/migrateJobSites.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../database.js';
import JobSite from '../models/JobSite.js';

async function migrateJobSites() {
  const filePath = path.join(process.cwd(), 'data', 'job-sites.json');

  // Read and parse the JSON data
  const data = fs.readFileSync(filePath, 'utf8');
  const sites = JSON.parse(data);

  // Synchronize the database
  await sequelize.sync();

  for (const siteData of sites) {
    try {
      const id = siteData.id || uuidv4();

      const newSite = {
        id,
        siteName: siteData.siteName,
        url: siteData.url,
        accountInfo: siteData.accountInfo,
        responseRate: siteData.responseRate,
        description: siteData.description,
        reviews: siteData.reviews,
        rating: siteData.rating,
        notes: siteData.notes,
        networking: siteData.networking,
        resourcesOffered: siteData.resourcesOffered,
        successRate: siteData.successRate,
        costOrFees: siteData.costOrFees,
        privacyAndSecurity: siteData.privacyAndSecurity,
        haveIUsed: siteData.haveIUsed,
      };

      await JobSite.create(newSite);
      console.log(`Imported Job Site: ${id}`);
    } catch (error) {
      console.error(`Error importing job site ${siteData.id}:`, error);
    }
  }

  console.log('Job sites migration completed.');
  await sequelize.close();
}

migrateJobSites();