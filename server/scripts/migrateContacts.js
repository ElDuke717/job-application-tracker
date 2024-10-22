// scripts/migrateContacts.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../database.js';
import Contact from '../models/Contact.js';

async function migrateContacts() {
  const filePath = path.join(process.cwd(), 'data', 'contacts.json');

  // Read and parse the JSON data
  const data = fs.readFileSync(filePath, 'utf8');
  const contacts = JSON.parse(data);

  // Synchronize the database
  await sequelize.sync();

  // Optionally clear the Contacts table (uncomment if needed)
  // await Contact.destroy({ where: {} });

  for (const contactData of contacts) {
    try {
      const id = contactData.id || uuidv4();

      // Optionally skip existing contacts (uncomment if needed)
      // const existingContact = await Contact.findByPk(id);
      // if (existingContact) {
      //   console.log(`Contact with id ${id} already exists. Skipping...`);
      //   continue;
      // }

      const newContact = {
        id,
        name: contactData.name,
        company: contactData.company,
        title: contactData.title,
        email: contactData.email,
        phoneNumber: contactData.phoneNumber,
        linkedIn: contactData.linkedIn,
        twitter: contactData.twitter,
        relationship: contactData.relationship,
        interactionHistory: contactData.interactionHistory,
        professionalInterests: contactData.professionalInterests,
        opportunities: contactData.opportunities,
        personalNotes: contactData.personalNotes,
        lastContactDate: contactData.lastContactDate,
        futurePlans: contactData.futurePlans,
        referralStatus: contactData.referralStatus,
        feedback: contactData.feedback,
        links: contactData.links,
        sharedDocuments: contactData.sharedDocuments,
      };

      // Use upsert to insert or update
      await Contact.upsert(newContact);
      console.log(`Imported Contact: ${id}`);
    } catch (error) {
      console.error(`Error importing contact ${contactData.id}:`, error);
    }
  }

  console.log('Contacts migration completed.');
  await sequelize.close();
}

migrateContacts();