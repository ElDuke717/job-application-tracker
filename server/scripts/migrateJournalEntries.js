// scripts/migrateJournalEntries.js
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../database.js';
import JournalEntry from '../models/JournalEntry.js';

async function migrateJournalEntries() {
  const filePath = path.join(process.cwd(), 'data', 'journalEntries.json');

  // Read and parse the JSON data
  const data = fs.readFileSync(filePath, 'utf8');
  const entries = JSON.parse(data);

  // Remove or adjust the sync call
  // await sequelize.sync({ alter: true }); // Commented out

  // Optionally synchronize without altering (uncomment if needed)
  await sequelize.sync();

  // Clear existing entries
  await JournalEntry.destroy({ where: {} });

  for (const entryData of entries) {
    try {
      const id = entryData.id || uuidv4();

      const newEntry = {
        id,
        date: entryData.date,
        content: entryData.content,
        tags: entryData.tags,
      };

      await JournalEntry.create(newEntry);
      console.log(`Imported Journal Entry: ${id}`);
    } catch (error) {
      console.error(`Error importing journal entry ${entryData.id}:`, error);
    }
  }

  console.log('Journal entries migration completed.');
  await sequelize.close();
}

migrateJournalEntries();